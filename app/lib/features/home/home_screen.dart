import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '../../core/config.dart';
import '../../core/websocket/websocket_service.dart';
import '../../core/orchon/orchon_service.dart';
import '../../core/auth/auth_service.dart';
import '../../core/updates/update_dialog.dart';
import '../../core/updates/update_service.dart';
import '../settings/settings_drawer.dart';
import '../terminal/quick_commands.dart';
import '../deployments/deployments_screen.dart';
import '../server/server_stats_screen.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      _initializeServices();
    });
  }

  Future<void> _initializeServices() async {
    await _waitForAuthToken();
    if (!mounted) return;

    // Connect WebSocket
    try {
      final wsService = ref.read(webSocketServiceProvider);
      wsService.connect(AppConfig.wsUrl, authToken: 'dev-token');
    } catch (e) {
      debugPrint('WebSocket init error: $e');
    }

    // Fetch deployments for stats
    try {
      await ref.read(deploymentsProvider.notifier).fetchDeployments(limit: 30);
    } catch (e) {
      debugPrint('Deployments fetch error: $e');
    }

    // Check for updates
    try {
      await showUpdateDialogIfAvailable(context, ref);
    } catch (e) {
      debugPrint('Update check error: $e');
    }
  }

  Future<void> _waitForAuthToken() async {
    const maxWaitMs = 10000;
    const checkIntervalMs = 200;
    var waited = 0;

    while (waited < maxWaitMs) {
      final authState = ref.read(authProvider);
      if (authState.status == AuthStatus.authenticated) {
        debugPrint('[Home] Auth ready after ${waited}ms');
        return;
      }

      if (authState.status == AuthStatus.unauthenticated ||
          authState.status == AuthStatus.error) {
        debugPrint('[Home] Auth status: ${authState.status} - proceeding without auth');
        return;
      }

      await Future.delayed(const Duration(milliseconds: checkIntervalMs));
      waited += checkIntervalMs;

      if (!mounted) return;
    }

    debugPrint('[Home] Warning: Auth not ready after ${maxWaitMs}ms');
  }

  @override
  Widget build(BuildContext context) {
    final connectionState = ref.watch(connectionStateProvider);

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            SvgPicture.asset(
              'assets/icon.svg',
              height: 28,
              width: 28,
            ),
            const SizedBox(width: 10),
            Text(
              'ORCHON',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w400,
                letterSpacing: 3,
                color: Colors.grey[400],
              ),
            ),
            const SizedBox(width: 8),
            _buildConnectionIndicator(connectionState),
          ],
        ),
        actions: [
          Builder(
            builder: (context) {
              final updateState = ref.watch(updateProvider);
              final hasUpdate = updateState.hasUpdate;

              return IconButton(
                icon: Stack(
                  clipBehavior: Clip.none,
                  children: [
                    const Icon(Icons.dashboard_customize_outlined),
                    if (hasUpdate)
                      Positioned(
                        right: -4,
                        top: -4,
                        child: Container(
                          width: 10,
                          height: 10,
                          decoration: BoxDecoration(
                            color: Colors.orange,
                            shape: BoxShape.circle,
                            border: Border.all(color: const Color(0xFF1A1A2E), width: 1.5),
                          ),
                        ),
                      ),
                  ],
                ),
                onPressed: () {
                  Scaffold.of(context).openEndDrawer();
                },
              );
            },
          ),
        ],
      ),
      endDrawer: const SettingsDrawer(),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Top row: Deployments, Quick Commands
            Expanded(
              child: Row(
                children: [
                  Expanded(child: _DeploymentsCard(ref: ref)),
                  const SizedBox(width: 12),
                  Expanded(child: _QuickCommandsCard()),
                ],
              ),
            ),
            const SizedBox(height: 12),
            // Middle row: Service Status (full width with stats)
            _ServiceStatusCard(ref: ref),
            const SizedBox(height: 12),
            // Bottom row: Launch Claude, Settings
            Expanded(
              child: Row(
                children: [
                  Expanded(child: _LaunchClaudeCard(ref: ref)),
                  const SizedBox(width: 12),
                  Expanded(child: _SettingsCard()),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildConnectionIndicator(AsyncValue<WsConnectionState> connectionState) {
    return connectionState.when(
      data: (state) {
        final Color color;
        final String tooltip;
        switch (state) {
          case WsConnectionState.authenticated:
            color = Colors.green;
            tooltip = 'Connected & authenticated';
          case WsConnectionState.connected:
            color = Colors.lightGreen;
            tooltip = 'Connected, authenticating...';
          case WsConnectionState.connecting:
            color = Colors.orange;
            tooltip = 'Connecting...';
          case WsConnectionState.disconnected:
            color = Colors.grey;
            tooltip = 'Disconnected';
          case WsConnectionState.error:
            color = Colors.red;
            tooltip = 'Connection error';
        }
        return Tooltip(
          message: tooltip,
          child: Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(
              color: color,
              shape: BoxShape.circle,
            ),
          ),
        );
      },
      loading: () => Container(
        width: 8,
        height: 8,
        decoration: const BoxDecoration(
          color: Colors.orange,
          shape: BoxShape.circle,
        ),
      ),
      error: (_, __) => Container(
        width: 8,
        height: 8,
        decoration: const BoxDecoration(
          color: Colors.red,
          shape: BoxShape.circle,
        ),
      ),
    );
  }
}

// =============================================================================
// Home Screen Cards
// =============================================================================

class _HomeCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String? subtitle;
  final Color accentColor;
  final VoidCallback onTap;
  final Widget? customContent;

  const _HomeCard({
    required this.icon,
    required this.title,
    this.subtitle,
    required this.accentColor,
    required this.onTap,
    this.customContent,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: const Color(0xFF1A1A2E),
      borderRadius: BorderRadius.circular(16),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: accentColor.withOpacity(0.3),
              width: 1,
            ),
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                accentColor.withOpacity(0.15),
                accentColor.withOpacity(0.05),
              ],
            ),
          ),
          child: customContent ?? Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: accentColor.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: accentColor, size: 24),
              ),
              const Spacer(),
              Text(
                title,
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
              if (subtitle != null) ...[
                const SizedBox(height: 4),
                Text(
                  subtitle!,
                  style: TextStyle(
                    color: Colors.grey[500],
                    fontSize: 12,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class _DeploymentsCard extends ConsumerWidget {
  final WidgetRef ref;

  const _DeploymentsCard({required this.ref});

  @override
  Widget build(BuildContext context, WidgetRef widgetRef) {
    final deploymentsState = widgetRef.watch(deploymentsProvider);
    final deployments = deploymentsState.deployments;

    // Count recent successes and failures
    final recentSuccesses = deployments.where((d) => d.status == 'success').length;
    final recentFailures = deployments.where((d) => d.status == 'failure').length;

    return _HomeCard(
      icon: Icons.rocket_launch_outlined,
      title: 'Deployments',
      subtitle: deployments.isEmpty
          ? 'View recent deploys'
          : '$recentSuccesses success, $recentFailures failed',
      accentColor: const Color(0xFF6366F1),
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const DeploymentsScreen()),
        );
      },
    );
  }
}

class _QuickCommandsCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return _HomeCard(
      icon: Icons.bolt,
      title: 'Quick Commands',
      subtitle: 'Service status, logs, deploy',
      accentColor: Colors.amber,
      onTap: () => showQuickCommands(context),
    );
  }
}

class _ServiceStatusCard extends ConsumerWidget {
  final WidgetRef ref;

  const _ServiceStatusCard({required this.ref});

  @override
  Widget build(BuildContext context, WidgetRef widgetRef) {
    final statsAsync = widgetRef.watch(serverStatsProvider);

    return statsAsync.when(
      data: (stats) {
        if (stats.isEmpty) {
          return _buildStatusCard(
            context: context,
            statusColor: Colors.grey,
            statusText: 'Unable to connect',
            loadText: '--',
            memText: '--',
            onRefresh: () => widgetRef.invalidate(serverStatsProvider),
          );
        }

        final load = stats['load'] as Map<String, dynamic>? ?? {};
        final memory = stats['memory'] as Map<String, dynamic>? ?? {};
        final cpuCount = stats['cpuCount'] ?? 1;
        final loadAvg = (load['avg1'] as num?)?.toDouble() ?? 0.0;
        final memPercent = memory['percentUsed'] ?? 0;

        // Determine health status
        final loadRatio = loadAvg / cpuCount;
        Color statusColor;
        String statusText;
        if (loadRatio > 2.0) {
          statusColor = Colors.red;
          statusText = 'High load';
        } else if (loadRatio > 1.0) {
          statusColor = Colors.orange;
          statusText = 'Moderate';
        } else {
          statusColor = Colors.green;
          statusText = 'Healthy';
        }

        return _buildStatusCard(
          context: context,
          statusColor: statusColor,
          statusText: statusText,
          loadText: '${loadAvg.toStringAsFixed(1)}/$cpuCount',
          memText: '$memPercent%',
          onRefresh: () => widgetRef.invalidate(serverStatsProvider),
        );
      },
      loading: () => _buildStatusCard(
        context: context,
        statusColor: Colors.grey,
        statusText: 'Loading...',
        loadText: '--',
        memText: '--',
        isLoading: true,
      ),
      error: (_, __) => _buildStatusCard(
        context: context,
        statusColor: Colors.red,
        statusText: 'Error',
        loadText: '--',
        memText: '--',
        onRefresh: () => widgetRef.invalidate(serverStatsProvider),
      ),
    );
  }

  Widget _buildStatusCard({
    required BuildContext context,
    required Color statusColor,
    required String statusText,
    required String loadText,
    required String memText,
    VoidCallback? onRefresh,
    bool isLoading = false,
  }) {
    return Material(
      color: const Color(0xFF1A1A2E),
      borderRadius: BorderRadius.circular(16),
      child: InkWell(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const ServerStatsScreen()),
          );
        },
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: statusColor.withOpacity(0.3),
              width: 1,
            ),
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                statusColor.withOpacity(0.15),
                statusColor.withOpacity(0.05),
              ],
            ),
          ),
          child: Row(
            children: [
              // Status icon
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: statusColor.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: isLoading
                    ? SizedBox(
                        width: 24,
                        height: 24,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: statusColor,
                        ),
                      )
                    : Icon(Icons.dns, color: statusColor, size: 24),
              ),
              const SizedBox(width: 16),
              // Status text
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'Service Status',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Container(
                          width: 8,
                          height: 8,
                          decoration: BoxDecoration(
                            color: statusColor,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          statusText,
                          style: TextStyle(
                            color: statusColor,
                            fontSize: 13,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              // Stats
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                mainAxisSize: MainAxisSize.min,
                children: [
                  _buildStatChip('Load', loadText, statusColor),
                  const SizedBox(height: 6),
                  _buildStatChip('Mem', memText, statusColor),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatChip(String label, String value, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.15),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            '$label: ',
            style: TextStyle(
              color: Colors.grey[500],
              fontSize: 11,
            ),
          ),
          Text(
            value,
            style: TextStyle(
              color: color,
              fontSize: 12,
              fontWeight: FontWeight.w600,
              fontFamily: 'monospace',
            ),
          ),
        ],
      ),
    );
  }
}

class _LaunchClaudeCard extends StatelessWidget {
  final WidgetRef ref;

  const _LaunchClaudeCard({required this.ref});

  @override
  Widget build(BuildContext context) {
    return _HomeCard(
      icon: Icons.smart_toy,
      title: 'Launch Claude',
      subtitle: 'AI assistant sessions',
      accentColor: const Color(0xFF8B5CF6),
      onTap: () => showSessionPicker(context, ref),
    );
  }
}

class _SettingsCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return _HomeCard(
      icon: Icons.settings_outlined,
      title: 'Settings',
      subtitle: 'Configure ORCHON',
      accentColor: Colors.grey,
      onTap: () {
        Scaffold.of(context).openEndDrawer();
      },
    );
  }
}
