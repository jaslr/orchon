import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/config.dart';
import '../../core/websocket/websocket_service.dart';
import '../../core/orchon/orchon_service.dart';
import '../../core/auth/auth_service.dart';
import '../../core/updates/update_dialog.dart';
import '../../core/updates/update_service.dart';
import '../settings/settings_drawer.dart';
import 'widgets/deployment_card.dart';
import 'deployment_detail_screen.dart';

class DeploymentsScreen extends ConsumerStatefulWidget {
  const DeploymentsScreen({super.key});

  @override
  ConsumerState<DeploymentsScreen> createState() => _DeploymentsScreenState();
}

class _DeploymentsScreenState extends ConsumerState<DeploymentsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      _initializeServices();
    });
  }

  Future<void> _initializeServices() async {
    // Wait for auth token to be available (auth flow may take time with cold starts)
    await _waitForAuthToken();
    if (!mounted) return;

    // Connect WebSocket
    try {
      final wsService = ref.read(webSocketServiceProvider);
      wsService.connect(AppConfig.wsUrl, authToken: 'dev-token');
    } catch (e) {
      debugPrint('WebSocket init error: $e');
    }

    // Fetch deployments (limit to 30 for homepage)
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

  /// Wait for auth to complete (with timeout)
  /// This handles the race condition where deployments fetch happens before auth completes
  Future<void> _waitForAuthToken() async {
    const maxWaitMs = 10000; // 10 seconds max (handles Fly.io cold starts)
    const checkIntervalMs = 200;
    var waited = 0;

    while (waited < maxWaitMs) {
      // Check auth STATE (not just token) - auth flow sets status after loading from secure storage
      final authState = ref.read(authProvider);
      if (authState.status == AuthStatus.authenticated) {
        debugPrint('[Deployments] Auth ready after ${waited}ms');
        return;
      }

      // Also check if we're unauthenticated (no stored creds) - don't wait forever
      if (authState.status == AuthStatus.unauthenticated ||
          authState.status == AuthStatus.error) {
        debugPrint('[Deployments] Auth status: ${authState.status} - proceeding without auth');
        return;
      }

      await Future.delayed(const Duration(milliseconds: checkIntervalMs));
      waited += checkIntervalMs;

      if (!mounted) return;
    }

    debugPrint('[Deployments] Warning: Auth not ready after ${maxWaitMs}ms');
  }

  @override
  Widget build(BuildContext context) {
    final deploymentsState = ref.watch(deploymentsProvider);
    final connectionState = ref.watch(connectionStateProvider);
    final selectedRepo = ref.watch(selectedRepoFilterProvider);
    final repoNames = ref.watch(repoNamesProvider);

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
            // Subtle repo filter dropdown
            if (repoNames.length > 1) ...[
              const SizedBox(width: 8),
              _buildRepoFilterDropdown(repoNames, selectedRepo),
            ],
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
      body: RefreshIndicator(
        onRefresh: () => ref.read(deploymentsProvider.notifier).refresh(),
        child: deploymentsState.isLoading && deploymentsState.deployments.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : deploymentsState.error != null && deploymentsState.deployments.isEmpty
                ? _buildErrorState(deploymentsState.error!)
                : deploymentsState.deployments.isEmpty
                    ? _buildEmptyState()
                    : _buildDeploymentsList(deploymentsState),
      ),
    );
  }

  Widget _buildRepoFilterDropdown(List<String> repoNames, String? selectedRepo) {
    return PopupMenuButton<String?>(
      tooltip: 'Filter by repo',
      offset: const Offset(0, 40),
      onSelected: (repo) {
        ref.read(selectedRepoFilterProvider.notifier).state = repo;
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: selectedRepo != null
              ? const Color(0xFF6366F1).withOpacity(0.15)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(6),
          border: Border.all(
            color: selectedRepo != null
                ? const Color(0xFF6366F1).withOpacity(0.4)
                : Colors.grey[700]!,
            width: 1,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              selectedRepo ?? 'All',
              style: TextStyle(
                fontSize: 11,
                color: selectedRepo != null
                    ? const Color(0xFF6366F1)
                    : Colors.grey[500],
                fontWeight: selectedRepo != null ? FontWeight.w600 : FontWeight.w400,
              ),
            ),
            const SizedBox(width: 4),
            Icon(
              Icons.arrow_drop_down,
              size: 16,
              color: selectedRepo != null
                  ? const Color(0xFF6366F1)
                  : Colors.grey[500],
            ),
          ],
        ),
      ),
      itemBuilder: (context) => [
        PopupMenuItem<String?>(
          value: null,
          child: Row(
            children: [
              Icon(
                selectedRepo == null ? Icons.check : Icons.circle_outlined,
                size: 16,
                color: selectedRepo == null ? const Color(0xFF6366F1) : Colors.grey[600],
              ),
              const SizedBox(width: 8),
              const Text('All repos'),
            ],
          ),
        ),
        const PopupMenuDivider(),
        ...repoNames.map((repo) => PopupMenuItem<String?>(
          value: repo,
          child: Row(
            children: [
              Icon(
                selectedRepo == repo ? Icons.check : Icons.circle_outlined,
                size: 16,
                color: selectedRepo == repo ? const Color(0xFF6366F1) : Colors.grey[600],
              ),
              const SizedBox(width: 8),
              Text(repo),
            ],
          ),
        )),
      ],
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

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.rocket_launch_outlined,
            size: 64,
            color: Colors.grey[600],
          ),
          const SizedBox(height: 16),
          Text(
            'No deployments yet',
            style: TextStyle(
              fontSize: 18,
              color: Colors.grey[400],
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Pull to refresh or wait for activity',
            style: TextStyle(
              color: Colors.grey[600],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorState(String error) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.cloud_off,
              size: 64,
              color: Colors.red[400],
            ),
            const SizedBox(height: 16),
            Text(
              'Failed to load deployments',
              style: TextStyle(
                fontSize: 18,
                color: Colors.grey[400],
              ),
            ),
            const SizedBox(height: 8),
            Text(
              error,
              style: TextStyle(
                color: Colors.grey[600],
                fontSize: 12,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            FilledButton.icon(
              onPressed: () => ref.read(deploymentsProvider.notifier).refresh(),
              icon: const Icon(Icons.refresh),
              label: const Text('Retry'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDeploymentsList(DeploymentsState state) {
    final selectedRepo = ref.watch(selectedRepoFilterProvider);

    // Filter deployments by repo name if selected
    final filteredDeployments = selectedRepo != null
        ? state.deployments.where((d) =>
            d.projectName.toLowerCase() == selectedRepo.toLowerCase()
          ).toList()
        : state.deployments;

    if (filteredDeployments.isEmpty && selectedRepo != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.filter_alt_off, size: 64, color: Colors.grey[600]),
            const SizedBox(height: 16),
            Text(
              'No deployments for "$selectedRepo"',
              style: TextStyle(fontSize: 18, color: Colors.grey[400]),
            ),
            const SizedBox(height: 8),
            TextButton(
              onPressed: () => ref.read(selectedRepoFilterProvider.notifier).state = null,
              child: const Text('Clear filter'),
            ),
          ],
        ),
      );
    }

    // Show deployments + footer with link to web dashboard
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: filteredDeployments.length + 1, // +1 for footer
      itemBuilder: (context, index) {
        // Footer at the end
        if (index == filteredDeployments.length) {
          return _buildFooter();
        }
        final deployment = filteredDeployments[index];
        return DeploymentCard(
          deployment: deployment,
          onTap: () => _openDeploymentDetail(deployment),
        );
      },
    );
  }

  Widget _buildFooter() {
    return Container(
      margin: const EdgeInsets.only(top: 8, bottom: 24),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1A2E),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[800]!, width: 1),
      ),
      child: Column(
        children: [
          Text(
            'Showing last 30 deployments',
            style: TextStyle(color: Colors.grey[500], fontSize: 13),
          ),
          const SizedBox(height: 12),
          TextButton.icon(
            onPressed: () async {
              final url = Uri.parse('https://orchon.pages.dev');
              if (await canLaunchUrl(url)) {
                await launchUrl(url, mode: LaunchMode.externalApplication);
              }
            },
            icon: const Icon(Icons.open_in_new, size: 18),
            label: const Text('View all on ORCHON Web'),
            style: TextButton.styleFrom(
              foregroundColor: const Color(0xFF6366F1),
            ),
          ),
        ],
      ),
    );
  }

  void _openDeploymentDetail(deployment) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => DeploymentDetailScreen(deployment: deployment),
      ),
    );
  }

}
