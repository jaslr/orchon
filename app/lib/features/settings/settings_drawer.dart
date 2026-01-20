import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:package_info_plus/package_info_plus.dart';
import 'package:http/http.dart' as http;
import '../../core/updates/update_service.dart';
import '../../core/orchon/orchon_service.dart';
import '../../core/auth/auth_service.dart';
import '../../core/auth/pin_service.dart';
import '../../core/config.dart';
import '../terminal/ssh_terminal_screen.dart';
import '../terminal/quick_commands.dart';
import '../notifications/notifications_screen.dart';
import '../deployments/deployments_screen.dart';
import 'terminal_config_screen.dart';

/// Shows the Claude session picker bottom sheet
void showSessionPicker(BuildContext context, WidgetRef ref) {
  showModalBottomSheet(
    context: context,
    backgroundColor: const Color(0xFF1A1A2E),
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
    ),
    builder: (context) => _SessionPickerSheet(ref: ref),
  );
}

void _showDeploymentGroupsSheet(BuildContext context, WidgetRef ref) {
  showModalBottomSheet(
    context: context,
    backgroundColor: const Color(0xFF1A1A2E),
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
    ),
    builder: (context) => _DeploymentGroupsSheet(ref: ref),
  );
}

void _showConnectionSettings(BuildContext context, WidgetRef ref) {
  showDialog(
    context: context,
    builder: (context) => AlertDialog(
      backgroundColor: const Color(0xFF1A1A2E),
      title: const Row(
        children: [
          Icon(Icons.wifi, color: Color(0xFF6366F1)),
          SizedBox(width: 8),
          Text('Connection Settings'),
        ],
      ),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('WebSocket Server', style: TextStyle(color: Colors.grey[400], fontSize: 12)),
          const SizedBox(height: 4),
          Text(AppConfig.wsUrl, style: const TextStyle(fontFamily: 'monospace')),
          const SizedBox(height: 16),
          Text('API Endpoint', style: TextStyle(color: Colors.grey[400], fontSize: 12)),
          const SizedBox(height: 4),
          Text(AppConfig.orchonUrl, style: const TextStyle(fontFamily: 'monospace')),
          const SizedBox(height: 16),
          Text('Droplet IP', style: TextStyle(color: Colors.grey[400], fontSize: 12)),
          const SizedBox(height: 4),
          Text(AppConfig.dropletIp, style: const TextStyle(fontFamily: 'monospace')),
        ],
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Close'),
        ),
      ],
    ),
  );
}

class _DeploymentGroupsSheet extends ConsumerWidget {
  final WidgetRef ref;

  const _DeploymentGroupsSheet({required this.ref});

  @override
  Widget build(BuildContext context, WidgetRef widgetRef) {
    final repoNames = widgetRef.watch(repoNamesProvider);
    final selectedRepo = widgetRef.watch(selectedRepoFilterProvider);

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Text(
              'DEPLOYMENT GROUPS',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w400,
                letterSpacing: 3,
                color: Colors.grey[400],
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Filter deployments by repository name.',
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey[600],
              ),
            ),
            const SizedBox(height: 16),

            if (repoNames.isEmpty)
              Padding(
                padding: const EdgeInsets.all(16),
                child: Text(
                  'No repos found. Pull to refresh deployments.',
                  style: TextStyle(color: Colors.grey[500]),
                ),
              )
            else
              Column(
                children: [
                  // All option
                  ListTile(
                    leading: Icon(
                      selectedRepo == null
                          ? Icons.radio_button_checked
                          : Icons.radio_button_off,
                      color: selectedRepo == null
                          ? const Color(0xFF6366F1)
                          : Colors.grey,
                    ),
                    title: const Text('All', style: TextStyle(color: Colors.white)),
                    subtitle: Text(
                      'Show all deployments',
                      style: TextStyle(color: Colors.grey[600], fontSize: 12),
                    ),
                    onTap: () {
                      widgetRef.read(selectedRepoFilterProvider.notifier).state = null;
                      Navigator.pop(context);
                    },
                  ),
                  const Divider(color: Colors.grey),
                  // Repo options (already sorted alphabetically by repoNamesProvider)
                  ...repoNames.map((repo) => ListTile(
                    leading: Icon(
                      selectedRepo == repo
                          ? Icons.radio_button_checked
                          : Icons.radio_button_off,
                      color: selectedRepo == repo
                          ? const Color(0xFF6366F1)
                          : Colors.grey,
                    ),
                    title: Text(repo, style: const TextStyle(color: Colors.white)),
                    subtitle: Text(
                      'Filter by $repo',
                      style: TextStyle(color: Colors.grey[600], fontSize: 12),
                    ),
                    onTap: () {
                      widgetRef.read(selectedRepoFilterProvider.notifier).state = repo;
                      Navigator.pop(context);
                    },
                  )),
                ],
              ),
          ],
        ),
      ),
    );
  }
}

/// Provider for package info
final packageInfoProvider = FutureProvider<PackageInfo>((ref) async {
  return await PackageInfo.fromPlatform();
});

/// Provider for Telegram history
final telegramHistoryProvider = FutureProvider<List<Map<String, dynamic>>>((ref) async {
  try {
    final response = await http.get(
      Uri.parse('${AppConfig.orchonUrl}/telegram/history'),
      headers: {
        'Authorization': 'Bearer ${AppConfig.orchonApiSecret}',
      },
    ).timeout(const Duration(seconds: 10));

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final messages = (data['messages'] as List<dynamic>?) ?? [];
      return messages.map((m) => m as Map<String, dynamic>).toList();
    }
    return [];
  } catch (e) {
    debugPrint('Failed to fetch telegram history: $e');
    return [];
  }
});

/// Show Telegram history bottom sheet
void _showTelegramHistory(BuildContext context, WidgetRef ref) {
  showModalBottomSheet(
    context: context,
    backgroundColor: const Color(0xFF1A1A2E),
    isScrollControlled: true,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
    ),
    builder: (context) => _TelegramHistorySheet(ref: ref),
  );
}

class SettingsDrawer extends ConsumerWidget {
  const SettingsDrawer({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final packageInfoAsync = ref.watch(packageInfoProvider);

    return Drawer(
      backgroundColor: const Color(0xFF1A1A2E),
      child: SafeArea(
        child: Column(
          children: [
            // Header
            Container(
              padding: const EdgeInsets.all(24),
              width: double.infinity,
              decoration: BoxDecoration(
                color: const Color(0xFF0F0F23),
                border: Border(
                  bottom: BorderSide(
                    color: Colors.grey[800]!,
                    width: 1,
                  ),
                ),
              ),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Settings',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    'Configure ORCHON',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey,
                    ),
                  ),
                ],
              ),
            ),

            // Settings options
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(vertical: 8),
                children: [
                  // Deployments (first item)
                  _SettingsTile(
                    icon: Icons.rocket_launch_outlined,
                    title: 'Deployments',
                    subtitle: 'View recent deployments',
                    highlight: true,
                    onTap: () {
                      Navigator.pop(context); // Close drawer
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const DeploymentsScreen(),
                        ),
                      );
                    },
                  ),
                  // Primary: Launch Claude
                  _LaunchClaudeTile(ref: ref),
                  // Secondary: Launch Bash
                  _SettingsTile(
                    icon: Icons.terminal,
                    title: 'Launch Bash',
                    subtitle: 'SSH shell to droplet',
                    onTap: () {
                      Navigator.pop(context); // Close drawer
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const SshTerminalScreen(
                            launchMode: LaunchMode.bash,
                          ),
                        ),
                      );
                    },
                  ),
                  // Quick Commands
                  _SettingsTile(
                    icon: Icons.bolt,
                    title: 'Quick Commands',
                    subtitle: 'Service status, logs, deploy',
                    onTap: () {
                      Navigator.pop(context); // Close drawer
                      showQuickCommands(context);
                    },
                  ),
                  const Divider(color: Colors.grey, height: 32),
                  // Section: Settings
                  Padding(
                    padding: const EdgeInsets.only(left: 16, bottom: 8),
                    child: Text(
                      'SETTINGS',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w400,
                        letterSpacing: 2,
                        color: Colors.grey[600],
                      ),
                    ),
                  ),
                  // Terminal Config
                  _SettingsTile(
                    icon: Icons.terminal,
                    title: 'Terminal',
                    subtitle: 'SSH and command settings',
                    onTap: () {
                      Navigator.pop(context); // Close drawer
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const TerminalConfigScreen(),
                        ),
                      );
                    },
                  ),
                  // Deployment Groups
                  _SettingsTile(
                    icon: Icons.folder_outlined,
                    title: 'Deployment Groups',
                    subtitle: 'Filter by owner (synced with ORCHON)',
                    onTap: () => _showDeploymentGroupsSheet(context, ref),
                  ),
                  _SettingsTile(
                    icon: Icons.wifi,
                    title: 'Connection',
                    subtitle: 'WebSocket server settings',
                    onTap: () {
                      Navigator.pop(context); // Close drawer
                      _showConnectionSettings(context, ref);
                    },
                  ),
                  _SettingsTile(
                    icon: Icons.notifications_outlined,
                    title: 'Notifications',
                    subtitle: 'Push notification rules',
                    onTap: () {
                      Navigator.pop(context); // Close drawer
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const NotificationsScreen(),
                        ),
                      );
                    },
                  ),
                  _SettingsTile(
                    icon: Icons.color_lens_outlined,
                    title: 'Appearance',
                    subtitle: 'Terminal font size & display',
                    onTap: () {
                      Navigator.pop(context); // Close drawer
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const TerminalConfigScreen(),
                        ),
                      );
                    },
                  ),
                  _DeviceLockTile(ref: ref),
                  _UpdateTile(ref: ref),
                  const Divider(color: Colors.grey, height: 32),
                  // Section: Server Management
                  Padding(
                    padding: const EdgeInsets.only(left: 16, bottom: 8),
                    child: Text(
                      'SERVER',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w400,
                        letterSpacing: 2,
                        color: Colors.grey[600],
                      ),
                    ),
                  ),
                  _ServerStatsTile(ref: ref),
                  _SettingsTile(
                    icon: Icons.memory,
                    title: 'Processes',
                    subtitle: 'View and manage server processes',
                    onTap: () => _showProcessManager(context, ref),
                  ),
                  _KillChromeTile(ref: ref),
                  const Divider(color: Colors.grey, height: 32),
                  // Section: Telegram
                  Padding(
                    padding: const EdgeInsets.only(left: 16, bottom: 8),
                    child: Text(
                      'TELEGRAM',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w400,
                        letterSpacing: 2,
                        color: Colors.grey[600],
                      ),
                    ),
                  ),
                  _SettingsTile(
                    icon: Icons.chat_bubble_outline,
                    title: 'Bot History',
                    subtitle: 'Recent Telegram conversations',
                    onTap: () => _showTelegramHistory(context, ref),
                  ),
                  const Divider(color: Colors.grey, height: 32),
                  _SettingsTile(
                    icon: Icons.info_outline,
                    title: 'About',
                    subtitle: 'App information and licenses',
                    onTap: () async {
                      final packageInfo = await PackageInfo.fromPlatform();
                      if (!context.mounted) return;
                      showAboutDialog(
                        context: context,
                        applicationName: 'ORCHON',
                        applicationVersion: '${packageInfo.version} (${packageInfo.buildNumber})',
                        applicationIcon: ClipRRect(
                          borderRadius: BorderRadius.circular(12),
                          child: Image.asset(
                            'assets/icon.png',
                            width: 64,
                            height: 64,
                            errorBuilder: (_, __, ___) => const Icon(Icons.monitor_heart, size: 48, color: Color(0xFF6366F1)),
                          ),
                        ),
                        children: [
                          const SizedBox(height: 16),
                          const Text('Infrastructure Observatory & DevOps Control Plane'),
                          const SizedBox(height: 8),
                          Text('Monitor deployments, manage Claude sessions, and control your infrastructure.',
                            style: TextStyle(color: Colors.grey[600], fontSize: 12)),
                          const SizedBox(height: 16),
                          Text('Built with Flutter', style: TextStyle(color: Colors.grey[500], fontSize: 11)),
                        ],
                      );
                    },
                  ),
                  const Divider(color: Colors.grey, height: 32),
                  // Sign Out
                  _SignOutTile(ref: ref),
                ],
              ),
            ),

            // Version info at bottom
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: const Color(0xFF0F0F23),
                border: Border(
                  top: BorderSide(
                    color: Colors.grey[800]!,
                    width: 1,
                  ),
                ),
              ),
              child: packageInfoAsync.when(
                data: (info) => Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: const Color(0xFF6366F1).withOpacity(0.2),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: const Color(0xFF6366F1).withOpacity(0.5),
                            ),
                          ),
                          child: Text(
                            'v${info.version}',
                            style: const TextStyle(
                              color: Color(0xFF6366F1),
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Build ${info.buildNumber}',
                      style: TextStyle(
                        color: Colors.grey[600],
                        fontSize: 12,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      info.packageName,
                      style: TextStyle(
                        color: Colors.grey[700],
                        fontSize: 11,
                        fontFamily: 'monospace',
                      ),
                    ),
                  ],
                ),
                loading: () => const Center(
                  child: SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  ),
                ),
                error: (_, __) => Text(
                  'Version info unavailable',
                  style: TextStyle(color: Colors.grey[600]),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SettingsTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;
  final bool highlight;

  const _SettingsTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
    this.highlight = false,
  });

  @override
  Widget build(BuildContext context) {
    final highlightColor = const Color(0xFF6366F1);

    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: highlight ? highlightColor.withOpacity(0.2) : Colors.grey[850],
          borderRadius: BorderRadius.circular(8),
          border: highlight ? Border.all(color: highlightColor.withOpacity(0.5)) : null,
        ),
        child: Icon(icon, color: highlight ? highlightColor : Colors.grey[400], size: 20),
      ),
      title: Text(
        title,
        style: TextStyle(
          color: highlight ? highlightColor : Colors.white,
          fontWeight: FontWeight.w500,
        ),
      ),
      subtitle: Text(
        subtitle,
        style: TextStyle(
          color: Colors.grey[600],
          fontSize: 12,
        ),
      ),
      trailing: Icon(
        Icons.chevron_right,
        color: highlight ? highlightColor : Colors.grey[600],
      ),
      onTap: onTap,
    );
  }
}

class _UpdateTile extends StatelessWidget {
  final WidgetRef ref;

  const _UpdateTile({required this.ref});

  @override
  Widget build(BuildContext context) {
    final updateState = ref.watch(updateProvider);

    String subtitle;
    IconData icon = Icons.system_update_outlined;
    bool isLoading = false;
    bool hasUpdate = updateState.hasUpdate;
    Color? highlightColor = hasUpdate ? Colors.orange : null;

    switch (updateState.status) {
      case UpdateStatus.checking:
        subtitle = 'Checking for updates...';
        isLoading = true;
        break;
      case UpdateStatus.available:
        subtitle = 'v${updateState.updateInfo?.version} available - tap to install';
        icon = Icons.download;
        break;
      case UpdateStatus.downloading:
        subtitle = 'Downloading: ${(updateState.downloadProgress * 100).toInt()}%';
        isLoading = true;
        break;
      case UpdateStatus.readyToInstall:
        subtitle = 'Tap to install v${updateState.updateInfo?.version}';
        icon = Icons.install_mobile;
        break;
      case UpdateStatus.upToDate:
        // Only show "up to date" if we actually checked
        final lastChecked = updateState.lastChecked;
        if (lastChecked != null) {
          final ago = DateTime.now().difference(lastChecked);
          if (ago.inMinutes < 1) {
            subtitle = 'Up to date (just now)';
          } else if (ago.inHours < 1) {
            subtitle = 'Up to date (${ago.inMinutes}m ago)';
          } else {
            subtitle = 'Up to date (${ago.inHours}h ago)';
          }
        } else {
          subtitle = 'Tap to check for updates';
        }
        icon = Icons.check_circle_outline;
        break;
      case UpdateStatus.error:
        subtitle = 'Error: ${updateState.errorMessage}';
        icon = Icons.error_outline;
        break;
      default:
        subtitle = 'Tap to check for updates';
    }

    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: hasUpdate ? Colors.orange.withOpacity(0.2) : Colors.grey[850],
          borderRadius: BorderRadius.circular(8),
          border: hasUpdate ? Border.all(color: Colors.orange.withOpacity(0.5)) : null,
        ),
        child: isLoading
            ? const SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(strokeWidth: 2),
              )
            : Icon(icon, color: highlightColor ?? Colors.grey[400], size: 20),
      ),
      title: Text(
        hasUpdate ? 'Update Available' : 'Check for Update',
        style: TextStyle(
          color: highlightColor ?? Colors.white,
          fontWeight: FontWeight.w500,
        ),
      ),
      subtitle: Text(
        subtitle,
        style: TextStyle(
          color: hasUpdate ? Colors.orange[300] : Colors.grey[600],
          fontSize: 12,
        ),
      ),
      trailing: Icon(
        Icons.chevron_right,
        color: highlightColor ?? Colors.grey[600],
      ),
      onTap: () {
        if (updateState.status == UpdateStatus.available) {
          ref.read(updateProvider.notifier).downloadAndInstall();
        } else if (updateState.status == UpdateStatus.readyToInstall) {
          ref.read(updateProvider.notifier).installUpdate();
        } else if (!isLoading) {
          ref.read(updateProvider.notifier).checkForUpdate();
        }
      },
    );
  }
}

class _LaunchClaudeTile extends StatelessWidget {
  final WidgetRef ref;

  const _LaunchClaudeTile({required this.ref});

  @override
  Widget build(BuildContext context) {
    final highlightColor = const Color(0xFF6366F1);

    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: highlightColor.withOpacity(0.2),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: highlightColor.withOpacity(0.5)),
        ),
        child: Icon(Icons.smart_toy, color: highlightColor, size: 20),
      ),
      title: Text(
        'Launch Claude',
        style: TextStyle(
          color: highlightColor,
          fontWeight: FontWeight.w500,
        ),
      ),
      subtitle: Text(
        'AI assistant via SSH',
        style: TextStyle(
          color: Colors.grey[600],
          fontSize: 12,
        ),
      ),
      trailing: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          IconButton(
            icon: Icon(Icons.list, color: highlightColor),
            onPressed: () => showSessionPicker(context, ref),
            tooltip: 'Session options',
            padding: EdgeInsets.zero,
            constraints: const BoxConstraints(),
            iconSize: 24,
          ),
          const SizedBox(width: 8),
          Icon(Icons.chevron_right, color: highlightColor),
        ],
      ),
      onTap: () {
        Navigator.pop(context); // Close drawer
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => const SshTerminalScreen(
              launchMode: LaunchMode.claude,
            ),
          ),
        );
      },
    );
  }
}

class _SessionPickerSheet extends StatefulWidget {
  final WidgetRef ref;

  const _SessionPickerSheet({required this.ref});

  @override
  State<_SessionPickerSheet> createState() => _SessionPickerSheetState();
}

class _SessionPickerSheetState extends State<_SessionPickerSheet> {
  List<Map<String, String>> _sessions = [];
  List<Map<String, String>> _projects = [];
  bool _isLoading = true;
  bool _projectsLoading = true;
  String? _error;
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    // Load projects and sessions in parallel
    await Future.wait([
      _loadProjects(),
      _loadSessions(),
    ]);
  }

  Future<void> _loadProjects() async {
    final config = widget.ref.read(terminalConfigProvider);

    try {
      // Fetch projects from droplet /projects endpoint
      final url = 'http://${config.dropletIp}:8406/projects';
      final response = await http.get(Uri.parse(url)).timeout(
        const Duration(seconds: 5),
        onTimeout: () => throw Exception('Connection timeout'),
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        final projects = data.map((p) => {
          'name': p['name']?.toString() ?? 'unknown',
          'directory': p['directory']?.toString() ?? '/projects',
        }).toList();
        debugPrint('[PROJECTS] Loaded ${projects.length} projects from /projects');
        setState(() {
          _projects = projects;
          _projectsLoading = false;
        });
      } else {
        // Fall back to config projects
        debugPrint('[PROJECTS] API failed, using config fallback');
        _useConfigProjects();
      }
    } catch (e) {
      debugPrint('[PROJECTS] Error: $e, using config fallback');
      _useConfigProjects();
    }
  }

  void _useConfigProjects() {
    final config = widget.ref.read(terminalConfigProvider);
    setState(() {
      _projects = config.projects.map((p) => {
        'name': p.name,
        'directory': p.directory,
      }).toList();
      _projectsLoading = false;
    });
  }

  Future<void> _loadSessions() async {
    final config = widget.ref.read(terminalConfigProvider);

    try {
      // Fetch tmux sessions from the update server
      final url = 'http://${config.dropletIp}:8406/tmux-sessions';
      final headers = <String, String>{};
      if (AppConfig.orchonApiSecret.isNotEmpty) {
        headers['Authorization'] = 'Bearer ${AppConfig.orchonApiSecret}';
      }
      final response = await http.get(Uri.parse(url), headers: headers).timeout(
        const Duration(seconds: 5),
        onTimeout: () => throw Exception('Connection timeout'),
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        final sessions = data.map((s) => {
          'name': s['name']?.toString() ?? 'unknown',
          'windows': s['windows']?.toString() ?? '0',
          'attached': s['attached']?.toString() ?? 'false',
          'source': s['source']?.toString() ?? 'SSH/Manual',
          'project': s['project']?.toString() ?? '',
          'createdAt': s['createdAt']?.toString() ?? '',
          'lastActivity': s['lastActivity']?.toString() ?? '',
        }).toList();
        debugPrint('[SESSIONS] Loaded ${sessions.length} sessions');
        setState(() {
          _sessions = sessions;
          _isLoading = false;
        });
      } else {
        setState(() {
          _error = 'Failed to fetch sessions: ${response.statusCode}';
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    // Separate ORCHON App sessions from others for clarity
    // Sort by lastActivity (most recent first)
    final orchonSessions = _sessions.where((s) => s['source'] == 'ORCHON App').toList()
      ..sort((a, b) => (b['lastActivity'] ?? '').compareTo(a['lastActivity'] ?? ''));
    final otherSessions = _sessions.where((s) => s['source'] != 'ORCHON App').toList()
      ..sort((a, b) => (b['lastActivity'] ?? '').compareTo(a['lastActivity'] ?? ''));

    return SafeArea(
      child: Container(
        constraints: BoxConstraints(
          maxHeight: MediaQuery.of(context).size.height * 0.7,
        ),
        padding: const EdgeInsets.all(16),
        child: Scrollbar(
          controller: _scrollController,
          thumbVisibility: true,
          child: SingleChildScrollView(
            controller: _scrollController,
            child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
            // Header
            Text(
              'CLAUDE SESSIONS',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w400,
                letterSpacing: 3,
                color: Colors.grey[400],
              ),
            ),
            const SizedBox(height: 16),

            // ORCHON App sessions (started from this app) - Resume existing
            if (orchonSessions.isNotEmpty) ...[
              Row(
                children: [
                  Icon(Icons.phone_android, size: 14, color: Colors.indigo[300]),
                  const SizedBox(width: 6),
                  Text(
                    'YOUR APP SESSIONS',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w400,
                      letterSpacing: 2,
                      color: Colors.indigo[300],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              ..._buildSessionList(orchonSessions),
              const SizedBox(height: 8),
              const Divider(color: Colors.grey),
              const SizedBox(height: 8),
            ],

            // Other sessions (Claude Code, Agent Deck, SSH)
            if (_isLoading)
              const Padding(
                padding: EdgeInsets.all(24),
                child: Center(
                  child: CircularProgressIndicator(),
                ),
              )
            else if (_error != null)
              Padding(
                padding: const EdgeInsets.all(16),
                child: Text(
                  'Could not fetch sessions:\n$_error',
                  style: TextStyle(color: Colors.grey[500]),
                ),
              )
            else if (otherSessions.isNotEmpty) ...[
              Text(
                'OTHER SESSIONS',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w400,
                  letterSpacing: 2,
                  color: Colors.grey[600],
                ),
              ),
              const SizedBox(height: 8),
              ..._buildSessionList(otherSessions),
              const SizedBox(height: 8),
              const Divider(color: Colors.grey),
              const SizedBox(height: 8),
            ],

            // Project options - Start new sessions
            Text(
              'START NEW',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w400,
                letterSpacing: 2,
                color: Colors.grey[600],
              ),
            ),
            const SizedBox(height: 8),
            if (_projectsLoading)
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 16),
                child: Center(child: CircularProgressIndicator(strokeWidth: 2)),
              )
            else
              ..._buildProjectOptions(context),
          ],
          ),
        ),
        ),
      ),
    );
  }

  List<Widget> _buildSessionList(List<Map<String, String>> sessions) {
    return sessions.map((session) {
      final source = session['source'] ?? 'SSH/Manual';
      final project = session['project'] ?? '';
      final createdAt = session['createdAt'] ?? '';
      final attached = session['attached'] == 'true';

      // Format time ago
      String timeAgo = '';
      if (createdAt.isNotEmpty) {
        try {
          final created = DateTime.parse(createdAt);
          final diff = DateTime.now().difference(created);
          if (diff.inDays > 0) {
            timeAgo = '${diff.inDays}d ago';
          } else if (diff.inHours > 0) {
            timeAgo = '${diff.inHours}h ago';
          } else if (diff.inMinutes > 0) {
            timeAgo = '${diff.inMinutes}m ago';
          } else {
            timeAgo = 'just now';
          }
        } catch (_) {}
      }

      // Build subtitle with source info
      final subtitleParts = <String>[];
      if (source != 'ORCHON App') subtitleParts.add(source); // Don't repeat for app sessions
      if (project.isNotEmpty) subtitleParts.add(project);
      if (timeAgo.isNotEmpty) subtitleParts.add(timeAgo);
      if (attached) subtitleParts.add('(attached)');
      final subtitle = subtitleParts.join(' - ');

      // Pick icon based on source
      IconData icon = Icons.terminal;
      Color iconColor = Colors.grey[400]!;
      if (source == 'Agent Deck') {
        icon = Icons.smart_toy;
        iconColor = Colors.blue[300]!;
      } else if (source == 'Claude Code') {
        icon = Icons.code;
        iconColor = Colors.purple[300]!;
      } else if (source == 'ORCHON App') {
        icon = Icons.phone_android;
        iconColor = Colors.indigo[300]!;
      }

      return _SessionOption(
        icon: icon,
        title: session['name'] ?? 'unknown',
        subtitle: subtitle,
        color: iconColor,
        trailing: IconButton(
          icon: const Icon(Icons.close, color: Colors.red, size: 20),
          onPressed: () => _killSession(session),
          tooltip: 'Kill session',
        ),
        onTap: () {
          Navigator.pop(context); // Close bottom sheet
          Navigator.pop(context); // Close drawer
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => SshTerminalScreen(
                launchMode: LaunchMode.claude,
                initialCommand: 'tmux attach -t ${session['name']}',
              ),
            ),
          );
        },
      );
    }).toList();
  }

  List<Widget> _buildProjectOptions(BuildContext context) {
    return _projects.map((project) {
      final name = project['name'] ?? 'unknown';
      final directory = project['directory'] ?? '/projects';

      return _SessionOption(
        icon: _getProjectIcon(name),
        title: name,
        subtitle: directory,
        color: const Color(0xFF6366F1),
        onTap: () {
          Navigator.pop(context); // Close bottom sheet
          Navigator.pop(context); // Close drawer
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => SshTerminalScreen(
                launchMode: LaunchMode.claude,
                projectDirectory: directory,
              ),
            ),
          );
        },
      );
    }).toList();
  }

  IconData _getProjectIcon(String projectName) {
    switch (projectName.toLowerCase()) {
      case 'livna':
        return Icons.receipt_long;
      case 'orchon':
        return Icons.monitor_heart;
      case 'littlelistoflights':
        return Icons.lightbulb_outline;
      case 'brontiq':
        return Icons.book;
      case 'agent deck':
        return Icons.dashboard;
      default:
        return Icons.folder;
    }
  }

  Future<void> _killSession(Map<String, String> session) async {
    final config = widget.ref.read(terminalConfigProvider);
    final sessionName = session['name'] ?? 'unknown';
    final source = session['source'] ?? 'SSH/Manual';
    final project = session['project'] ?? '';

    // Build warning message
    String warningText = 'This will terminate the tmux session.\n\n';
    warningText += 'Source: $source\n';
    if (project.isNotEmpty) {
      warningText += 'Project: $project\n';
    }
    warningText += '\nAny unsaved work in this session will be lost.';

    // Show confirmation dialog
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF1A1A2E),
        title: Row(
          children: [
            Icon(Icons.warning_amber, color: Colors.orange[300]),
            const SizedBox(width: 8),
            const Text('Kill Session?'),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              sessionName,
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              warningText,
              style: TextStyle(color: Colors.grey[400]),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(context, true),
            style: FilledButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Kill Session'),
          ),
        ],
      ),
    );

    if (confirm != true) return;

    try {
      final url = 'http://${config.dropletIp}:8406/tmux-kill?session=$sessionName';
      final headers = <String, String>{};
      if (AppConfig.orchonApiSecret.isNotEmpty) {
        headers['Authorization'] = 'Bearer ${AppConfig.orchonApiSecret}';
      }
      await http.post(Uri.parse(url), headers: headers);
      _loadSessions(); // Refresh the list
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to kill session: $e')),
        );
      }
    }
  }
}

class _SessionOption extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final Color color;
  final Widget? trailing;
  final VoidCallback onTap;

  const _SessionOption({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.color,
    this.trailing,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon, color: color),
      title: Text(
        title,
        style: TextStyle(color: Colors.white),
      ),
      subtitle: Text(
        subtitle,
        style: TextStyle(color: Colors.grey[600], fontSize: 12),
      ),
      trailing: trailing ?? Icon(Icons.chevron_right, color: color),
      onTap: onTap,
    );
  }
}

class _TelegramHistorySheet extends ConsumerWidget {
  final WidgetRef ref;

  const _TelegramHistorySheet({required this.ref});

  @override
  Widget build(BuildContext context, WidgetRef widgetRef) {
    final historyAsync = widgetRef.watch(telegramHistoryProvider);

    return SafeArea(
      child: Container(
        constraints: BoxConstraints(
          maxHeight: MediaQuery.of(context).size.height * 0.75,
        ),
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'TELEGRAM HISTORY',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w400,
                        letterSpacing: 3,
                        color: Colors.grey[400],
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Last 50 messages from bot',
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey[600],
                      ),
                    ),
                  ],
                ),
                IconButton(
                  icon: const Icon(Icons.refresh, color: Color(0xFF6366F1)),
                  onPressed: () => widgetRef.invalidate(telegramHistoryProvider),
                  tooltip: 'Refresh',
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Messages list
            Expanded(
              child: historyAsync.when(
                data: (messages) {
                  if (messages.isEmpty) {
                    return Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.chat_bubble_outline, size: 48, color: Colors.grey[700]),
                          const SizedBox(height: 8),
                          Text(
                            'No messages yet',
                            style: TextStyle(color: Colors.grey[500]),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Send a message to the Telegram bot',
                            style: TextStyle(color: Colors.grey[600], fontSize: 12),
                          ),
                        ],
                      ),
                    );
                  }

                  // Show newest at bottom (reversed for natural chat order)
                  final reversed = messages.reversed.toList();

                  return ListView.builder(
                    reverse: true,
                    itemCount: reversed.length,
                    itemBuilder: (context, index) {
                      final msg = reversed[index];
                      final isUser = msg['role'] == 'user';
                      final content = msg['content']?.toString() ?? '';
                      final timestamp = msg['timestamp']?.toString() ?? '';
                      final hasImage = msg['hasImage'] == true;

                      // Format timestamp
                      String timeStr = '';
                      if (timestamp.isNotEmpty) {
                        try {
                          final dt = DateTime.parse(timestamp).toLocal();
                          final now = DateTime.now();
                          if (dt.day == now.day && dt.month == now.month && dt.year == now.year) {
                            timeStr = '${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
                          } else {
                            timeStr = '${dt.day}/${dt.month} ${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
                          }
                        } catch (_) {}
                      }

                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 4),
                        child: Row(
                          mainAxisAlignment: isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            if (!isUser) ...[
                              CircleAvatar(
                                radius: 14,
                                backgroundColor: const Color(0xFF6366F1).withOpacity(0.2),
                                child: const Icon(Icons.smart_toy, size: 16, color: Color(0xFF6366F1)),
                              ),
                              const SizedBox(width: 8),
                            ],
                            Flexible(
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                                decoration: BoxDecoration(
                                  color: isUser
                                      ? const Color(0xFF6366F1).withOpacity(0.3)
                                      : Colors.grey[800],
                                  borderRadius: BorderRadius.circular(12).copyWith(
                                    bottomRight: isUser ? const Radius.circular(4) : null,
                                    bottomLeft: !isUser ? const Radius.circular(4) : null,
                                  ),
                                ),
                                child: Column(
                                  crossAxisAlignment: isUser ? CrossAxisAlignment.end : CrossAxisAlignment.start,
                                  children: [
                                    if (hasImage) ...[
                                      Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          Icon(Icons.image, size: 14, color: Colors.grey[500]),
                                          const SizedBox(width: 4),
                                          Text(
                                            '[Image attached]',
                                            style: TextStyle(
                                              color: Colors.grey[500],
                                              fontSize: 11,
                                              fontStyle: FontStyle.italic,
                                            ),
                                          ),
                                        ],
                                      ),
                                      if (content.isNotEmpty) const SizedBox(height: 4),
                                    ],
                                    if (content.isNotEmpty)
                                      Text(
                                        content,
                                        style: const TextStyle(color: Colors.white, fontSize: 14),
                                      ),
                                    if (timeStr.isNotEmpty) ...[
                                      const SizedBox(height: 4),
                                      Text(
                                        timeStr,
                                        style: TextStyle(color: Colors.grey[600], fontSize: 10),
                                      ),
                                    ],
                                  ],
                                ),
                              ),
                            ),
                            if (isUser) ...[
                              const SizedBox(width: 8),
                              CircleAvatar(
                                radius: 14,
                                backgroundColor: Colors.green.withOpacity(0.2),
                                child: const Icon(Icons.person, size: 16, color: Colors.green),
                              ),
                            ],
                          ],
                        ),
                      );
                    },
                  );
                },
                loading: () => const Center(
                  child: CircularProgressIndicator(),
                ),
                error: (e, _) => Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.error_outline, size: 48, color: Colors.red[400]),
                      const SizedBox(height: 8),
                      Text(
                        'Failed to load history',
                        style: TextStyle(color: Colors.red[400]),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        e.toString(),
                        style: TextStyle(color: Colors.grey[600], fontSize: 12),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _DeviceLockTile extends StatelessWidget {
  final WidgetRef ref;

  const _DeviceLockTile({required this.ref});

  @override
  Widget build(BuildContext context) {
    final lockState = ref.watch(lockProvider);
    final isEnabled = lockState.lockEnabled;
    final isAvailable = lockState.lockAvailable;

    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: isEnabled
              ? const Color(0xFF6366F1).withOpacity(0.2)
              : Colors.grey[850],
          borderRadius: BorderRadius.circular(8),
          border: isEnabled
              ? Border.all(color: const Color(0xFF6366F1).withOpacity(0.5))
              : null,
        ),
        child: Icon(
          isEnabled ? Icons.lock : Icons.lock_open,
          color: isEnabled ? const Color(0xFF6366F1) : Colors.grey[400],
          size: 20,
        ),
      ),
      title: Text(
        'Device Lock',
        style: TextStyle(
          color: isEnabled ? const Color(0xFF6366F1) : Colors.white,
          fontWeight: FontWeight.w500,
        ),
      ),
      subtitle: Text(
        isEnabled
            ? 'Requires device PIN/fingerprint to open'
            : isAvailable
                ? 'Use device lock screen for quick unlock'
                : 'No device lock configured',
        style: TextStyle(color: Colors.grey[600], fontSize: 12),
      ),
      trailing: Switch(
        value: isEnabled,
        onChanged: isAvailable
            ? (value) async {
                await ref.read(lockProvider.notifier).setLockEnabled(value);
              }
            : null,
        activeColor: const Color(0xFF6366F1),
      ),
    );
  }
}

class _SignOutTile extends StatelessWidget {
  final WidgetRef ref;

  const _SignOutTile({required this.ref});

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final userEmail = authState.user?.email ?? '';

    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: Colors.red.withOpacity(0.15),
          borderRadius: BorderRadius.circular(8),
        ),
        child: const Icon(Icons.logout, color: Colors.red, size: 20),
      ),
      title: const Text(
        'Sign Out',
        style: TextStyle(
          color: Colors.red,
          fontWeight: FontWeight.w500,
        ),
      ),
      subtitle: Text(
        userEmail,
        style: TextStyle(
          color: Colors.grey[600],
          fontSize: 12,
        ),
      ),
      trailing: const Icon(Icons.chevron_right, color: Colors.red),
      onTap: () async {
        final confirm = await showDialog<bool>(
          context: context,
          builder: (context) => AlertDialog(
            backgroundColor: const Color(0xFF1A1A2E),
            title: const Text('Sign Out?'),
            content: Text('Sign out of $userEmail?'),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context, false),
                child: const Text('Cancel'),
              ),
              FilledButton(
                onPressed: () => Navigator.pop(context, true),
                style: FilledButton.styleFrom(backgroundColor: Colors.red),
                child: const Text('Sign Out'),
              ),
            ],
          ),
        );

        if (confirm == true) {
          // Disable device lock first, then sign out
          await ref.read(lockProvider.notifier).setLockEnabled(false);
          await ref.read(authProvider.notifier).signOut();
          if (context.mounted) {
            Navigator.pop(context); // Close drawer
          }
        }
      },
    );
  }
}

// =============================================================================
// Server Management Widgets
// =============================================================================

/// Provider for server stats
final serverStatsProvider = FutureProvider.autoDispose<Map<String, dynamic>>((ref) async {
  final config = ref.watch(terminalConfigProvider);
  try {
    final response = await http.get(
      Uri.parse('http://${config.dropletIp}:8406/server/stats'),
    ).timeout(const Duration(seconds: 5));

    if (response.statusCode == 200) {
      return json.decode(response.body);
    }
    return {};
  } catch (e) {
    debugPrint('Failed to fetch server stats: $e');
    return {};
  }
});

/// Provider for server processes
final serverProcessesProvider = FutureProvider.autoDispose<Map<String, dynamic>>((ref) async {
  final config = ref.watch(terminalConfigProvider);
  try {
    final response = await http.get(
      Uri.parse('http://${config.dropletIp}:8406/server/processes'),
    ).timeout(const Duration(seconds: 5));

    if (response.statusCode == 200) {
      return json.decode(response.body);
    }
    return {'processes': [], 'groups': {}};
  } catch (e) {
    debugPrint('Failed to fetch server processes: $e');
    return {'processes': [], 'groups': {}};
  }
});

class _ServerStatsTile extends ConsumerWidget {
  final WidgetRef ref;

  const _ServerStatsTile({required this.ref});

  @override
  Widget build(BuildContext context, WidgetRef widgetRef) {
    final statsAsync = widgetRef.watch(serverStatsProvider);

    return statsAsync.when(
      data: (stats) {
        if (stats.isEmpty) {
          return _SettingsTile(
            icon: Icons.dns,
            title: 'Server Status',
            subtitle: 'Unable to connect',
            onTap: () => widgetRef.invalidate(serverStatsProvider),
          );
        }

        final load = stats['load'] as Map<String, dynamic>? ?? {};
        final memory = stats['memory'] as Map<String, dynamic>? ?? {};
        final cpuCount = stats['cpuCount'] ?? 1;
        final loadAvg = load['avg1'] ?? 0.0;
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
          statusText = 'Moderate load';
        } else {
          statusColor = Colors.green;
          statusText = 'Healthy';
        }

        return ListTile(
          leading: Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: statusColor.withOpacity(0.2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(Icons.dns, color: statusColor, size: 20),
          ),
          title: Text(
            'Server Status',
            style: TextStyle(color: statusColor, fontWeight: FontWeight.w500),
          ),
          subtitle: Text(
            '$statusText • Load: ${loadAvg.toStringAsFixed(1)}/${cpuCount} • Mem: $memPercent%',
            style: TextStyle(color: Colors.grey[600], fontSize: 12),
          ),
          trailing: IconButton(
            icon: const Icon(Icons.refresh, size: 20),
            color: Colors.grey[400],
            onPressed: () => widgetRef.invalidate(serverStatsProvider),
          ),
        );
      },
      loading: () => ListTile(
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Colors.grey[850],
            borderRadius: BorderRadius.circular(8),
          ),
          child: const SizedBox(
            width: 20,
            height: 20,
            child: CircularProgressIndicator(strokeWidth: 2),
          ),
        ),
        title: const Text('Server Status', style: TextStyle(color: Colors.white)),
        subtitle: Text('Loading...', style: TextStyle(color: Colors.grey[600], fontSize: 12)),
      ),
      error: (_, __) => _SettingsTile(
        icon: Icons.error_outline,
        title: 'Server Status',
        subtitle: 'Failed to load',
        onTap: () => widgetRef.invalidate(serverStatsProvider),
      ),
    );
  }
}

class _KillChromeTile extends ConsumerStatefulWidget {
  final WidgetRef ref;

  const _KillChromeTile({required this.ref});

  @override
  ConsumerState<_KillChromeTile> createState() => _KillChromeTileState();
}

class _KillChromeTileState extends ConsumerState<_KillChromeTile> {
  bool _isLoading = false;

  Future<void> _killChrome() async {
    final config = ref.read(terminalConfigProvider);

    // Confirm first
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF1A1A2E),
        title: const Row(
          children: [
            Icon(Icons.warning_amber, color: Colors.orange),
            SizedBox(width: 8),
            Text('Kill Chrome?'),
          ],
        ),
        content: const Text(
          'This will terminate all Chrome/headless browser processes on the server.\n\nAgents can restart Chrome when needed.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(context, true),
            style: FilledButton.styleFrom(backgroundColor: Colors.orange),
            child: const Text('Kill Chrome'),
          ),
        ],
      ),
    );

    if (confirm != true) return;

    setState(() => _isLoading = true);

    try {
      final headers = <String, String>{};
      if (AppConfig.orchonApiSecret.isNotEmpty) {
        headers['Authorization'] = 'Bearer ${AppConfig.orchonApiSecret}';
      }

      final response = await http.post(
        Uri.parse('http://${config.dropletIp}:8406/server/kill-chrome'),
        headers: headers,
      ).timeout(const Duration(seconds: 10));

      final result = json.decode(response.body);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(result['message'] ?? 'Done'),
            backgroundColor: Colors.green,
          ),
        );
        // Refresh stats
        ref.invalidate(serverStatsProvider);
        ref.invalidate(serverProcessesProvider);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed: $e'), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: Colors.orange.withOpacity(0.2),
          borderRadius: BorderRadius.circular(8),
        ),
        child: _isLoading
            ? const SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(strokeWidth: 2, color: Colors.orange),
              )
            : const Icon(Icons.browser_not_supported, color: Colors.orange, size: 20),
      ),
      title: const Text(
        'Kill Chrome',
        style: TextStyle(color: Colors.orange, fontWeight: FontWeight.w500),
      ),
      subtitle: Text(
        'Stop all headless browser processes',
        style: TextStyle(color: Colors.grey[600], fontSize: 12),
      ),
      trailing: const Icon(Icons.chevron_right, color: Colors.orange),
      onTap: _isLoading ? null : _killChrome,
    );
  }
}

/// Show process manager bottom sheet
void _showProcessManager(BuildContext context, WidgetRef ref) {
  showModalBottomSheet(
    context: context,
    backgroundColor: const Color(0xFF1A1A2E),
    isScrollControlled: true,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
    ),
    builder: (context) => _ProcessManagerSheet(ref: ref),
  );
}

class _ProcessManagerSheet extends ConsumerStatefulWidget {
  final WidgetRef ref;

  const _ProcessManagerSheet({required this.ref});

  @override
  ConsumerState<_ProcessManagerSheet> createState() => _ProcessManagerSheetState();
}

class _ProcessManagerSheetState extends ConsumerState<_ProcessManagerSheet> {
  Set<int> _killingPids = {};

  Future<void> _killProcess(int pid, String command) async {
    final config = ref.read(terminalConfigProvider);

    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF1A1A2E),
        title: const Text('Kill Process?'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('PID: $pid', style: const TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text(
              command,
              style: TextStyle(color: Colors.grey[400], fontSize: 12, fontFamily: 'monospace'),
              maxLines: 3,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(context, true),
            style: FilledButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Kill'),
          ),
        ],
      ),
    );

    if (confirm != true) return;

    setState(() => _killingPids.add(pid));

    try {
      final headers = <String, String>{};
      if (AppConfig.orchonApiSecret.isNotEmpty) {
        headers['Authorization'] = 'Bearer ${AppConfig.orchonApiSecret}';
      }

      await http.post(
        Uri.parse('http://${config.dropletIp}:8406/server/kill-process?pid=$pid'),
        headers: headers,
      ).timeout(const Duration(seconds: 10));

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Killed process $pid'), backgroundColor: Colors.green),
        );
        ref.invalidate(serverProcessesProvider);
        ref.invalidate(serverStatsProvider);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed: $e'), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) setState(() => _killingPids.remove(pid));
    }
  }

  @override
  Widget build(BuildContext context) {
    final processesAsync = ref.watch(serverProcessesProvider);

    return SafeArea(
      child: Container(
        constraints: BoxConstraints(
          maxHeight: MediaQuery.of(context).size.height * 0.75,
        ),
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'PROCESSES',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w400,
                    letterSpacing: 3,
                    color: Colors.grey[400],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.refresh, color: Color(0xFF6366F1)),
                  onPressed: () => ref.invalidate(serverProcessesProvider),
                  tooltip: 'Refresh',
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Process groups summary
            processesAsync.when(
              data: (data) {
                final groups = data['groups'] as Map<String, dynamic>? ?? {};
                if (groups.isNotEmpty) {
                  return Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: groups.entries.map((e) {
                      final g = e.value as Map<String, dynamic>;
                      final color = e.key == 'chrome'
                          ? Colors.orange
                          : e.key == 'node'
                              ? Colors.green
                              : Colors.grey;
                      return Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: color.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          '${e.key}: ${g['count']} (${g['rss']}MB)',
                          style: TextStyle(color: color, fontSize: 12),
                        ),
                      );
                    }).toList(),
                  );
                }
                return const SizedBox.shrink();
              },
              loading: () => const SizedBox.shrink(),
              error: (_, __) => const SizedBox.shrink(),
            ),
            const SizedBox(height: 16),

            // Process list
            Expanded(
              child: processesAsync.when(
                data: (data) {
                  final processes = (data['processes'] as List<dynamic>?) ?? [];

                  if (processes.isEmpty) {
                    return Center(
                      child: Text('No processes found', style: TextStyle(color: Colors.grey[500])),
                    );
                  }

                  return ListView.builder(
                    itemCount: processes.length,
                    itemBuilder: (context, index) {
                      final p = processes[index] as Map<String, dynamic>;
                      final pid = p['pid'] as int;
                      final cpu = p['cpu'] as double;
                      final mem = p['mem'] as double;
                      final rss = p['rss'] as int;
                      final command = p['command'] as String;
                      final fullCommand = p['fullCommand'] as String;
                      final isKilling = _killingPids.contains(pid);

                      // Highlight heavy processes
                      final isHeavy = cpu > 5 || mem > 5;
                      final isChrome = fullCommand.contains('chrome');

                      return ListTile(
                        leading: isKilling
                            ? const SizedBox(
                                width: 40,
                                height: 40,
                                child: Center(child: CircularProgressIndicator(strokeWidth: 2)),
                              )
                            : Container(
                                width: 40,
                                alignment: Alignment.center,
                                child: Text(
                                  '$pid',
                                  style: TextStyle(
                                    color: isChrome ? Colors.orange : Colors.grey[400],
                                    fontSize: 11,
                                    fontFamily: 'monospace',
                                  ),
                                ),
                              ),
                        title: Text(
                          command,
                          style: TextStyle(
                            color: isHeavy ? Colors.orange : Colors.white,
                            fontSize: 13,
                            fontFamily: 'monospace',
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        subtitle: Text(
                          'CPU: ${cpu.toStringAsFixed(1)}% • Mem: ${mem.toStringAsFixed(1)}% • ${rss}MB',
                          style: TextStyle(color: Colors.grey[600], fontSize: 11),
                        ),
                        trailing: IconButton(
                          icon: Icon(Icons.close, color: Colors.red[300], size: 20),
                          onPressed: isKilling ? null : () => _killProcess(pid, fullCommand),
                          tooltip: 'Kill process',
                        ),
                      );
                    },
                  );
                },
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (e, _) => Center(
                  child: Text('Error: $e', style: TextStyle(color: Colors.red[400])),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
