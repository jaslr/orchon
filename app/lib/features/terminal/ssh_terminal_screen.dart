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
import '../settings/settings_drawer.dart' show showSessionPicker;

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

  // Track terminal dimensions for PTY sizing
  int _terminalCols = 80;
  int _terminalRows = 24;
  Size? _lastViewSize;

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

      // Start shell session with dynamic PTY size
      _session = await _client!.shell(
        pty: SSHPtyConfig(
          width: _terminalCols,
          height: _terminalRows,
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
        // If attaching to tmux, disable echo first to prevent duplicate input display
        if (widget.initialCommand!.contains('tmux attach')) {
          _session?.write(Uint8List.fromList(utf8.encode('stty -echo\n')));
          await Future.delayed(const Duration(milliseconds: 100));
        }
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

        // Disable echo on outer PTY before attaching to tmux
        // This prevents duplicate input display when Claude shows streaming input
        _session?.write(Uint8List.fromList(utf8.encode('stty -echo\n')));
        await Future.delayed(const Duration(milliseconds: 100));

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

  // Calculate terminal dimensions based on view size and font size
  void _updateTerminalSize(Size viewSize, double fontSize) {
    // Skip if view size hasn't changed significantly
    if (_lastViewSize != null &&
        (_lastViewSize!.width - viewSize.width).abs() < 10 &&
        (_lastViewSize!.height - viewSize.height).abs() < 10) {
      return;
    }
    _lastViewSize = viewSize;

    // Calculate character dimensions based on monospace font
    // Monospace fonts typically have width ~0.6x height
    final charHeight = fontSize * 1.2; // Line height
    final charWidth = fontSize * 0.6;  // Character width

    // Calculate cols and rows
    final cols = (viewSize.width / charWidth).floor();
    final rows = (viewSize.height / charHeight).floor();

    // Clamp to reasonable values
    final newCols = cols.clamp(20, 200);
    final newRows = rows.clamp(5, 100);

    // Only resize if dimensions actually changed
    if (newCols != _terminalCols || newRows != _terminalRows) {
      _terminalCols = newCols;
      _terminalRows = newRows;

      // Resize PTY if session is active
      _resizePty();
    }
  }

  // Resize the PTY to current dimensions
  void _resizePty() {
    // Resize the local terminal emulator
    terminal.resize(_terminalCols, _terminalRows);

    // Resize the remote PTY if session is active
    if (_session != null) {
      try {
        _session!.resizeTerminal(_terminalCols, _terminalRows);
      } catch (e) {
        // Ignore resize errors - session may be closing
        debugPrint('PTY resize failed: $e');
      }
    }
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

  // Track scroll accumulator for smooth scrolling
  double _scrollAccumulator = 0;
  // Track last pointer Y position for drag-based scrolling
  double? _lastPointerY;
  // Track if we're in tmux copy mode (for scrolling history)
  bool _inCopyMode = false;
  // Track scroll direction to detect when entering copy mode
  bool _scrollingUp = false;

  // Handle terminal scroll using tmux copy-mode for reliable history access
  // This works regardless of tmux mouse mode setting
  void _handleTerminalScroll(double deltaY) {
    if (_session == null) return;

    // Accumulate scroll delta (positive = swipe down = scroll up to see older content)
    _scrollAccumulator += deltaY;

    // Send scroll event every ~40 pixels of movement (slightly larger threshold for smoother feel)
    const scrollThreshold = 40.0;

    while (_scrollAccumulator.abs() >= scrollThreshold) {
      if (_scrollAccumulator > 0) {
        // Swipe down = scroll up (show older content)
        _scrollingUp = true;

        // Enter tmux copy-mode if not already in it
        // Ctrl+B [ enters copy mode (prefix + [)
        if (!_inCopyMode) {
          // Send Ctrl+B (tmux prefix)
          _session!.write(Uint8List.fromList([2])); // Ctrl+B = ASCII 2
          // Small delay then send [ to enter copy mode
          Future.delayed(const Duration(milliseconds: 50), () {
            _session?.write(Uint8List.fromList(utf8.encode('[')));
          });
          _inCopyMode = true;
          // Wait a bit for copy mode to activate before scrolling
          Future.delayed(const Duration(milliseconds: 100), () {
            // Send Page Up to scroll in copy mode: \x1b[5~
            _session?.write(Uint8List.fromList(utf8.encode('\x1b[5~')));
          });
        } else {
          // Already in copy mode, just send Page Up
          _session!.write(Uint8List.fromList(utf8.encode('\x1b[5~')));
        }
        _scrollAccumulator -= scrollThreshold;
      } else {
        // Swipe up = scroll down (show newer content)
        _scrollingUp = false;

        if (_inCopyMode) {
          // In copy mode, send Page Down: \x1b[6~
          _session!.write(Uint8List.fromList(utf8.encode('\x1b[6~')));
        }
        // If not in copy mode, scrolling down does nothing (already at bottom)
        _scrollAccumulator += scrollThreshold;
      }
    }
  }

  // Enter tmux copy mode for scrolling history
  void _enterCopyMode() {
    if (!_inCopyMode && _session != null) {
      // Send Ctrl+B (tmux prefix) then [ to enter copy mode
      _session!.write(Uint8List.fromList([2])); // Ctrl+B = ASCII 2
      Future.delayed(const Duration(milliseconds: 50), () {
        _session?.write(Uint8List.fromList(utf8.encode('[')));
      });
      setState(() => _inCopyMode = true);
    }
  }

  // Exit tmux copy mode (call this when user taps or performs other actions)
  void _exitCopyMode() {
    if (_inCopyMode && _session != null) {
      // Send 'q' to exit copy mode
      _session!.write(Uint8List.fromList(utf8.encode('q')));
      setState(() => _inCopyMode = false);
    }
  }

  // Scroll up in tmux (Page Up) - enters copy mode if needed
  void _scrollUp() {
    if (_session == null) return;
    if (!_inCopyMode) {
      // Enter copy mode first
      _session!.write(Uint8List.fromList([2])); // Ctrl+B
      Future.delayed(const Duration(milliseconds: 50), () {
        _session?.write(Uint8List.fromList(utf8.encode('[')));
        // Then scroll up after copy mode activates
        Future.delayed(const Duration(milliseconds: 100), () {
          _session?.write(Uint8List.fromList(utf8.encode('\x1b[5~'))); // Page Up
        });
      });
      setState(() => _inCopyMode = true);
    } else {
      // Already in copy mode, just Page Up
      _session!.write(Uint8List.fromList(utf8.encode('\x1b[5~')));
    }
  }

  // Scroll down in tmux (Page Down) - only works in copy mode
  void _scrollDown() {
    if (_session == null || !_inCopyMode) return;
    _session!.write(Uint8List.fromList(utf8.encode('\x1b[6~'))); // Page Down
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
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        title: Row(
          children: [
            const Text('Terminal'),
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
          if (_error != null)
            IconButton(
              icon: const Icon(Icons.refresh),
              onPressed: _connect,
              tooltip: 'Reconnect',
            ),
          // Session list button (only for Claude mode)
          if (widget.launchMode == LaunchMode.claude)
            IconButton(
              icon: const Icon(Icons.list),
              onPressed: () => showSessionPicker(context, ref),
              tooltip: 'Claude sessions',
            ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Terminal view with swipe-to-scroll for tmux
            // GestureDetector with opaque behavior to capture ALL vertical drags for scroll
            // Taps still work because we only handle drag, not tap
            Expanded(
              child: LayoutBuilder(
                builder: (context, constraints) {
                  final fontSize = ref.watch(terminalConfigProvider).terminalFontSize;
                  // Update PTY size based on actual view dimensions
                  WidgetsBinding.instance.addPostFrameCallback((_) {
                    _updateTerminalSize(
                      Size(constraints.maxWidth, constraints.maxHeight),
                      fontSize,
                    );
                  });

                  return GestureDetector(
                    behavior: HitTestBehavior.opaque,
                    onVerticalDragStart: (details) {
                      _lastPointerY = details.globalPosition.dy;
                    },
                    onVerticalDragUpdate: (details) {
                      if (_lastPointerY != null) {
                        final delta = details.globalPosition.dy - _lastPointerY!;
                        _handleTerminalScroll(delta);
                        _lastPointerY = details.globalPosition.dy;
                      }
                    },
                    onVerticalDragEnd: (details) {
                      _lastPointerY = null;
                      _scrollAccumulator = 0;
                    },
                    onTapDown: (details) {
                      // Exit copy mode if in it (so user can type again)
                      _exitCopyMode();
                      // Forward tap to terminal for focus
                      _terminalFocusNode.requestFocus();
                    },
                    child: TerminalView(
                      terminal,
                      focusNode: _terminalFocusNode,
                      scrollController: _terminalScrollController,
                      textStyle: TerminalStyle(
                        fontSize: fontSize,
                        fontFamily: 'monospace',
                      ),
                    ),
                  );
                },
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
                  // Scroll buttons - Page Up/Down for tmux history
                  _buildToolbarButton(
                    'PgUp',
                    _scrollUp,
                    isActive: _inCopyMode,
                    compact: isCompact,
                  ),
                  _buildToolbarButton(
                    'PgDn',
                    _scrollDown,
                    isActive: _inCopyMode,
                    compact: isCompact,
                  ),
                  // Exit scroll mode button (only shown when in copy mode)
                  if (_inCopyMode)
                    _buildToolbarButton(
                      'EXIT',
                      _exitCopyMode,
                      highlight: true,
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
                  // Divider
                  _buildDivider(),
                  // Keyboard toggle for voice typing input
                  _buildKeyboardButton(compact: isCompact),
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

  Widget _buildKeyboardButton({bool compact = false}) {
    final horizontalPadding = compact ? 6.0 : 10.0;
    final verticalPadding = compact ? 6.0 : 8.0;

    return Material(
      color: _showInputBar ? const Color(0xFF6366F1) : Colors.transparent,
      borderRadius: BorderRadius.circular(6),
      child: InkWell(
        onTap: () {
          setState(() {
            _showInputBar = !_showInputBar;
          });
          if (_showInputBar) {
            _inputFocusNode.requestFocus();
          }
          _terminalFocusNode.requestFocus();
        },
        borderRadius: BorderRadius.circular(6),
        child: Container(
          padding: EdgeInsets.symmetric(horizontal: horizontalPadding, vertical: verticalPadding),
          child: Icon(
            _showInputBar ? Icons.keyboard_hide : Icons.keyboard,
            size: compact ? 18 : 20,
            color: _showInputBar ? Colors.white : Colors.grey[400],
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
