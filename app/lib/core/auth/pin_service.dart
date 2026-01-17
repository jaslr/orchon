import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:local_auth/local_auth.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Uses Android/iOS system lock screen for quick app unlock
class DeviceLockService {
  static const _lockEnabledKey = 'device_lock_enabled';

  final LocalAuthentication _localAuth = LocalAuthentication();

  /// Check if device has a lock screen configured
  Future<bool> isDeviceLockAvailable() async {
    try {
      return await _localAuth.isDeviceSupported();
    } catch (e) {
      debugPrint('[DeviceLock] Check error: $e');
      return false;
    }
  }

  /// Check if lock is enabled by user preference
  Future<bool> isLockEnabled() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_lockEnabledKey) ?? false;
  }

  /// Enable/disable device lock
  Future<void> setLockEnabled(bool enabled) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_lockEnabledKey, enabled);
    debugPrint('[DeviceLock] Lock ${enabled ? "enabled" : "disabled"}');
  }

  /// Authenticate using device lock screen (PIN/pattern/fingerprint/face)
  Future<bool> authenticate() async {
    try {
      final isEnabled = await isLockEnabled();
      if (!isEnabled) return true; // Lock not enabled, allow through

      final isAvailable = await isDeviceLockAvailable();
      if (!isAvailable) return true; // No lock screen, allow through

      final result = await _localAuth.authenticate(
        localizedReason: 'Unlock ORCHON',
        options: const AuthenticationOptions(
          stickyAuth: true,
          biometricOnly: false, // Allow PIN/pattern/password as well as biometrics
        ),
      );
      debugPrint('[DeviceLock] Auth result: $result');
      return result;
    } on PlatformException catch (e) {
      debugPrint('[DeviceLock] Auth error: ${e.message}');
      // On error, allow through rather than blocking
      return true;
    }
  }
}

/// Lock state for UI
enum LockStatus {
  unknown,    // Checking status
  locked,     // Needs unlock
  unlocked,   // Unlocked
}

class LockState {
  final LockStatus status;
  final bool lockAvailable;
  final bool lockEnabled;

  const LockState({
    this.status = LockStatus.unknown,
    this.lockAvailable = false,
    this.lockEnabled = false,
  });

  LockState copyWith({
    LockStatus? status,
    bool? lockAvailable,
    bool? lockEnabled,
  }) {
    return LockState(
      status: status ?? this.status,
      lockAvailable: lockAvailable ?? this.lockAvailable,
      lockEnabled: lockEnabled ?? this.lockEnabled,
    );
  }
}

class LockNotifier extends StateNotifier<LockState> {
  final DeviceLockService _service = DeviceLockService();

  LockNotifier() : super(const LockState()) {
    _initialize();
  }

  Future<void> _initialize() async {
    final lockAvailable = await _service.isDeviceLockAvailable();
    final lockEnabled = await _service.isLockEnabled();

    if (lockEnabled && lockAvailable) {
      state = state.copyWith(
        status: LockStatus.locked,
        lockAvailable: lockAvailable,
        lockEnabled: lockEnabled,
      );
      // Immediately try to authenticate
      await unlock();
    } else {
      state = state.copyWith(
        status: LockStatus.unlocked,
        lockAvailable: lockAvailable,
        lockEnabled: lockEnabled,
      );
    }
  }

  /// Trigger device lock screen authentication
  Future<bool> unlock() async {
    final success = await _service.authenticate();
    if (success) {
      state = state.copyWith(status: LockStatus.unlocked);
    }
    return success;
  }

  /// Enable/disable device lock
  Future<void> setLockEnabled(bool enabled) async {
    if (enabled) {
      // Verify user can authenticate before enabling
      final success = await _service.authenticate();
      if (!success) return;
    }
    await _service.setLockEnabled(enabled);
    state = state.copyWith(lockEnabled: enabled);
  }

  /// Lock the app (require unlock again)
  void lock() {
    if (state.lockEnabled && state.lockAvailable) {
      state = state.copyWith(status: LockStatus.locked);
    }
  }

  /// Re-check status
  Future<void> refresh() async {
    await _initialize();
  }
}

final lockProvider = StateNotifierProvider<LockNotifier, LockState>((ref) {
  return LockNotifier();
});
