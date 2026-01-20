const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const UPDATES_DIR = process.env.UPDATES_DIR || '/root/orchon/releases';
const UPDATES_PORT = process.env.UPDATES_PORT || 8406;

// Two levels of auth:
// - DOWNLOAD_PASSWORD: Short memorable password for browser downloads (you type this)
// - OBSERVATORY_API_SECRET: Long token for app auto-updates (baked into app)
const DOWNLOAD_PASSWORD = process.env.DOWNLOAD_PASSWORD || '';
const API_SECRET = process.env.OBSERVATORY_API_SECRET || '';

// Ensure releases directory exists
if (!fs.existsSync(UPDATES_DIR)) {
  fs.mkdirSync(UPDATES_DIR, { recursive: true });
}

// Check authorization - accepts password OR API secret
function isAuthorized(req) {
  // If neither is configured, allow open access
  if (!DOWNLOAD_PASSWORD && !API_SECRET) return true;

  const url = new URL(req.url, `http://${req.headers.host}`);

  // Check query param (for browser downloads with short password)
  const tokenParam = url.searchParams.get('token');
  if (DOWNLOAD_PASSWORD && tokenParam === DOWNLOAD_PASSWORD) return true;
  if (API_SECRET && tokenParam === API_SECRET) return true;

  // Check Authorization header (for app auto-updates)
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    if (API_SECRET && token === API_SECRET) return true;
  }

  return false;
}

function unauthorized(res) {
  res.writeHead(401, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Unauthorized - token required' }));
}

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // PROTECTED: Even the landing page requires auth
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html' || req.url?.startsWith('/?'))) {
    if (!isAuthorized(req)) return unauthorized(res);

    // Serve HTML download page
    const versionFile = path.join(UPDATES_DIR, 'version.json');
    let version = { version: 'No release', apkFile: 'N/A', releaseDate: 'N/A' };
    if (fs.existsSync(versionFile)) {
      version = JSON.parse(fs.readFileSync(versionFile, 'utf8'));
    }

    const authRequired = !!(DOWNLOAD_PASSWORD || API_SECRET);
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ORCHON - Download</title>
  <style>
    body { font-family: -apple-system, sans-serif; background: #0F0F23; color: #fff; padding: 20px; text-align: center; }
    .container { max-width: 400px; margin: 50px auto; }
    h1 { color: #6366F1; }
    .version { font-size: 48px; font-weight: bold; margin: 30px 0; }
    .info { color: #888; margin: 10px 0; }
    .auth-note { color: #F59E0B; font-size: 14px; margin: 20px 0; padding: 12px; background: rgba(245,158,11,0.1); border-radius: 8px; }
    .download-btn { display: inline-block; background: #6366F1; color: #fff; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-size: 18px; margin-top: 20px; }
    .download-btn:hover { background: #4F46E5; }
    .download-btn.disabled { background: #4B5563; cursor: not-allowed; }
    .refresh { color: #6366F1; margin-top: 30px; display: block; }
    input[type="password"] { padding: 12px; border-radius: 6px; border: 1px solid #4B5563; background: #1F2937; color: #fff; width: 200px; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <h1>ORCHON</h1>
    <div class="version">v${version.version}</div>
    <div class="info">Build: ${version.buildNumber || 'N/A'}</div>
    <div class="info">Released: ${version.releaseDate || 'N/A'}</div>
    <div class="info">File: ${version.apkFile}</div>
    ${authRequired ? `
    <div class="auth-note">Download requires authentication token</div>
    <input type="password" id="token" placeholder="Enter token">
    <br>
    <a href="#" class="download-btn" onclick="downloadWithToken(); return false;">Download APK</a>
    <script>
      function downloadWithToken() {
        const token = document.getElementById('token').value;
        if (!token) { alert('Please enter your token'); return; }
        window.location.href = '/download?token=' + encodeURIComponent(token);
      }
    </script>
    ` : `
    <a href="/download" class="download-btn">Download APK</a>
    `}
    <a href="/" class="refresh" onclick="location.reload(); return false;">Refresh</a>
  </div>
</body>
</html>`;

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  } else if (req.method === 'GET' && (req.url === '/version' || req.url?.startsWith('/version?'))) {
    // PROTECTED: Return current version info
    if (!isAuthorized(req)) return unauthorized(res);

    const versionFile = path.join(UPDATES_DIR, 'version.json');
    if (fs.existsSync(versionFile)) {
      const version = JSON.parse(fs.readFileSync(versionFile, 'utf8'));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(version));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'No version info available' }));
    }
  } else if (req.method === 'GET' && req.url === '/termux-key') {
    // PROTECTED: Serve base64-encoded SSH key for Termux setup
    if (!isAuthorized(req)) return unauthorized(res);

    const keyPath = '/root/termux-key.b64';
    if (fs.existsSync(keyPath)) {
      const key = fs.readFileSync(keyPath, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(key);
    } else {
      res.writeHead(404);
      res.end('Key not found');
    }
  } else if (req.method === 'GET' && (req.url === '/download' || req.url?.startsWith('/download?'))) {
    // PROTECTED: Serve the latest APK
    if (!isAuthorized(req)) return unauthorized(res);
    const versionFile = path.join(UPDATES_DIR, 'version.json');
    if (!fs.existsSync(versionFile)) {
      res.writeHead(404);
      res.end('No release available');
      return;
    }

    const version = JSON.parse(fs.readFileSync(versionFile, 'utf8'));
    const apkPath = path.join(UPDATES_DIR, version.apkFile);

    if (!fs.existsSync(apkPath)) {
      res.writeHead(404);
      res.end('APK not found');
      return;
    }

    const stat = fs.statSync(apkPath);
    res.writeHead(200, {
      'Content-Type': 'application/vnd.android.package-archive',
      'Content-Length': stat.size,
      'Content-Disposition': `attachment; filename="${version.apkFile}"`,
    });

    fs.createReadStream(apkPath).pipe(res);
  } else if (req.method === 'GET' && req.url === '/tmux-sessions') {
    // List tmux sessions with source and timestamps
    // No auth required - sessions are visible to all

    try {
      const output = execSync('tmux list-sessions -F "#{session_name}|#{session_windows}|#{session_attached}|#{session_created}|#{session_activity}"', {
        encoding: 'utf8',
        timeout: 5000,
      }).trim();

      const sessions = output.split('\n').filter(line => line).map(line => {
        const [name, windows, attached, created, activity] = line.split('|');

        // Parse source from session name (e.g., "agentdeck_livna-fix_abc123" -> "Agent Deck")
        // Common patterns: agentdeck_*, claude_*, orchon_*, or plain names
        let source = 'SSH/Manual';
        let project = null;

        if (name.startsWith('agentdeck_')) {
          source = 'Agent Deck';
          // Extract project from middle part: agentdeck_PROJECT_id
          const parts = name.split('_');
          if (parts.length >= 2) {
            project = parts[1];
          }
        } else if (name.startsWith('claude_')) {
          source = 'Claude Code';
          const parts = name.split('_');
          if (parts.length >= 2) {
            project = parts[1];
          }
        } else if (name.startsWith('orchon_')) {
          source = 'ORCHON App';
          const parts = name.split('_');
          if (parts.length >= 2) {
            project = parts[1];
          }
        }

        return {
          name,
          windows,
          attached: attached === '1',
          source,
          project,
          createdAt: created ? new Date(parseInt(created) * 1000).toISOString() : null,
          lastActivity: activity ? new Date(parseInt(activity) * 1000).toISOString() : null,
        };
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(sessions));
    } catch (e) {
      // No sessions or tmux error
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify([]));
    }
  } else if (req.method === 'GET' && req.url === '/projects') {
    // List directories in /projects folder for session picker
    // No auth required - project list is public
    const projectsDir = '/projects';

    try {
      if (!fs.existsSync(projectsDir)) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify([]));
        return;
      }

      const entries = fs.readdirSync(projectsDir, { withFileTypes: true });
      const projects = entries
        .filter(entry => {
          if (entry.name.startsWith('.')) return false;
          // Check if it's a directory or a symlink to a directory
          const fullPath = path.join(projectsDir, entry.name);
          try {
            const stat = fs.statSync(fullPath); // follows symlinks
            return stat.isDirectory();
          } catch {
            return false;
          }
        })
        .map(entry => ({
          name: entry.name,
          directory: path.join(projectsDir, entry.name),
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(projects));
    } catch (e) {
      console.error('Error listing projects:', e);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify([]));
    }
  } else if (req.method === 'POST' && req.url?.startsWith('/tmux-kill')) {
    // PROTECTED: Kill a tmux session
    if (!isAuthorized(req)) return unauthorized(res);

    const url = new URL(req.url, `http://${req.headers.host}`);
    const sessionName = url.searchParams.get('session');

    if (!sessionName) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing session parameter' }));
      return;
    }

    try {
      execSync(`tmux kill-session -t "${sessionName}"`, { timeout: 5000 });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: `Killed session: ${sessionName}` }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
  } else if (req.method === 'GET' && req.url === '/server/stats') {
    // Server stats - load, memory, CPU count
    // No auth required - stats are public
    try {
      const loadavg = fs.readFileSync('/proc/loadavg', 'utf8').trim().split(' ');
      const meminfo = fs.readFileSync('/proc/meminfo', 'utf8');
      const cpuCount = require('os').cpus().length;

      // Parse memory info
      const memTotal = parseInt(meminfo.match(/MemTotal:\s+(\d+)/)?.[1] || '0') / 1024;
      const memAvailable = parseInt(meminfo.match(/MemAvailable:\s+(\d+)/)?.[1] || '0') / 1024;
      const memUsed = memTotal - memAvailable;

      // Get swap info
      const swapTotal = parseInt(meminfo.match(/SwapTotal:\s+(\d+)/)?.[1] || '0') / 1024;
      const swapFree = parseInt(meminfo.match(/SwapFree:\s+(\d+)/)?.[1] || '0') / 1024;
      const swapUsed = swapTotal - swapFree;

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        load: {
          avg1: parseFloat(loadavg[0]),
          avg5: parseFloat(loadavg[1]),
          avg15: parseFloat(loadavg[2]),
        },
        cpuCount,
        memory: {
          totalMB: Math.round(memTotal),
          usedMB: Math.round(memUsed),
          availableMB: Math.round(memAvailable),
          percentUsed: Math.round((memUsed / memTotal) * 100),
        },
        swap: {
          totalMB: Math.round(swapTotal),
          usedMB: Math.round(swapUsed),
          percentUsed: swapTotal > 0 ? Math.round((swapUsed / swapTotal) * 100) : 0,
        },
      }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
  } else if (req.method === 'GET' && req.url === '/server/processes') {
    // List top processes by CPU and memory
    // No auth required - process list is public
    try {
      const output = execSync('ps aux --sort=-%cpu | head -20', {
        encoding: 'utf8',
        timeout: 5000,
      });

      const lines = output.trim().split('\n');
      const headers = lines[0].split(/\s+/);
      const processes = lines.slice(1).map(line => {
        const parts = line.split(/\s+/);
        const cmd = parts.slice(10).join(' ');
        return {
          pid: parseInt(parts[1]),
          cpu: parseFloat(parts[2]),
          mem: parseFloat(parts[3]),
          rss: Math.round(parseInt(parts[5]) / 1024), // KB to MB
          command: cmd.length > 60 ? cmd.substring(0, 60) + '...' : cmd,
          fullCommand: cmd,
        };
      }).filter(p => p.cpu > 0 || p.mem > 0.5); // Filter out idle processes

      // Group by process type for summary
      const groups = {};
      processes.forEach(p => {
        let type = 'other';
        if (p.fullCommand.includes('chrome')) type = 'chrome';
        else if (p.fullCommand.includes('claude')) type = 'claude';
        else if (p.fullCommand.includes('node')) type = 'node';
        else if (p.fullCommand.includes('esbuild')) type = 'esbuild';

        if (!groups[type]) {
          groups[type] = { cpu: 0, mem: 0, rss: 0, count: 0, pids: [] };
        }
        groups[type].cpu += p.cpu;
        groups[type].mem += p.mem;
        groups[type].rss += p.rss;
        groups[type].count++;
        groups[type].pids.push(p.pid);
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ processes, groups }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
  } else if (req.method === 'POST' && req.url === '/server/kill-chrome') {
    // PROTECTED: Kill all Chrome processes
    if (!isAuthorized(req)) return unauthorized(res);

    try {
      const countBefore = parseInt(execSync('pgrep -c chrome 2>/dev/null || echo 0', { encoding: 'utf8' }).trim());

      if (countBefore === 0) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'No Chrome processes running', killed: 0 }));
        return;
      }

      execSync('pkill -9 chrome', { timeout: 5000 });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: `Killed ${countBefore} Chrome processes`, killed: countBefore }));
    } catch (e) {
      // pkill returns non-zero if no processes matched, which is fine
      if (e.message.includes('No matching')) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'No Chrome processes found', killed: 0 }));
      } else {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    }
  } else if (req.method === 'POST' && req.url?.startsWith('/server/kill-process')) {
    // PROTECTED: Kill a specific process by PID
    if (!isAuthorized(req)) return unauthorized(res);

    const url = new URL(req.url, `http://${req.headers.host}`);
    const pid = url.searchParams.get('pid');

    if (!pid || !/^\d+$/.test(pid)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid or missing pid parameter' }));
      return;
    }

    // Don't allow killing critical system processes
    const criticalPids = ['1', '2'];
    if (criticalPids.includes(pid)) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Cannot kill system process' }));
      return;
    }

    try {
      execSync(`kill -9 ${pid}`, { timeout: 5000 });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: `Killed process ${pid}` }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(UPDATES_PORT, () => {
  console.log(`Update server listening on port ${UPDATES_PORT}`);
  console.log(`Releases directory: ${UPDATES_DIR}`);
});

module.exports = server;
