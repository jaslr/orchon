const https = require('https');
const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const dns = require('dns');

// Force IPv4 (some VPS don't have IPv6 connectivity)
dns.setDefaultResultOrder('ipv4first');

// =============================================================================
// ORCHON Telegram Bot v3
// =============================================================================
// Now with:
// - Natural language understanding via orchestrator
// - Slash commands as rigid fallback
// - Auto-pull from GitHub
// - Self-healing on failed updates
// - Conversation memory/context persistence
// - Image attachment support
// =============================================================================

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const API_SECRET = process.env.API_SECRET;
const BACKEND_URL = 'https://observatory-backend.fly.dev';
// Use __dirname to get paths relative to script location (works on any machine)
const ORCHON_DIR = path.resolve(__dirname, '..', '..');
const PROJECTS_DIR = process.env.PROJECTS_DIR || '/root/projects';
const LOGS_DIR = process.env.LOGS_DIR || '/root/logs';
const HISTORY_FILE = path.join(__dirname, 'conversation_history.json');

// =============================================================================
// Conversation History Management
// =============================================================================

// Max messages to keep in history per chat
const MAX_HISTORY_MESSAGES = 20;

// In-memory conversation history (chatId -> messages[])
let conversationHistory = {};

/**
 * Load conversation history from file
 */
function loadConversationHistory() {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const data = fs.readFileSync(HISTORY_FILE, 'utf8');
      conversationHistory = JSON.parse(data);
      console.log('Loaded conversation history:', Object.keys(conversationHistory).length, 'chats');
    }
  } catch (e) {
    console.error('Failed to load conversation history:', e.message);
    conversationHistory = {};
  }
}

/**
 * Save conversation history to file and sync to backend
 */
function saveConversationHistory() {
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(conversationHistory, null, 2));
  } catch (e) {
    console.error('Failed to save conversation history:', e.message);
  }

  // Sync to backend (non-blocking)
  syncHistoryToBackend().catch(e => {
    console.error('Failed to sync history to backend:', e.message);
  });
}

/**
 * Sync conversation history to backend API
 */
async function syncHistoryToBackend() {
  if (!API_SECRET) return;

  // Flatten all chat histories into one array for the app
  const allMessages = [];
  for (const chatId of Object.keys(conversationHistory)) {
    for (const msg of conversationHistory[chatId]) {
      allMessages.push({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
        hasImage: !!msg.image,
      });
    }
  }

  // Sort by timestamp and take last 50
  allMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  const recentMessages = allMessages.slice(-50);

  const data = JSON.stringify({ messages: recentMessages });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'observatory-backend.fly.dev',
      path: '/telegram/history',
      method: 'PUT',
      family: 4,
      headers: {
        'Authorization': `Bearer ${API_SECRET}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(body));
    });

    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    req.write(data);
    req.end();
  });
}

/**
 * Add a message to conversation history
 */
function addToHistory(chatId, role, content, imageData = null) {
  const id = chatId.toString();
  if (!conversationHistory[id]) {
    conversationHistory[id] = [];
  }

  const message = {
    role,
    content,
    timestamp: new Date().toISOString()
  };

  if (imageData) {
    message.image = imageData;
  }

  conversationHistory[id].push(message);

  // Trim to max messages
  if (conversationHistory[id].length > MAX_HISTORY_MESSAGES) {
    conversationHistory[id] = conversationHistory[id].slice(-MAX_HISTORY_MESSAGES);
  }

  // Save periodically (every message for now, could debounce)
  saveConversationHistory();
}

/**
 * Get conversation history for a chat
 */
function getHistory(chatId) {
  return conversationHistory[chatId.toString()] || [];
}

/**
 * Clear conversation history for a chat
 */
function clearHistory(chatId) {
  delete conversationHistory[chatId.toString()];
  saveConversationHistory();
}

// Load history on startup
loadConversationHistory();

// Import orchestrator (relative to this script)
let orchestrator = null;
try {
  const orchestratorPath = path.join(__dirname, '..', 'orchestrator');
  orchestrator = require(orchestratorPath);
  console.log('Orchestrator loaded, LLM provider:', orchestrator.LLM_PROVIDER);
} catch (e) {
  console.log('Orchestrator not available yet:', e.message);
}

// Validate required env vars
if (!BOT_TOKEN || !CHAT_ID) {
  console.error('ERROR: TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID must be set in /root/orchon/.env');
  process.exit(1);
}

// Ensure directories exist
[PROJECTS_DIR, LOGS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// =============================================================================
// Auto-Update Mechanism
// =============================================================================

let lastGitCheck = 0;
const GIT_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes
let lastKnownCommit = '';

async function checkForUpdates() {
  const now = Date.now();
  if (now - lastGitCheck < GIT_CHECK_INTERVAL) return;
  lastGitCheck = now;

  try {
    // Fetch latest
    execSync('git fetch origin main', { cwd: ORCHON_DIR, stdio: 'pipe' });

    // Check if we're behind
    const localCommit = execSync('git rev-parse HEAD', { cwd: ORCHON_DIR, encoding: 'utf8' }).trim();
    const remoteCommit = execSync('git rev-parse origin/main', { cwd: ORCHON_DIR, encoding: 'utf8' }).trim();

    if (localCommit !== remoteCommit && remoteCommit !== lastKnownCommit) {
      console.log(`Update available: ${localCommit.slice(0, 7)} -> ${remoteCommit.slice(0, 7)}`);
      await applyUpdate(localCommit);
    }
  } catch (e) {
    console.error('Update check failed:', e.message);
  }
}

async function applyUpdate(previousCommit) {
  try {
    // Pull changes
    execSync('git pull origin main', { cwd: ORCHON_DIR, stdio: 'pipe' });

    await sendMessage('🔄 *ORCHON updated*\n\nRestarting with new version...');

    // Restart via systemd
    spawn('systemctl', ['restart', 'orchon-bot'], { detached: true, stdio: 'ignore' });

  } catch (e) {
    console.error('Update failed, reverting:', e.message);

    // Revert to previous commit
    try {
      execSync(`git reset --hard ${previousCommit}`, { cwd: ORCHON_DIR, stdio: 'pipe' });
      await sendMessage(`⚠️ *Update failed, reverted*\n\n${e.message}`);
    } catch (revertError) {
      await sendMessage(`❌ *Critical: Update and revert both failed*\n\n${revertError.message}`);
    }
  }
}

// =============================================================================
// Telegram API Helpers
// =============================================================================

function sendMessage(text, parseMode = 'Markdown') {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      chat_id: CHAT_ID,
      text: text.substring(0, 4000),
      parse_mode: parseMode
    });

    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/sendMessage`,
      method: 'POST',
      family: 4,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(body));
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// =============================================================================
// Image Handling
// =============================================================================

/**
 * Get file info from Telegram
 */
function getFileInfo(fileId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/getFile?file_id=${fileId}`,
      method: 'GET',
      family: 4
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.ok && json.result) {
            resolve(json.result);
          } else {
            reject(new Error('Failed to get file info'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

/**
 * Download file from Telegram and convert to base64
 */
function downloadFileAsBase64(filePath) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.telegram.org',
      path: `/file/bot${BOT_TOKEN}/${filePath}`,
      method: 'GET',
      family: 4
    };

    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const base64 = buffer.toString('base64');
        // Detect media type from extension
        const ext = filePath.split('.').pop().toLowerCase();
        const mediaType = ext === 'png' ? 'image/png' :
                         ext === 'gif' ? 'image/gif' :
                         ext === 'webp' ? 'image/webp' : 'image/jpeg';
        resolve({ base64, mediaType });
      });
    });

    req.on('error', reject);
    req.end();
  });
}

/**
 * Process a photo message and get base64 data
 */
async function processPhoto(photo) {
  try {
    // Get the largest photo (last in array)
    const largest = photo[photo.length - 1];
    const fileInfo = await getFileInfo(largest.file_id);
    const imageData = await downloadFileAsBase64(fileInfo.file_path);
    return imageData;
  } catch (e) {
    console.error('Failed to process photo:', e.message);
    return null;
  }
}

// =============================================================================
// GitHub Helpers
// =============================================================================

function getGitHost(account) {
  if (account === 'jvpux' || account === 'jvp-ux') {
    return 'github.com-jvpux';
  }
  return 'github.com-jaslr';
}

function cloneProject(account, repoName) {
  const gitHost = getGitHost(account);
  const actualAccount = account === 'jvpux' ? 'jvp-ux' : account;
  const repoUrl = `git@${gitHost}:${actualAccount}/${repoName}.git`;
  const projectPath = `${PROJECTS_DIR}/${repoName}`;

  if (fs.existsSync(projectPath)) {
    sendMessage(`⚠️ Project "${repoName}" already exists`);
    return;
  }

  sendMessage(`📥 Cloning ${actualAccount}/${repoName}...`);

  try {
    execSync(`git clone ${repoUrl} ${projectPath}`, {
      timeout: 120000,
      stdio: 'pipe'
    });
    sendMessage(`✅ Cloned ${repoName}\n\nCreate context file:\n\`/context ${repoName}\``);
  } catch (e) {
    sendMessage(`❌ Clone failed: ${e.message}`);
  }
}

// =============================================================================
// Slash Command Handlers (Rigid Fallback)
// =============================================================================

function handleStatus() {
  let status = '📊 *ORCHON Status*\n\n';

  // Active sessions
  try {
    const sessions = execSync('tmux list-sessions 2>/dev/null', { encoding: 'utf8' });
    status += '*Active Sessions:*\n';
    sessions.trim().split('\n').forEach(line => {
      const [name] = line.split(':');
      status += `• \`${name}\`\n`;
    });
  } catch (e) {
    status += '*Active Sessions:* None\n';
  }

  // Projects
  try {
    const projects = fs.readdirSync(PROJECTS_DIR).filter(f => {
      const fullPath = path.join(PROJECTS_DIR, f);
      return fs.statSync(fullPath).isDirectory() && fs.existsSync(path.join(fullPath, '.git'));
    });
    status += `\n*Projects:* ${projects.length}\n`;
    projects.forEach(p => status += `• ${p}\n`);
  } catch (e) {
    status += '\n*Projects:* None\n';
  }

  // Contexts
  const contextsDir = path.join(ORCHON_DIR, 'droplet/contexts');
  if (fs.existsSync(contextsDir)) {
    const contexts = fs.readdirSync(contextsDir).filter(f => f.endsWith('.md') && !f.startsWith('_'));
    status += `\n*Context Files:* ${contexts.length}`;
  }

  sendMessage(status);
}

function handleProjects() {
  try {
    const projects = fs.readdirSync(PROJECTS_DIR).filter(f => {
      const fullPath = path.join(PROJECTS_DIR, f);
      return fs.statSync(fullPath).isDirectory() && fs.existsSync(path.join(fullPath, '.git'));
    });

    if (projects.length === 0) {
      sendMessage('📁 No projects yet.\n\nClone one with:\n`/clone jaslr repo-name`');
    } else {
      let msg = '📁 *Projects:*\n\n';
      projects.forEach(p => {
        const projectPath = path.join(PROJECTS_DIR, p);
        try {
          const pkg = JSON.parse(fs.readFileSync(path.join(projectPath, 'package.json'), 'utf8'));
          msg += `• \`${p}\` v${pkg.version || '?'}\n`;
        } catch {
          msg += `• \`${p}\`\n`;
        }
      });
      sendMessage(msg);
    }
  } catch (e) {
    sendMessage('📁 No projects directory.');
  }
}

function handleLogs(sessionName) {
  const logFile = `${LOGS_DIR}/${sessionName}.log`;
  if (fs.existsSync(logFile)) {
    const content = fs.readFileSync(logFile, 'utf8');
    const lastLines = content.split('\n').slice(-50).join('\n');
    sendMessage(`📄 *Logs: ${sessionName}*\n\n\`\`\`\n${lastLines.substring(0, 3500)}\n\`\`\``);
  } else {
    sendMessage(`❌ No logs for: ${sessionName}`);
  }
}

function handleKill(sessionName) {
  try {
    execSync(`tmux kill-session -t ${sessionName} 2>/dev/null`);
    sendMessage(`🔪 Killed: ${sessionName}`);
  } catch (e) {
    sendMessage(`❌ Could not kill: ${sessionName}`);
  }
}

function handleUpdate() {
  sendMessage('🔄 Checking for updates...');
  lastGitCheck = 0; // Force check
  checkForUpdates();
}

function handleHelp() {
  sendMessage(`🤖 *ORCHON Commands*

*User Management (no LLM):*
\`/users\` - List allowed app users
\`/adduser <email> [name]\` - Add new user

*System:*
\`/status\` - System status
\`/projects\` - List projects
\`/services\` - Check systemd services
\`/logs <session>\` - View logs
\`/kill <session>\` - Kill session
\`/clone <account> <repo>\` - Clone repo
\`/update\` - Pull latest ORCHON
\`/clear\` - Clear history
\`/new\` - New Claude session (kills previous)

*Recovery:*
\`/restart\` - Restart all droplet services
\`/recovery\` - Full recovery (droplet + Fly.io)

*Or just talk naturally* (uses LLM)

*LLM:* ${orchestrator ? orchestrator.LLM_PROVIDER : 'not loaded'}`);
}

// =============================================================================
// Backend API Helpers (Direct, no LLM)
// =============================================================================

function backendRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BACKEND_URL + path);
    const data = body ? JSON.stringify(body) : null;

    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: method,
      family: 4,
      headers: {
        'Authorization': `Bearer ${API_SECRET}`,
        'Content-Type': 'application/json',
      }
    };

    if (data) {
      options.headers['Content-Length'] = Buffer.byteLength(data);
    }

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(responseData) });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (data) req.write(data);
    req.end();
  });
}

async function handleUsers() {
  try {
    const res = await backendRequest('GET', '/auth/users');
    if (res.status === 200 && res.data.users) {
      let msg = '👥 *Allowed Users:*\n\n';
      res.data.users.forEach(u => {
        const lastLogin = u.last_login_at
          ? new Date(u.last_login_at).toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })
          : 'never';
        msg += `• \`${u.email}\`\n  ${u.name || 'No name'} | Last: ${lastLogin}\n\n`;
      });
      sendMessage(msg);
    } else {
      sendMessage(`❌ Failed to fetch users: ${JSON.stringify(res.data)}`);
    }
  } catch (e) {
    sendMessage(`❌ API error: ${e.message}`);
  }
}

async function handleAddUser(email, name) {
  if (!email) {
    sendMessage('Usage: `/adduser <email> [name]`');
    return;
  }

  try {
    const res = await backendRequest('POST', '/auth/users', { email, name: name || null });
    if (res.status === 201 && res.data.user) {
      sendMessage(`✅ User added: \`${res.data.user.email}\`\n\nSet password with:\n\`/resetpassword ${email} <password>\``);
    } else {
      sendMessage(`❌ Failed: ${res.data.error || JSON.stringify(res.data)}`);
    }
  } catch (e) {
    sendMessage(`❌ API error: ${e.message}`);
  }
}

function handleServices() {
  try {
    const services = ['orchon-bot', 'orchon-ws', 'orchon-updates', 'orchon-proxy'];
    let status = '🔧 *Service Status:*\n\n';

    services.forEach(service => {
      try {
        const result = execSync(`systemctl is-active ${service} 2>/dev/null`, { encoding: 'utf8' }).trim();
        status += `• \`${service}\`: ${result === 'active' ? '✅ active' : '❌ ' + result}\n`;
      } catch (e) {
        status += `• \`${service}\`: ❌ inactive\n`;
      }
    });

    sendMessage(status);
  } catch (e) {
    sendMessage(`❌ Error checking services: ${e.message}`);
  }
}

async function handleRestart() {
  sendMessage('🔄 *Restarting droplet services...*');

  const services = ['orchon-ws', 'orchon-updates', 'orchon-proxy'];
  let results = [];

  for (const service of services) {
    try {
      execSync(`systemctl restart ${service}`, { timeout: 30000 });
      results.push(`✅ ${service}`);
    } catch (e) {
      results.push(`❌ ${service}: ${e.message}`);
    }
  }

  // Schedule bot self-restart after sending response
  sendMessage(`*Restart complete:*\n${results.join('\n')}\n\n🔄 Bot restarting in 2s...`);

  setTimeout(() => {
    try {
      execSync('systemctl restart orchon-bot');
    } catch (e) {
      console.error('Self-restart failed:', e.message);
    }
  }, 2000);
}

async function handleRecovery() {
  sendMessage('🚨 *Full recovery initiated...*\n\nRestarting droplet services + Fly.io backend');

  const services = ['orchon-ws', 'orchon-updates', 'orchon-proxy'];
  let results = [];

  // Restart droplet services
  for (const service of services) {
    try {
      execSync(`systemctl restart ${service}`, { timeout: 30000 });
      results.push(`✅ ${service}`);
    } catch (e) {
      results.push(`❌ ${service}: ${e.message}`);
    }
  }

  // Restart Fly.io backend
  try {
    execSync('fly machines restart -a observatory-backend --yes 2>&1', {
      timeout: 60000,
      cwd: '/root/projects/orchon/backend'
    });
    results.push('✅ fly.io backend');
  } catch (e) {
    results.push(`❌ fly.io: ${e.message}`);
  }

  sendMessage(`*Recovery complete:*\n${results.join('\n')}\n\n🔄 Bot restarting in 2s...`);

  setTimeout(() => {
    try {
      execSync('systemctl restart orchon-bot');
    } catch (e) {
      console.error('Self-restart failed:', e.message);
    }
  }, 2000);
}

async function handleNew() {
  // Kill any existing telegram_* sessions
  let killedSessions = [];
  try {
    const sessions = execSync('tmux list-sessions -F "#{session_name}" 2>/dev/null', { encoding: 'utf8' });
    const telegramSessions = sessions.trim().split('\n').filter(s => s.startsWith('telegram_'));

    for (const session of telegramSessions) {
      try {
        execSync(`tmux kill-session -t "${session}" 2>/dev/null`);
        killedSessions.push(session);
      } catch (e) {
        // Session might have already ended
      }
    }
  } catch (e) {
    // No sessions exist, that's fine
  }

  // Create new session name with timestamp
  const timestamp = Date.now();
  const sessionName = `telegram_${timestamp}`;
  const logFile = `${LOGS_DIR}/${sessionName}.log`;

  // Create execution script that starts Claude Code
  const scriptContent = `#!/bin/bash
set -a
source /root/projects/orchon/.env 2>/dev/null || source /root/orchon/.env 2>/dev/null || true
set +a

cd /root/projects

echo "========================================"
echo "Session: ${sessionName}"
echo "Time: $(date)"
echo "========================================"

# Start Claude Code in interactive mode
claude --dangerously-skip-permissions 2>&1 | tee -a ${logFile}
`;

  const scriptPath = `/tmp/${sessionName}.sh`;
  fs.writeFileSync(scriptPath, scriptContent);
  fs.chmodSync(scriptPath, '755');

  // Run in tmux
  spawn('tmux', ['new-session', '-d', '-s', sessionName, scriptPath], {
    detached: true,
    stdio: 'ignore'
  });

  let response = `🆕 *New Claude session started*\n\n`;
  response += `*Session:* \`${sessionName}\`\n`;

  if (killedSessions.length > 0) {
    response += `*Killed:* ${killedSessions.map(s => `\`${s}\``).join(', ')}\n`;
  }

  response += `\n*Logs:* \`/logs ${sessionName}\``;

  await sendMessage(response);
}

// =============================================================================
// Natural Language Handler
// =============================================================================

async function handleNaturalLanguage(text, chatId, imageData = null) {
  if (!orchestrator) {
    sendMessage('🤖 Orchestrator not loaded. Use /help for commands.');
    return;
  }

  // Add user message to history
  addToHistory(chatId, 'user', text, imageData);

  // Quick acknowledgment - await to ensure it sends first
  await sendMessage('📨 On it...');

  try {
    // Get conversation history for context
    const history = getHistory(chatId);

    const result = await orchestrator.processMessage(text, {
      history,
      imageData
    });

    // Add assistant response to history
    addToHistory(chatId, 'assistant', result.response);

    if (result.success) {
      sendMessage(result.response);
    } else {
      sendMessage(`⚠️ ${result.response}`);
    }
  } catch (e) {
    sendMessage(`❌ Error: ${e.message}\n\nUse /help for commands.`);
  }
}

// =============================================================================
// Message Router
// =============================================================================

async function handleMessage(text, chatId, imageData = null) {
  const trimmed = text.trim();
  const parts = trimmed.split(/\s+/);
  const command = parts[0].toLowerCase();

  // Check for updates periodically
  checkForUpdates();

  // Slash commands - rigid fallback
  switch (command) {
    case '/status':
      handleStatus();
      return;

    case '/projects':
      handleProjects();
      return;

    case '/clone':
      if (parts.length < 3) {
        sendMessage('Usage: `/clone <account> <repo>`\n\nAccounts: jaslr, jvpux');
        return;
      }
      const account = parts[1].toLowerCase();
      if (account !== 'jaslr' && account !== 'jvpux') {
        sendMessage('Account must be `jaslr` or `jvpux`');
        return;
      }
      cloneProject(account, parts[2]);
      return;

    case '/logs':
      if (parts.length < 2) {
        sendMessage('Usage: `/logs <session-name>`');
        return;
      }
      handleLogs(parts[1]);
      return;

    case '/kill':
      if (parts.length < 2) {
        sendMessage('Usage: `/kill <session-name>`');
        return;
      }
      handleKill(parts[1]);
      return;

    case '/update':
      handleUpdate();
      return;

    case '/clear':
      clearHistory(chatId);
      sendMessage('🧹 Conversation history cleared. Starting fresh!');
      return;

    case '/users':
      handleUsers();
      return;

    case '/adduser':
      handleAddUser(parts[1], parts.slice(2).join(' ') || null);
      return;

    case '/services':
      handleServices();
      return;

    case '/restart':
      handleRestart();
      return;

    case '/recovery':
      handleRecovery();
      return;

    case '/new':
      handleNew();
      return;

    case '/help':
    case '/start':
      handleHelp();
      return;
  }

  // If starts with / but not recognized
  if (trimmed.startsWith('/')) {
    sendMessage(`Unknown command: ${command}\n\nUse /help for available commands.`);
    return;
  }

  // Natural language - route to orchestrator
  await handleNaturalLanguage(trimmed, chatId, imageData);
}

// =============================================================================
// Polling Loop
// =============================================================================

let lastUpdateId = 0;

async function processUpdate(update) {
  const message = update.message;
  if (!message) return;

  const chatId = message.chat.id;
  if (chatId.toString() !== CHAT_ID) return;

  // Handle text message
  if (message.text) {
    await handleMessage(message.text, chatId, null);
    return;
  }

  // Handle photo message
  if (message.photo) {
    const caption = message.caption || 'What is this image?';
    const imageData = await processPhoto(message.photo);

    if (imageData) {
      await handleMessage(caption, chatId, imageData);
    } else {
      sendMessage('Failed to process the image. Please try again.');
    }
    return;
  }

  // Handle document (if it's an image)
  if (message.document && message.document.mime_type?.startsWith('image/')) {
    try {
      const fileInfo = await getFileInfo(message.document.file_id);
      const imageData = await downloadFileAsBase64(fileInfo.file_path);
      const caption = message.caption || 'What is this image?';
      await handleMessage(caption, chatId, imageData);
    } catch (e) {
      console.error('Failed to process document image:', e.message);
      sendMessage('Failed to process the image file. Please try again.');
    }
    return;
  }
}

function pollUpdates() {
  const options = {
    hostname: 'api.telegram.org',
    path: `/bot${BOT_TOKEN}/getUpdates?offset=${lastUpdateId + 1}&timeout=30`,
    method: 'GET',
    family: 4
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', async () => {
      try {
        const json = JSON.parse(data);
        if (json.ok && json.result) {
          for (const update of json.result) {
            lastUpdateId = update.update_id;
            await processUpdate(update);
          }
        }
      } catch (e) {
        console.error('Parse error:', e.message);
      }

      setTimeout(pollUpdates, 1000);
    });
  });

  req.on('error', (e) => {
    console.error('Request error:', e.message);
    setTimeout(pollUpdates, 5000);
  });

  req.setTimeout(35000, () => {
    req.destroy();
    setTimeout(pollUpdates, 1000);
  });

  req.end();
}

// =============================================================================
// Start Bot
// =============================================================================

// Get app version from OTA server
const OTA_VERSION_URL = 'http://localhost:8406/version';
let version = 'unknown';

async function fetchAppVersion() {
  return new Promise((resolve) => {
    const http = require('http');
    const req = http.get(OTA_VERSION_URL, { timeout: 5000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.version || 'unknown');
        } catch (e) {
          resolve('unknown');
        }
      });
    });
    req.on('error', () => resolve('unknown'));
    req.on('timeout', () => { req.destroy(); resolve('unknown'); });
  });
}

// Fetch version synchronously at startup (fallback to package.json)
try {
  const pkgPath = path.join(__dirname, '..', 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  version = pkg.version || 'unknown';
} catch (e) {
  console.error('Could not read fallback version:', e.message);
}

// Format date as "29 Dec 2025, 11:09 AM" in Sydney timezone
function formatStartupTime() {
  const now = new Date();
  const options = {
    timeZone: 'Australia/Sydney',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };
  return now.toLocaleString('en-AU', options).replace(',', '');
}

// Startup: fetch app version from OTA, then send message
(async () => {
  // Try to get actual app version from OTA server
  const appVersion = await fetchAppVersion();
  if (appVersion !== 'unknown') {
    version = appVersion;
  }

  console.log(`ORCHON v${version} starting...`);
  console.log(`Projects: ${PROJECTS_DIR}`);
  console.log(`Logs: ${LOGS_DIR}`);
  console.log(`Orchestrator: ${orchestrator ? 'loaded' : 'not available'}`);

  const startupMsg = `🟢 *ORCHON v${version}*\n${formatStartupTime()}\n\nTalk naturally or /help`;
  try {
    await sendMessage(startupMsg);
    console.log('Startup message sent');
  } catch (err) {
    console.error('Startup failed:', err);
  }
  pollUpdates();
})();
