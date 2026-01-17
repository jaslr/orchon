import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '../../core/auth/pin_service.dart';

/// Simple lock screen that triggers device authentication
class LockScreen extends ConsumerStatefulWidget {
  final VoidCallback? onUnlocked;
  final VoidCallback? onLogout;

  const LockScreen({super.key, this.onUnlocked, this.onLogout});

  @override
  ConsumerState<LockScreen> createState() => _LockScreenState();
}

class _LockScreenState extends ConsumerState<LockScreen> {
  bool _authenticating = false;

  @override
  void initState() {
    super.initState();
    // Auto-trigger authentication on screen load
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _triggerAuth();
    });
  }

  Future<void> _triggerAuth() async {
    if (_authenticating) return;

    setState(() => _authenticating = true);

    final success = await ref.read(lockProvider.notifier).unlock();

    if (mounted) {
      setState(() => _authenticating = false);

      if (success) {
        widget.onUnlocked?.call();
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F0F23),
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(32),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Logo
                SizedBox(
                  width: 100,
                  height: 100,
                  child: SvgPicture.asset(
                    'assets/icon.svg',
                    colorFilter: const ColorFilter.mode(
                      Color(0xFF6366F1),
                      BlendMode.srcIn,
                    ),
                  ),
                ),
                const SizedBox(height: 32),

                // Title
                const Text(
                  'ORCHON',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                    letterSpacing: 4,
                  ),
                ),
                const SizedBox(height: 16),

                // Status text
                Text(
                  _authenticating ? 'Authenticating...' : 'App Locked',
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.grey[400],
                  ),
                ),
                const SizedBox(height: 48),

                // Unlock button
                if (!_authenticating)
                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton.icon(
                      onPressed: _triggerAuth,
                      icon: const Icon(Icons.lock_open),
                      label: const Text(
                        'Unlock',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF6366F1),
                        foregroundColor: Colors.white,
                        shape: const RoundedRectangleBorder(
                          borderRadius: BorderRadius.zero,
                        ),
                      ),
                    ),
                  ),

                if (_authenticating)
                  const CircularProgressIndicator(
                    color: Color(0xFF6366F1),
                  ),

                const SizedBox(height: 24),

                // Logout option
                TextButton(
                  onPressed: widget.onLogout,
                  child: Text(
                    'Sign out',
                    style: TextStyle(
                      color: Colors.grey[500],
                      fontSize: 14,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
