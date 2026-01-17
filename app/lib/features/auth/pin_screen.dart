import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '../../core/auth/pin_service.dart';

/// PIN entry screen for unlocking the app
class PinEntryScreen extends ConsumerStatefulWidget {
  final VoidCallback onUnlocked;
  final VoidCallback? onLogout;

  const PinEntryScreen({
    super.key,
    required this.onUnlocked,
    this.onLogout,
  });

  @override
  ConsumerState<PinEntryScreen> createState() => _PinEntryScreenState();
}

class _PinEntryScreenState extends ConsumerState<PinEntryScreen> {
  String _pin = '';
  bool _isVerifying = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    // Try biometric auth on load
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _tryBiometrics();
    });
  }

  Future<void> _tryBiometrics() async {
    final pinState = ref.read(pinProvider);
    if (pinState.biometricsEnabled && pinState.biometricsAvailable) {
      final success = await ref.read(pinProvider.notifier).unlockWithBiometrics();
      if (success) {
        widget.onUnlocked();
      }
    }
  }

  void _addDigit(String digit) {
    if (_pin.length < 6) {
      setState(() {
        _pin += digit;
        _error = null;
      });

      // Auto-verify when PIN length matches (4-6 digits, try at 4+)
      if (_pin.length >= 4) {
        _verifyPin();
      }
    }
  }

  void _deleteDigit() {
    if (_pin.isNotEmpty) {
      setState(() {
        _pin = _pin.substring(0, _pin.length - 1);
        _error = null;
      });
    }
  }

  Future<void> _verifyPin() async {
    if (_isVerifying) return;

    setState(() => _isVerifying = true);

    final success = await ref.read(pinProvider.notifier).unlock(_pin);

    if (success) {
      widget.onUnlocked();
    } else {
      setState(() {
        _error = 'Incorrect PIN';
        _pin = '';
        _isVerifying = false;
      });
      HapticFeedback.heavyImpact();
    }
  }

  @override
  Widget build(BuildContext context) {
    final pinState = ref.watch(pinProvider);

    return Scaffold(
      backgroundColor: const Color(0xFF0F0F23),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              const Spacer(),
              // Logo and title
              SvgPicture.asset(
                'assets/icon.svg',
                height: 64,
                width: 64,
              ),
              const SizedBox(height: 16),
              Text(
                'ORCHON',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w400,
                  letterSpacing: 4,
                  color: Colors.grey[400],
                ),
              ),
              const SizedBox(height: 32),
              Text(
                'Enter PIN',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w500,
                  color: Colors.grey[300],
                ),
              ),
              const SizedBox(height: 24),
              // PIN dots
              _buildPinDots(),
              if (_error != null) ...[
                const SizedBox(height: 12),
                Text(
                  _error!,
                  style: TextStyle(color: Colors.red[400], fontSize: 14),
                ),
              ],
              const SizedBox(height: 32),
              // Keypad
              _buildKeypad(pinState),
              const Spacer(),
              // Logout option
              if (widget.onLogout != null)
                TextButton(
                  onPressed: widget.onLogout,
                  child: Text(
                    'Use email/password instead',
                    style: TextStyle(color: Colors.grey[500], fontSize: 14),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPinDots() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(6, (index) {
        final filled = index < _pin.length;
        return Container(
          margin: const EdgeInsets.symmetric(horizontal: 8),
          width: 16,
          height: 16,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: filled ? const Color(0xFF6366F1) : Colors.transparent,
            border: Border.all(
              color: filled ? const Color(0xFF6366F1) : Colors.grey[600]!,
              width: 2,
            ),
          ),
        );
      }),
    );
  }

  Widget _buildKeypad(PinState pinState) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: ['1', '2', '3'].map((d) => _buildKeypadButton(d)).toList(),
        ),
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: ['4', '5', '6'].map((d) => _buildKeypadButton(d)).toList(),
        ),
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: ['7', '8', '9'].map((d) => _buildKeypadButton(d)).toList(),
        ),
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Biometric button (if available)
            pinState.biometricsAvailable && pinState.biometricsEnabled
                ? _buildKeypadButton(
                    'bio',
                    icon: Icons.fingerprint,
                    onTap: _tryBiometrics,
                  )
                : const SizedBox(width: 80),
            _buildKeypadButton('0'),
            _buildKeypadButton('del', icon: Icons.backspace_outlined, onTap: _deleteDigit),
          ],
        ),
      ],
    );
  }

  Widget _buildKeypadButton(String value, {IconData? icon, VoidCallback? onTap}) {
    return GestureDetector(
      onTap: () {
        HapticFeedback.lightImpact();
        if (onTap != null) {
          onTap();
        } else if (value != 'bio' && value != 'del') {
          _addDigit(value);
        }
      },
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 12),
        width: 72,
        height: 72,
        decoration: BoxDecoration(
          color: const Color(0xFF1A1A2E),
          shape: BoxShape.circle,
          border: Border.all(color: Colors.grey[800]!, width: 1),
        ),
        child: Center(
          child: icon != null
              ? Icon(icon, color: Colors.grey[400], size: 28)
              : Text(
                  value,
                  style: const TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.w300,
                    color: Colors.white,
                  ),
                ),
        ),
      ),
    );
  }
}

/// PIN setup screen (shown after first login)
class PinSetupScreen extends ConsumerStatefulWidget {
  final VoidCallback onComplete;
  final VoidCallback onSkip;

  const PinSetupScreen({
    super.key,
    required this.onComplete,
    required this.onSkip,
  });

  @override
  ConsumerState<PinSetupScreen> createState() => _PinSetupScreenState();
}

class _PinSetupScreenState extends ConsumerState<PinSetupScreen> {
  String _pin = '';
  String _confirmPin = '';
  bool _isConfirming = false;
  bool _isSaving = false;
  String? _error;

  void _addDigit(String digit) {
    if (_isConfirming) {
      if (_confirmPin.length < 6) {
        setState(() {
          _confirmPin += digit;
          _error = null;
        });
        if (_confirmPin.length >= 4 && _confirmPin.length == _pin.length) {
          _verifyAndSave();
        }
      }
    } else {
      if (_pin.length < 6) {
        setState(() {
          _pin += digit;
          _error = null;
        });
      }
    }
  }

  void _deleteDigit() {
    if (_isConfirming) {
      if (_confirmPin.isNotEmpty) {
        setState(() {
          _confirmPin = _confirmPin.substring(0, _confirmPin.length - 1);
          _error = null;
        });
      }
    } else {
      if (_pin.isNotEmpty) {
        setState(() {
          _pin = _pin.substring(0, _pin.length - 1);
          _error = null;
        });
      }
    }
  }

  void _confirmPinEntry() {
    if (_pin.length >= 4) {
      setState(() {
        _isConfirming = true;
        _error = null;
      });
    }
  }

  Future<void> _verifyAndSave() async {
    if (_pin != _confirmPin) {
      setState(() {
        _error = 'PINs do not match';
        _confirmPin = '';
      });
      HapticFeedback.heavyImpact();
      return;
    }

    setState(() => _isSaving = true);

    final success = await ref.read(pinProvider.notifier).setupPin(_pin);

    if (success) {
      // Check if biometrics available and prompt
      final pinState = ref.read(pinProvider);
      if (pinState.biometricsAvailable) {
        final enableBio = await _showBiometricsPrompt();
        if (enableBio) {
          await ref.read(pinProvider.notifier).setBiometricsEnabled(true);
        }
      }
      widget.onComplete();
    } else {
      setState(() {
        _error = 'Failed to save PIN';
        _isSaving = false;
      });
    }
  }

  Future<bool> _showBiometricsPrompt() async {
    return await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF1A1A2E),
        title: const Row(
          children: [
            Icon(Icons.fingerprint, color: Color(0xFF6366F1)),
            SizedBox(width: 8),
            Text('Enable Biometrics?'),
          ],
        ),
        content: const Text(
          'Use fingerprint or face recognition for faster unlock.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Not now'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Enable'),
          ),
        ],
      ),
    ) ?? false;
  }

  @override
  Widget build(BuildContext context) {
    final currentPin = _isConfirming ? _confirmPin : _pin;

    return Scaffold(
      backgroundColor: const Color(0xFF0F0F23),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              const SizedBox(height: 48),
              // Logo
              SvgPicture.asset(
                'assets/icon.svg',
                height: 48,
                width: 48,
              ),
              const SizedBox(height: 24),
              Text(
                _isConfirming ? 'Confirm PIN' : 'Set up PIN',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w500,
                  color: Colors.grey[200],
                ),
              ),
              const SizedBox(height: 8),
              Text(
                _isConfirming
                    ? 'Enter your PIN again to confirm'
                    : 'Create a 4-6 digit PIN for quick access',
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey[500],
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 32),
              // PIN dots
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(6, (index) {
                  final filled = index < currentPin.length;
                  return Container(
                    margin: const EdgeInsets.symmetric(horizontal: 8),
                    width: 16,
                    height: 16,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: filled ? const Color(0xFF6366F1) : Colors.transparent,
                      border: Border.all(
                        color: filled ? const Color(0xFF6366F1) : Colors.grey[600]!,
                        width: 2,
                      ),
                    ),
                  );
                }),
              ),
              if (_error != null) ...[
                const SizedBox(height: 12),
                Text(
                  _error!,
                  style: TextStyle(color: Colors.red[400], fontSize: 14),
                ),
              ],
              const SizedBox(height: 24),
              // Continue button (for first entry)
              if (!_isConfirming && _pin.length >= 4)
                FilledButton(
                  onPressed: _confirmPinEntry,
                  child: const Text('Continue'),
                ),
              const Spacer(),
              // Keypad
              _buildKeypad(),
              const SizedBox(height: 24),
              // Skip option
              TextButton(
                onPressed: widget.onSkip,
                child: Text(
                  'Skip for now',
                  style: TextStyle(color: Colors.grey[500], fontSize: 14),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildKeypad() {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: ['1', '2', '3'].map((d) => _buildKeypadButton(d)).toList(),
        ),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: ['4', '5', '6'].map((d) => _buildKeypadButton(d)).toList(),
        ),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: ['7', '8', '9'].map((d) => _buildKeypadButton(d)).toList(),
        ),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const SizedBox(width: 72),
            _buildKeypadButton('0'),
            _buildKeypadButton('del', icon: Icons.backspace_outlined, onTap: _deleteDigit),
          ],
        ),
      ],
    );
  }

  Widget _buildKeypadButton(String value, {IconData? icon, VoidCallback? onTap}) {
    return GestureDetector(
      onTap: () {
        HapticFeedback.lightImpact();
        if (onTap != null) {
          onTap();
        } else if (value != 'del') {
          _addDigit(value);
        }
      },
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 8),
        width: 64,
        height: 64,
        decoration: BoxDecoration(
          color: const Color(0xFF1A1A2E),
          shape: BoxShape.circle,
          border: Border.all(color: Colors.grey[800]!, width: 1),
        ),
        child: Center(
          child: icon != null
              ? Icon(icon, color: Colors.grey[400], size: 24)
              : Text(
                  value,
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w300,
                    color: Colors.white,
                  ),
                ),
        ),
      ),
    );
  }
}
