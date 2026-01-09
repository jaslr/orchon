import 'dart:async';
import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dartssh2/dartssh2.dart';
import 'package:xterm/xterm.dart';
import 'package:http/http.dart' as http;
import '../../core/config.dart';
import '../settings/terminal_config_screen.dart';

enum LaunchMode { bash, claude }

class SshTerminalScreen extends ConsumerStatefulWidget {
  final String? initialCommand;
  final LaunchMode launchMode;
  final String? projectDirectory;
  final String? contextMessage;

  const SshTerminalScreen({
    super.key,
    this.initialCommand,
    this.launchMode = LaunchMode.bash,
    this.projectDirectory,
    this.contextMessage,
  });

  @override
  ConsumerState<SshTerminalScreen> createState() => _SshTerminalScreenState();
}

class _SshTerminalScreenState extends ConsumerState<SshTerminalScreen> {
  final terminal = Terminal(maxLines: 10000);
  final _inputController = TextEditingController();
  final _inputFocusNode = FocusNode();
  final _terminalFocusNode = FocusNode();
  final _terminalScrollController = ScrollController();
  SSHClient? _client;
  SSHSession? _session;
  StreamSubscription<Uint8List>? _stdoutSubscription;
  StreamSubscription<Uint8List>? _stderrSubscription;
  bool _isConnecting = true;
  String? _error;
  bool _showInputBar = false;
  bool _ctrlPressed = false;

  @override
  void initState() {
    super.initState();
    _connect();
  }

  Future<void> _connect() async {
    // Cancel any existing stream subscriptions to prevent duplicate output
    await _stdoutSubscription?.cancel();
    await _stderrSubscription?.cancel();
    _stdoutSubscription = null;
    _stderrSubscription = null;

    // Close existing session/client before reconnecting
    try {
      _session?.close();
    } catch (_) {}
    try {
      _client?.close();
    } catch (_) {}
    _session = null;
    _client = null;

    setState(() {
      _isConnecting = true;
      _error = null;
    });

    final config = ref.read(terminalConfigProvider);

    try {
      terminal.write('Connecting to ${config.dropletIp}...\r\n');

      // Get SSH key from server (requires auth)
      terminal.write('Fetching SSH key from update server...\r\n');
      final keyUrl = 'http://${config.dropletIp}:8406/termux-key';
      final keyResponse = await http.get(
        Uri.parse(keyUrl),
        headers: {'Authorization': 'Bearer ${AppConfig.orchonApiSecret}'},
      );

      if (keyResponse.statusCode != 200) {
        throw Exception('Failed to fetch SSH key: ${keyResponse.statusCode}');
      }

      // Strip whitespace from base64 before decoding
      terminal.write('Decoding SSH key...\r\n');
      final keyB64 = keyResponse.body.replaceAll(RegExp(r'\s'), '');
      final keyBytes = base64Decode(keyB64);
      final keyString = utf8.decode(keyBytes);

      terminal.write('Establishing SSH connection...\r\n');

      // Connect via SSH
      final socket = await SSHSocket.connect(config.dropletIp, 22);

      _client = SSHClient(
        socket,
        username: config.sshUser,
        identities: [
          ...SSHKeyPair.fromPem(keyString),
        ],
      );

      terminal.write('Starting shell...\r\n\r\n');

      // Start shell session
      _session = await _client!.shell(
        pty: SSHPtyConfig(
          width: 80,
          height: 24,
        ),
      );

      // Handle terminal output - decode as UTF-8 for proper Unicode support
      // Store subscriptions so they can be cancelled on reconnect/dispose
      _stdoutSubscription = _session!.stdout.listen((data) {
        terminal.write(utf8.decode(data, allowMalformed: true));
      });

      _stderrSubscription = _session!.stderr.listen((data) {
        terminal.write(utf8.decode(data, allowMalformed: true));
      });

      // Handle terminal input - encode as UTF-8 for proper Unicode support
      terminal.onOutput = (data) {
        _session?.write(Uint8List.fromList(utf8.encode(data)));
      };

      // Handle session close
      _session!.done.then((_) {
        terminal.write('\r\n[Connection closed]\r\n');
        if (mounted) {
          setState(() {
            _isConnecting = false;
          });
        }
      });

      setState(() {
        _isConnecting = false;
      });

      // Execute command based on launch mode
      await Future.delayed(const Duration(milliseconds: 800));

      if (widget.initialCommand != null) {
        _session?.write(Uint8List.fromList(utf8.encode('${widget.initialCommand}\n')));
      } else if (widget.launchMode == LaunchMode.claude) {
        // Generate a unique session name for tracking
        // Format: orchon_PROJECT_TIMESTAMP so it shows up in session resume
        final projectName = widget.projectDirectory?.split('/').last ?? 'general';
        final timestamp = DateTime.now().millisecondsSinceEpoch.toString().substring(7);
        final sessionName = 'orchon_${projectName}_$timestamp';

        terminal.write('[Creating session: $sessionName]\r\n');

        // Create a named tmux session so it's tracked properly
        String tmuxCmd = 'tmux new-session -d -s "$sessionName"';
        if (widget.projectDirectory != null) {
          tmuxCmd += ' -c "${widget.projectDirectory}"';
        }
        _session?.write(Uint8List.fromList(utf8.encode('$tmuxCmd\n')));
        await Future.delayed(const Duration(milliseconds: 500));

        // Send claude command to the tmux session
        terminal.write('[Launching Claude in session...]\r\n');
        _session?.write(Uint8List.fromList(utf8.encode('tmux send-keys -t "$sessionName" "${config.claudeCommand}" Enter\n')));
        await Future.delayed(const Duration(milliseconds: 300));

        // Attach to the session
        _session?.write(Uint8List.fromList(utf8.encode('tmux attach -t "$sessionName"\n')));

        // If context message provided, wait for Claude to start then type it
        if (widget.contextMessage != null) {
          await Future.delayed(const Duration(milliseconds: 3000));
          terminal.write('[Pre-filling context - press Enter to send]\r\n');
          // Send message without newline so user can review and press Enter
          _session?.write(Uint8List.fromList(utf8.encode(widget.contextMessage!)));
        }
      }
    } catch (e) {
      terminal.write('\r\n[Error: $e]\r\n');
      if (mounted) {
        setState(() {
          _isConnecting = false;
          _error = e.toString();
        });
      }
    }
  }

  @override
  void dispose() {
    _inputController.dispose();
    _inputFocusNode.dispose();
    _terminalFocusNode.dispose();
    _terminalScrollController.dispose();
    // Cancel stream subscriptions to prevent memory leaks
    _stdoutSubscription?.cancel();
    _stderrSubscription?.cancel();
    // Gracefully close SSH - ignore errors if already closed
    try {
      _session?.close();
    } catch (_) {}
    try {
      _client?.close();
    } catch (_) {}
    super.dispose();
  }

  // Send ANSI escape sequences for special keys
  void _sendSpecialKey(String escapeSequence) {
    if (_session != null) {
      _session!.write(Uint8List.fromList(utf8.encode(escapeSequence)));
    }
  }

  void _sendCtrlKey(String key) {
    if (_session != null) {
      // Ctrl+key sends the character code minus 64 (or 96 for lowercase)
      final code = key.toUpperCase().codeUnitAt(0) - 64;
      _session!.write(Uint8List.fromList([code]));
    }
    setState(() => _ctrlPressed = false);
  }

  void _sendInput(String text) {
    if (_session != null && text.isNotEmpty) {
      // Send text followed by carriage return (Enter key)
      _session!.write(Uint8List.fromList(utf8.encode('$text\r')));
      _inputController.clear();
    }
  }

  @override
  Widget build(BuildContext context) {
    final modeName = widget.launchMode == LaunchMode.claude ? 'Claude' : 'Terminal';

    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        title: Row(
          children: [
            Icon(
              widget.launchMode == LaunchMode.claude
                ? Icons.smart_toy
                : Icons.terminal,
              size: 20,
            ),
            const SizedBox(width: 8),
            Text(modeName),
            if (_isConnecting) ...[
              const SizedBox(width: 8),
              const SizedBox(
                width: 16,
                height: 16,
                child: CircularProgressIndicator(strokeWidth: 2),
              ),
            ],
          ],
        ),
        backgroundColor: Colors.black,
        actions: [
          // Toggle text input bar (for voice typing)
          IconButton(
            icon: Icon(
              _showInputBar ? Icons.keyboard_hide : Icons.keyboard,
              color: _showInputBar ? const Color(0xFF6366F1) : null,
            ),
            onPressed: () {
              setState(() {
                _showInputBar = !_showInputBar;
              });
              if (_showInputBar) {
                _inputFocusNode.requestFocus();
              }
            },
            tooltip: _showInputBar ? 'Hide input bar' : 'Show input bar (voice typing)',
          ),
          if (_error != null)
            IconButton(
              icon: const Icon(Icons.refresh),
              onPressed: _connect,
              tooltip: 'Reconnect',
            ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Terminal view with 10px scrollbar on right side
            Expanded(
              child: ScrollbarTheme(
                data: ScrollbarThemeData(
                  thickness: WidgetStateProperty.all(10),
                  thumbColor: WidgetStateProperty.all(const Color(0xFF6366F1)),
                  trackColor: WidgetStateProperty.all(const Color(0xFF2D2D44)),
                  trackVisibility: WidgetStateProperty.all(true),
                  thumbVisibility: WidgetStateProperty.all(true),
                  radius: const Radius.circular(5),
                  trackBorderColor: WidgetStateProperty.all(Colors.transparent),
                  interactive: true,
                ),
                child: Scrollbar(
                  controller: _terminalScrollController,
                  child: TerminalView(
                    terminal,
                    focusNode: _terminalFocusNode,
                    scrollController: _terminalScrollController,
                    textStyle: TerminalStyle(
                      fontSize: ref.watch(terminalConfigProvider).terminalFontSize,
                      fontFamily: 'monospace',
                    ),
                  ),
                ),
              ),
            ),
            // Terminal toolbar with special keys
            _buildTerminalToolbar(),
            // Optional text input bar (for voice typing support)
            if (_showInputBar) _buildInputBar(),
          ],
        ),
      ),
    );
  }

  Widget _buildTerminalToolbar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 6),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1A2E),
        border: Border(
          top: BorderSide(color: Colors.grey[800]!),
        ),
      ),
      child: LayoutBuilder(
        builder: (context, constraints) {
          // Calculate if we need to use compact mode
          final isCompact = constraints.maxWidth < 400;

          return SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: ConstrainedBox(
              constraints: BoxConstraints(minWidth: constraints.maxWidth),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                mainAxisSize: MainAxisSize.max,
                children: [
                  // Escape key
                  _buildToolbarButton('ESC', () => _sendSpecialKey('\x1b'), compact: isCompact),
                  // Tab key
                  _buildToolbarButton('TAB', () => _sendSpecialKey('\t'), compact: isCompact),
                  // Ctrl modifier
                  _buildToolbarButton(
                    'CTRL',
                    () => setState(() => _ctrlPressed = !_ctrlPressed),
                    isActive: _ctrlPressed,
                    compact: isCompact,
                  ),
                  // Divider
                  _buildDivider(),
                  // Arrow keys
                  _buildToolbarButton('↑', () => _sendSpecialKey('\x1b[A'), compact: isCompact),
                  _buildToolbarButton('↓', () => _sendSpecialKey('\x1b[B'), compact: isCompact),
                  _buildToolbarButton('←', () => _sendSpecialKey('\x1b[D'), compact: isCompact),
                  _buildToolbarButton('→', () => _sendSpecialKey('\x1b[C'), compact: isCompact),
                  // Divider
                  _buildDivider(),
                  // Common ctrl shortcuts
                  _buildToolbarButton('C', () => _sendCtrlKey('c'), isCtrl: true, compact: isCompact),
                  _buildToolbarButton('D', () => _sendCtrlKey('d'), isCtrl: true, compact: isCompact),
                  _buildToolbarButton('Q', () => _sendCtrlKey('q'), isCtrl: true, highlight: true, compact: isCompact),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildDivider() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 2),
      child: Container(width: 1, height: 24, color: Colors.grey[700]),
    );
  }

  Widget _buildToolbarButton(String label, VoidCallback onPressed, {bool isActive = false, bool isCtrl = false, bool highlight = false, bool compact = false}) {
    final showAsCtrl = isCtrl && !_ctrlPressed;
    final displayLabel = showAsCtrl ? '^$label' : label;
    final highlightColor = const Color(0xFF10B981); // Green for agent-deck shortcut

    // Adjust padding based on compact mode
    final horizontalPadding = compact ? 6.0 : 10.0;
    final verticalPadding = compact ? 6.0 : 8.0;
    final fontSize = compact ? 11.0 : 13.0;

    return Material(
      color: isActive ? const Color(0xFF6366F1) : (highlight ? highlightColor.withOpacity(0.2) : Colors.transparent),
      borderRadius: BorderRadius.circular(6),
      child: InkWell(
        onTap: () {
          onPressed();
          // Refocus terminal after toolbar tap
          _terminalFocusNode.requestFocus();
        },
        borderRadius: BorderRadius.circular(6),
        child: Container(
          padding: EdgeInsets.symmetric(horizontal: horizontalPadding, vertical: verticalPadding),
          decoration: highlight && !isActive ? BoxDecoration(
            borderRadius: BorderRadius.circular(6),
            border: Border.all(color: highlightColor.withOpacity(0.5)),
          ) : null,
          child: Text(
            displayLabel,
            style: TextStyle(
              color: isActive ? Colors.white : (highlight ? highlightColor : Colors.grey[400]),
              fontSize: fontSize,
              fontWeight: FontWeight.w600,
              fontFamily: 'monospace',
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildInputBar() {
    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1A2E),
        border: Border(
          top: BorderSide(color: Colors.grey[800]!),
        ),
      ),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: _inputController,
              focusNode: _inputFocusNode,
              autofocus: true,
              enableSuggestions: true,
              autocorrect: false,
              style: const TextStyle(
                color: Colors.white,
                fontFamily: 'monospace',
              ),
              decoration: InputDecoration(
                hintText: 'Type or use voice input...',
                hintStyle: TextStyle(color: Colors.grey[600]),
                filled: true,
                fillColor: Colors.black,
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(24),
                  borderSide: BorderSide.none,
                ),
              ),
              textInputAction: TextInputAction.send,
              onSubmitted: _sendInput,
            ),
          ),
          const SizedBox(width: 8),
          IconButton(
            icon: const Icon(Icons.send, color: Color(0xFF6366F1)),
            onPressed: () => _sendInput(_inputController.text),
          ),
        ],
      ),
    );
  }
}
