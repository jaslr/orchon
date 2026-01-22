import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;
import '../settings/settings_drawer.dart' show serverStatsProvider, serverProcessesProvider;
import '../settings/terminal_config_screen.dart';
import '../../core/config.dart';

class ServerStatsScreen extends ConsumerStatefulWidget {
  const ServerStatsScreen({super.key});

  @override
  ConsumerState<ServerStatsScreen> createState() => _ServerStatsScreenState();
}

class _ServerStatsScreenState extends ConsumerState<ServerStatsScreen> {
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

  Future<void> _killChrome() async {
    final config = ref.read(terminalConfigProvider);

    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF1A1A2E),
        title: const Row(
          children: [
            Icon(Icons.warning_amber, color: Colors.orange),
            SizedBox(width: 8),
            Text('Kill All Chrome?'),
          ],
        ),
        content: const Text(
          'This will terminate all Chrome/headless browser processes.\n\nAgents can restart Chrome when needed.',
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
        ref.invalidate(serverStatsProvider);
        ref.invalidate(serverProcessesProvider);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final statsAsync = ref.watch(serverStatsProvider);
    final processesAsync = ref.watch(serverProcessesProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Server Status'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              ref.invalidate(serverStatsProvider);
              ref.invalidate(serverProcessesProvider);
            },
            tooltip: 'Refresh',
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(serverStatsProvider);
          ref.invalidate(serverProcessesProvider);
          await Future.delayed(const Duration(milliseconds: 500));
        },
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Server Overview
              statsAsync.when(
                data: (stats) => _buildStatsOverview(stats),
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (e, _) => _buildErrorCard('Failed to load stats: $e'),
              ),
              const SizedBox(height: 24),

              // Process Groups Summary
              processesAsync.when(
                data: (data) => _buildProcessGroups(data['groups'] as Map<String, dynamic>? ?? {}),
                loading: () => const SizedBox.shrink(),
                error: (_, __) => const SizedBox.shrink(),
              ),
              const SizedBox(height: 24),

              // Top Processes
              Text(
                'TOP PROCESSES',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w400,
                  letterSpacing: 2,
                  color: Colors.grey[400],
                ),
              ),
              const SizedBox(height: 12),
              processesAsync.when(
                data: (data) => _buildProcessList(data['processes'] as List<dynamic>? ?? []),
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (e, _) => _buildErrorCard('Failed to load processes: $e'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatsOverview(Map<String, dynamic> stats) {
    if (stats.isEmpty) {
      return _buildErrorCard('Unable to connect to server');
    }

    final load = stats['load'] as Map<String, dynamic>? ?? {};
    final memory = stats['memory'] as Map<String, dynamic>? ?? {};
    final disk = stats['disk'] as Map<String, dynamic>? ?? {};
    final cpuCount = stats['cpuCount'] ?? 1;
    final uptime = stats['uptime'] as String? ?? 'Unknown';

    final loadAvg1 = (load['avg1'] as num?)?.toDouble() ?? 0.0;
    final loadAvg5 = (load['avg5'] as num?)?.toDouble() ?? 0.0;
    final loadAvg15 = (load['avg15'] as num?)?.toDouble() ?? 0.0;
    final memUsed = memory['used'] ?? 0;
    final memTotal = memory['total'] ?? 1;
    final memPercent = memory['percentUsed'] ?? 0;
    final diskUsed = disk['used'] ?? 'N/A';
    final diskTotal = disk['total'] ?? 'N/A';
    final diskPercent = disk['percentUsed'] ?? 0;

    // Determine health status
    final loadRatio = loadAvg1 / cpuCount;
    Color statusColor;
    String statusText;
    if (loadRatio > 2.0) {
      statusColor = Colors.red;
      statusText = 'High Load';
    } else if (loadRatio > 1.0) {
      statusColor = Colors.orange;
      statusText = 'Moderate Load';
    } else {
      statusColor = Colors.green;
      statusText = 'Healthy';
    }

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1A2E),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: statusColor.withOpacity(0.3)),
      ),
      child: Column(
        children: [
          // Status header
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: statusColor.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(Icons.dns, color: statusColor, size: 28),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      statusText,
                      style: TextStyle(
                        color: statusColor,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      'Uptime: $uptime',
                      style: TextStyle(color: Colors.grey[500], fontSize: 12),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          const Divider(color: Colors.grey),
          const SizedBox(height: 16),

          // Load averages
          _buildStatRow(
            'CPU Load',
            '${loadAvg1.toStringAsFixed(2)} / ${loadAvg5.toStringAsFixed(2)} / ${loadAvg15.toStringAsFixed(2)}',
            '$cpuCount cores',
            loadRatio > 1.0 ? Colors.orange : Colors.green,
          ),
          const SizedBox(height: 12),

          // Memory
          _buildStatRow(
            'Memory',
            '${(memUsed / 1024 / 1024 / 1024).toStringAsFixed(1)} GB / ${(memTotal / 1024 / 1024 / 1024).toStringAsFixed(1)} GB',
            '$memPercent% used',
            memPercent > 80 ? Colors.orange : Colors.green,
          ),
          const SizedBox(height: 12),

          // Disk
          _buildStatRow(
            'Disk',
            '$diskUsed / $diskTotal',
            '$diskPercent% used',
            diskPercent > 80 ? Colors.orange : Colors.green,
          ),
        ],
      ),
    );
  }

  Widget _buildStatRow(String label, String value, String secondary, Color color) {
    return Row(
      children: [
        Container(
          width: 4,
          height: 40,
          decoration: BoxDecoration(
            color: color,
            borderRadius: BorderRadius.circular(2),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: TextStyle(color: Colors.grey[400], fontSize: 12),
              ),
              Text(
                value,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 15,
                  fontWeight: FontWeight.w500,
                  fontFamily: 'monospace',
                ),
              ),
            ],
          ),
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(
            color: color.withOpacity(0.15),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Text(
            secondary,
            style: TextStyle(color: color, fontSize: 12, fontWeight: FontWeight.w600),
          ),
        ),
      ],
    );
  }

  Widget _buildProcessGroups(Map<String, dynamic> groups) {
    if (groups.isEmpty) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              'RESOURCE USAGE BY TYPE',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w400,
                letterSpacing: 2,
                color: Colors.grey[400],
              ),
            ),
            const Spacer(),
            // Kill Chrome button if chrome processes exist
            if (groups.containsKey('chrome'))
              TextButton.icon(
                onPressed: _killChrome,
                icon: const Icon(Icons.browser_not_supported, size: 16),
                label: const Text('Kill Chrome'),
                style: TextButton.styleFrom(foregroundColor: Colors.orange),
              ),
          ],
        ),
        const SizedBox(height: 12),
        Wrap(
          spacing: 10,
          runSpacing: 10,
          children: groups.entries.map((e) {
            final g = e.value as Map<String, dynamic>;
            final count = g['count'] ?? 0;
            final rss = g['rss'] ?? 0;

            Color color;
            IconData icon;
            switch (e.key) {
              case 'chrome':
                color = Colors.orange;
                icon = Icons.web;
              case 'node':
                color = Colors.green;
                icon = Icons.code;
              case 'python':
                color = Colors.blue;
                icon = Icons.terminal;
              case 'claude':
                color = Colors.purple;
                icon = Icons.smart_toy;
              default:
                color = Colors.grey;
                icon = Icons.memory;
            }

            return Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: color.withOpacity(0.3)),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(icon, color: color, size: 20),
                  const SizedBox(width: 8),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        e.key.toUpperCase(),
                        style: TextStyle(
                          color: color,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        '$count processes - ${rss}MB',
                        style: TextStyle(color: Colors.grey[400], fontSize: 11),
                      ),
                    ],
                  ),
                ],
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildProcessList(List<dynamic> processes) {
    if (processes.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: const Color(0xFF1A1A2E),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Center(
          child: Text('No processes found', style: TextStyle(color: Colors.grey[500])),
        ),
      );
    }

    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1A1A2E),
        borderRadius: BorderRadius.circular(12),
      ),
      child: ListView.separated(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemCount: processes.length,
        separatorBuilder: (_, __) => Divider(color: Colors.grey[800], height: 1),
        itemBuilder: (context, index) {
          final p = processes[index] as Map<String, dynamic>;
          final pid = p['pid'] as int;
          final cpu = (p['cpu'] as num).toDouble();
          final mem = (p['mem'] as num).toDouble();
          final rss = p['rss'] as int;
          final command = p['command'] as String;
          final fullCommand = p['fullCommand'] as String;
          final isKilling = _killingPids.contains(pid);

          // Highlight heavy processes
          final isHeavy = cpu > 10 || mem > 10;
          final isChrome = fullCommand.contains('chrome');

          return ListTile(
            leading: isKilling
                ? const SizedBox(
                    width: 40,
                    height: 40,
                    child: Center(child: CircularProgressIndicator(strokeWidth: 2)),
                  )
                : Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: isHeavy
                          ? Colors.orange.withOpacity(0.2)
                          : isChrome
                              ? Colors.orange.withOpacity(0.1)
                              : Colors.grey.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          '$pid',
                          style: TextStyle(
                            color: isChrome ? Colors.orange : Colors.grey[400],
                            fontSize: 10,
                            fontFamily: 'monospace',
                          ),
                        ),
                        Text(
                          '${rss}MB',
                          style: TextStyle(
                            color: isHeavy ? Colors.orange : Colors.grey[500],
                            fontSize: 9,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
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
            subtitle: Row(
              children: [
                _buildUsageChip('CPU', '${cpu.toStringAsFixed(1)}%', cpu > 10 ? Colors.orange : Colors.grey),
                const SizedBox(width: 8),
                _buildUsageChip('MEM', '${mem.toStringAsFixed(1)}%', mem > 10 ? Colors.orange : Colors.grey),
              ],
            ),
            trailing: IconButton(
              icon: Icon(Icons.close, color: Colors.red[300], size: 20),
              onPressed: isKilling ? null : () => _killProcess(pid, fullCommand),
              tooltip: 'Kill process',
            ),
            onTap: () => _showProcessDetails(p),
          );
        },
      ),
    );
  }

  Widget _buildUsageChip(String label, String value, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: color.withOpacity(0.15),
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        '$label: $value',
        style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.w500),
      ),
    );
  }

  void _showProcessDetails(Map<String, dynamic> p) {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF1A1A2E),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (context) => Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Process Details',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Colors.grey[400],
              ),
            ),
            const SizedBox(height: 16),
            _buildDetailRow('PID', '${p['pid']}'),
            _buildDetailRow('CPU', '${(p['cpu'] as num).toStringAsFixed(1)}%'),
            _buildDetailRow('Memory', '${(p['mem'] as num).toStringAsFixed(1)}%'),
            _buildDetailRow('RSS', '${p['rss']} MB'),
            const SizedBox(height: 12),
            Text('Full Command:', style: TextStyle(color: Colors.grey[500], fontSize: 12)),
            const SizedBox(height: 4),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.black,
                borderRadius: BorderRadius.circular(8),
              ),
              child: SelectableText(
                p['fullCommand'] as String,
                style: const TextStyle(
                  color: Colors.white70,
                  fontSize: 11,
                  fontFamily: 'monospace',
                ),
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: () {
                  Navigator.pop(context);
                  _killProcess(p['pid'] as int, p['fullCommand'] as String);
                },
                style: FilledButton.styleFrom(backgroundColor: Colors.red),
                child: const Text('Kill Process'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          SizedBox(
            width: 80,
            child: Text(label, style: TextStyle(color: Colors.grey[500])),
          ),
          Text(value, style: const TextStyle(fontFamily: 'monospace')),
        ],
      ),
    );
  }

  Widget _buildErrorCard(String message) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.red.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.red.withOpacity(0.3)),
      ),
      child: Row(
        children: [
          const Icon(Icons.error_outline, color: Colors.red),
          const SizedBox(width: 12),
          Expanded(
            child: Text(message, style: TextStyle(color: Colors.red[300])),
          ),
        ],
      ),
    );
  }
}
