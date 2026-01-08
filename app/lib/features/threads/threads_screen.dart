import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/config.dart';
import '../../core/websocket/websocket_service.dart';
import '../../core/updates/update_service.dart';
import '../../core/updates/update_dialog.dart';
import '../settings/settings_drawer.dart';
import '../settings/terminal_config_screen.dart';
import '../terminal/quick_commands.dart';
import '../terminal/ssh_terminal_screen.dart';
import 'threads_provider.dart';
import 'chat_screen.dart';

class ThreadsScreen extends ConsumerStatefulWidget {
  const ThreadsScreen({super.key});

  @override
  ConsumerState<ThreadsScreen> createState() => _ThreadsScreenState();
}

class _ThreadsScreenState extends ConsumerState<ThreadsScreen> {
  @override
  void initState() {
    super.initState();
    // Delay startup to let app initialize
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      _initializeServices();
    });
  }

  Future<void> _initializeServices() async {
    // Short delay to let framework settle
    await Future.delayed(const Duration(milliseconds: 500));
    if (!mounted) return;

    try {
      final wsService = ref.read(webSocketServiceProvider);
      // Pass dev token for authentication
      wsService.connect(AppConfig.wsUrl, authToken: 'dev-token');
    } catch (e) {
      debugPrint('WebSocket init error: $e');
    }

    try {
      await showUpdateDialogIfAvailable(context, ref);
    } catch (e) {
      debugPrint('Update check error: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    final threadsState = ref.watch(threadsProvider);
    final connectionState = ref.watch(connectionStateProvider);

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
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
          IconButton(
            icon: const Icon(Icons.bolt),
            tooltip: 'Quick Commands',
            onPressed: () => showQuickCommands(context),
          ),
          Builder(
            builder: (context) => IconButton(
              icon: const Icon(Icons.settings),
              onPressed: () {
                Scaffold.of(context).openEndDrawer();
              },
            ),
          ),
        ],
      ),
      endDrawer: const SettingsDrawer(),
      body: threadsState.isLoading
          ? const Center(child: CircularProgressIndicator())
          : threadsState.threads.isEmpty
              ? _buildEmptyState()
              : RefreshIndicator(
                  onRefresh: () async {
                    ref.read(threadsProvider.notifier).refreshThreads();
                  },
                  child: _buildThreadsList(threadsState.threads),
                ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _startNewTerminalSession(context),
        icon: const Icon(Icons.add),
        label: const Text('New Terminal Session'),
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

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.chat_bubble_outline,
            size: 64,
            color: Colors.grey[600],
          ),
          const SizedBox(height: 16),
          Text(
            'No threads yet',
            style: TextStyle(
              fontSize: 18,
              color: Colors.grey[400],
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Create a new thread to get started',
            style: TextStyle(
              color: Colors.grey[600],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildThreadsList(List threads) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: threads.length,
      itemBuilder: (context, index) {
        final thread = threads[index];
        return _ThreadCard(
          thread: thread,
          onTap: () => _openThread(context, thread),
          onClose: () => _closeThread(thread.id),
        );
      },
    );
  }

  void _startNewTerminalSession(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (context) => _NewTerminalSessionSheet(ref: ref),
    );
  }

  void _createNewThread(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (context) => _NewThreadSheet(
        onCreateThread: (projectHint) {
          ref.read(threadsProvider.notifier).createThread(projectHint: projectHint);
          Navigator.pop(context);
        },
      ),
    );
  }

  void _openThread(BuildContext context, thread) {
    // Request the thread to be loaded with its messages
    ref.read(threadsProvider.notifier).loadThread(thread.id);

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ChatScreen(thread: thread),
      ),
    );
  }

  void _closeThread(String threadId) {
    ref.read(threadsProvider.notifier).closeThread(threadId);
  }
}

class _ThreadCard extends StatelessWidget {
  final dynamic thread;
  final VoidCallback onTap;
  final VoidCallback onClose;

  const _ThreadCard({
    required this.thread,
    required this.onTap,
    required this.onClose,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.primaryContainer,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  _getProjectIcon(thread.projectHint),
                  color: Theme.of(context).colorScheme.primary,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      thread.title ?? thread.projectHint ?? 'New Thread',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      thread.projectHint ?? 'General',
                      style: TextStyle(
                        color: Colors.grey[500],
                        fontSize: 12,
                      ),
                    ),
                    if (thread.lastMessage != null) ...[
                      const SizedBox(height: 4),
                      Text(
                        thread.lastMessage!,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          color: Colors.grey[400],
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close),
                onPressed: onClose,
                color: Colors.grey[600],
              ),
            ],
          ),
        ),
      ),
    );
  }

  IconData _getProjectIcon(String? projectHint) {
    switch (projectHint?.toLowerCase()) {
      case 'livna':
        return Icons.receipt_long;
      case 'brontiq':
        return Icons.book;
      case 'orchon':
        return Icons.monitor_heart;
      default:
        return Icons.chat;
    }
  }
}

class _NewThreadSheet extends ConsumerStatefulWidget {
  final Function(String?) onCreateThread;

  const _NewThreadSheet({required this.onCreateThread});

  @override
  ConsumerState<_NewThreadSheet> createState() => _NewThreadSheetState();
}

class _NewThreadSheetState extends ConsumerState<_NewThreadSheet> {
  String? _selectedProject;

  @override
  Widget build(BuildContext context) {
    final config = ref.watch(terminalConfigProvider);
    final projectNames = ['General', ...config.projects.map((p) => p.name)];

    return Container(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'New Thread',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Select a project to set the working directory',
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[400],
            ),
          ),
          const SizedBox(height: 16),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: projectNames.map((project) {
              final isSelected = _selectedProject == project;
              return FilterChip(
                label: Text(project),
                selected: isSelected,
                onSelected: (selected) {
                  setState(() {
                    _selectedProject = selected ? project : null;
                  });
                },
              );
            }).toList(),
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: FilledButton(
              onPressed: () {
                final hint = (_selectedProject == null || _selectedProject == 'General')
                    ? null
                    : _selectedProject?.toLowerCase();
                widget.onCreateThread(hint);
              },
              child: const Text('Create Thread'),
            ),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}

class _NewTerminalSessionSheet extends ConsumerStatefulWidget {
  final WidgetRef ref;

  const _NewTerminalSessionSheet({required this.ref});

  @override
  ConsumerState<_NewTerminalSessionSheet> createState() => _NewTerminalSessionSheetState();
}

class _NewTerminalSessionSheetState extends ConsumerState<_NewTerminalSessionSheet> {
  String? _selectedProject;

  @override
  Widget build(BuildContext context) {
    final config = ref.watch(terminalConfigProvider);
    final projectNames = ['General', ...config.projects.map((p) => p.name)];

    return Container(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'New Terminal Session',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Select a project to set the working directory',
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[400],
            ),
          ),
          const SizedBox(height: 16),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: projectNames.map((project) {
              final isSelected = _selectedProject == project;
              return FilterChip(
                label: Text(project),
                selected: isSelected,
                onSelected: (selected) {
                  setState(() {
                    _selectedProject = selected ? project : null;
                  });
                },
              );
            }).toList(),
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: FilledButton(
              onPressed: () {
                Navigator.pop(context); // Close bottom sheet

                // Find the project directory
                String? projectDirectory;
                if (_selectedProject != null && _selectedProject != 'General') {
                  final project = config.projects.firstWhere(
                    (p) => p.name == _selectedProject,
                    orElse: () => ProjectConfig(name: '', directory: ''),
                  );
                  if (project.directory.isNotEmpty) {
                    projectDirectory = project.directory;
                  }
                }

                // Launch SSH terminal with Claude
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => SshTerminalScreen(
                      launchMode: LaunchMode.claude,
                      projectDirectory: projectDirectory,
                    ),
                  ),
                );
              },
              child: const Text('Start Terminal Session'),
            ),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}
