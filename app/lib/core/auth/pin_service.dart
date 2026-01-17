import 'dart:convert';
import 'package:crypto/crypto.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:local_auth/local_auth.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// PIN authentication service for quick app unlock
class PinService {
  static const _pinHashKey = 'pin_hash';
  static const _pinEnabledKey = 'pin_enabled';
  static const _biometricsEnabledKey = 'biometrics_enabled';

  final LocalAuthentication _localAuth = LocalAuthentication();

  /// Hash a PIN using SHA-256
  String _hashPin(String pin) {
    final bytes = utf8.encode(pin);
    final digest = sha256.convert(bytes);
    return digest.toString();
  }

  /// Check if PIN is set up
  Future<bool> isPinSetup() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_pinEnabledKey) ?? false;
  }

  /// Set up a new PIN
  Future<bool> setupPin(String pin) async {
    if (pin.length < 4 || pin.length > 6) {
      debugPrint('[PinService] PIN must be 4-6 digits');
      return false;
    }

    try {
      final prefs = await SharedPreferences.getInstance();
      final hash = _hashPin(pin);
      await prefs.setString(_pinHashKey, hash);
      await prefs.setBool(_pinEnabledKey, true);
      debugPrint('[PinService] PIN set up successfully');
      return true;
    } catch (e) {
      debugPrint('[PinService] Failed to set up PIN: $e');
      return false;
    }
  }

  /// Verify a PIN
  Future<bool> verifyPin(String pin) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final storedHash = prefs.getString(_pinHashKey);
      if (storedHash == null) return false;

      final inputHash = _hashPin(pin);
      final valid = storedHash == inputHash;
      debugPrint('[PinService] PIN verification: ${valid ? "success" : "failed"}');
      return valid;
    } catch (e) {
      debugPrint('[PinService] PIN verification error: $e');
      return false;
    }
  }

  /// Clear PIN (for logout)
  Future<void> clearPin() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_pinHashKey);
    await prefs.setBool(_pinEnabledKey, false);
    await prefs.setBool(_biometricsEnabledKey, false);
    debugPrint('[PinService] PIN cleared');
  }

  /// Check if biometrics are available on device
  Future<bool> isBiometricsAvailable() async {
    try {
      final canCheck = await _localAuth.canCheckBiometrics;
      final isSupported = await _localAuth.isDeviceSupported();
      return canCheck && isSupported;
    } catch (e) {
      debugPrint('[PinService] Biometrics check error: $e');
      return false;
    }
  }

  /// Get available biometric types
  Future<List<BiometricType>> getAvailableBiometrics() async {
    try {
      return await _localAuth.getAvailableBiometrics();
    } catch (e) {
      debugPrint('[PinService] Get biometrics error: $e');
      return [];
    }
  }

  /// Check if biometrics are enabled by user
  Future<bool> isBiometricsEnabled() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_biometricsEnabledKey) ?? false;
  }

  /// Enable/disable biometrics
  Future<void> setBiometricsEnabled(bool enabled) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_biometricsEnabledKey, enabled);
    debugPrint('[PinService] Biometrics ${enabled ? "enabled" : "disabled"}');
  }

  /// Authenticate with biometrics
  Future<bool> authenticateWithBiometrics() async {
    try {
      final isEnabled = await isBiometricsEnabled();
      if (!isEnabled) return false;

      final isAvailable = await isBiometricsAvailable();
      if (!isAvailable) return false;

      final result = await _localAuth.authenticate(
        localizedReason: 'Unlock ORCHON',
        options: const AuthenticationOptions(
          stickyAuth: true,
          biometricOnly: true,
        ),
      );
      debugPrint('[PinService] Biometric auth: ${result ? "success" : "failed"}');
      return result;
    } on PlatformException catch (e) {
      debugPrint('[PinService] Biometric auth error: ${e.message}');
      return false;
    }
  }
}

/// PIN state for UI
enum PinStatus {
  unknown,    // Checking if PIN is set up
  notSetup,   // No PIN configured
  locked,     // PIN is set, needs unlock
  unlocked,   // Successfully unlocked
}

class PinState {
  final PinStatus status;
  final bool biometricsAvailable;
  final bool biometricsEnabled;
  final String? error;

  const PinState({
    this.status = PinStatus.unknown,
    this.biometricsAvailable = false,
    this.biometricsEnabled = false,
    this.error,
  });

  PinState copyWith({
    PinStatus? status,
    bool? biometricsAvailable,
    bool? biometricsEnabled,
    String? error,
  }) {
    return PinState(
      status: status ?? this.status,
      biometricsAvailable: biometricsAvailable ?? this.biometricsAvailable,
      biometricsEnabled: biometricsEnabled ?? this.biometricsEnabled,
      error: error,
    );
  }
}

class PinNotifier extends StateNotifier<PinState> {
  final PinService _service = PinService();

  PinNotifier() : super(const PinState()) {
    _initialize();
  }

  Future<void> _initialize() async {
    final isPinSetup = await _service.isPinSetup();
    final biometricsAvailable = await _service.isBiometricsAvailable();
    final biometricsEnabled = await _service.isBiometricsEnabled();

    state = state.copyWith(
      status: isPinSetup ? PinStatus.locked : PinStatus.notSetup,
      biometricsAvailable: biometricsAvailable,
      biometricsEnabled: biometricsEnabled,
    );

    // Try biometric auth immediately if available and enabled
    if (isPinSetup && biometricsEnabled && biometricsAvailable) {
      final success = await _service.authenticateWithBiometrics();
      if (success) {
        state = state.copyWith(status: PinStatus.unlocked);
      }
    }
  }

  /// Set up a new PIN
  Future<bool> setupPin(String pin) async {
    final success = await _service.setupPin(pin);
    if (success) {
      state = state.copyWith(status: PinStatus.unlocked);
    }
    return success;
  }

  /// Verify PIN and unlock
  Future<bool> unlock(String pin) async {
    final success = await _service.verifyPin(pin);
    if (success) {
      state = state.copyWith(status: PinStatus.unlocked, error: null);
    } else {
      state = state.copyWith(error: 'Incorrect PIN');
    }
    return success;
  }

  /// Try biometric unlock
  Future<bool> unlockWithBiometrics() async {
    final success = await _service.authenticateWithBiometrics();
    if (success) {
      state = state.copyWith(status: PinStatus.unlocked, error: null);
    }
    return success;
  }

  /// Enable/disable biometrics
  Future<void> setBiometricsEnabled(bool enabled) async {
    await _service.setBiometricsEnabled(enabled);
    state = state.copyWith(biometricsEnabled: enabled);
  }

  /// Clear PIN (logout)
  Future<void> clearPin() async {
    await _service.clearPin();
    state = state.copyWith(
      status: PinStatus.notSetup,
      biometricsEnabled: false,
    );
  }

  /// Lock the app (require PIN again)
  void lock() {
    if (state.status == PinStatus.unlocked) {
      state = state.copyWith(status: PinStatus.locked);
    }
  }

  /// Skip PIN setup
  void skipSetup() {
    state = state.copyWith(status: PinStatus.unlocked);
  }

  /// Re-check status
  Future<void> refresh() async {
    await _initialize();
  }
}

final pinProvider = StateNotifierProvider<PinNotifier, PinState>((ref) {
  return PinNotifier();
});
