# ORCHON Droplet (DigitalOcean)

**IP:** `209.38.85.244`
**User:** `root`
**SSH Key:** `~/.ssh/id_jaslr`

## Quick Reference

```bash
# SSH into the droplet (using ~/.ssh/config alias)
ssh droplet

# Or the full command:
ssh -i ~/.ssh/id_jaslr root@209.38.85.244
```

## What Lives on This Droplet

| Service | Port | Description |
|---------|------|-------------|
| SSH | 22 | Shell access, Claude Code |
| WebSocket | 8405 | Real-time app communication |
| Updates | 8406 | OTA update server for app |
| Proxy | 8407 | Claude Code + MCP scraping API |

### Systemd Services

```bash
# View status
systemctl status orchon-bot        # Telegram bot
systemctl status orchon-updates    # Update server (port 8406)
systemctl status orchon-ws         # WebSocket server (port 8405)
systemctl status orchon-proxy      # Proxy server (port 8407)

# Restart services
systemctl restart orchon-bot
systemctl restart orchon-updates
systemctl restart orchon-ws
systemctl restart orchon-proxy

# View logs
journalctl -u orchon-bot -f
journalctl -u orchon-updates -f
journalctl -u orchon-ws -f
journalctl -u orchon-proxy -f
```

### Directory Structure on Droplet

```
/root/
├── orchon/                    # Main repo (git clone)
│   ├── droplet/
│   │   ├── bot/               # Telegram bot
│   │   ├── ws/                # WebSocket + Updates servers
│   │   ├── proxy/             # Claude Code + MCP proxy API
│   │   └── contexts/          # Project context files
│   └── releases/              # Published APKs
│       ├── version.json       # Current version info
│       └── orchon-x.x.x.apk   # APK files
├── termux-key.b64             # SSH key for app (base64 encoded)
├── logs/                      # Server logs
└── projects/                  # Other project repos
```

## Connection Methods

### 1. From Terminal (Local Machine)

```bash
# Standard SSH
ssh droplet

# Run Claude Code on droplet
ssh droplet -t "claude"
```

### 2. From ORCHON App

1. Open app
2. Tap **Settings** (gear icon)
3. Choose **Launch Claude** or **Launch Bash**
4. App fetches SSH key from server and connects automatically

### 3. From Any Device (With SSH Client)

The app's SSH key is served at: `http://209.38.85.244:8406/termux-key`

```bash
# Download and use the key
curl -s http://209.38.85.244:8406/termux-key | base64 -d > /tmp/key
chmod 600 /tmp/key
ssh -i /tmp/key root@209.38.85.244
```

## Update Server Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /version` | Returns current app version JSON |
| `GET /download` | Downloads latest APK |
| `GET /termux-key` | Returns base64-encoded SSH private key |

```bash
# Check current version
curl http://209.38.85.244:8406/version

# Example response:
# {"version":"1.2.6","buildNumber":9,"apkFile":"orchon-1.2.6-release.apk",...}
```

## Proxy API (Port 8407)

The proxy server executes Claude Code with Chrome DevTools MCP (falling back to WebFetch) to scrape and analyze web pages. All endpoints require `Authorization: Bearer <API_SECRET>` or `?token=<API_SECRET>`.

### Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/proxy/crawl` | POST | Execute a scraping task |
| `/proxy/tasks` | GET | List available task templates |
| `/proxy/jobs` | GET | List recent async jobs |
| `/proxy/jobs/:id` | GET | Get job status/result |
| `/health` | GET | Health check (no auth) |

### POST /proxy/crawl

Execute a web scraping/analysis task.

**Request:**
```json
{
  "url": "https://example.com/product/123",
  "task": "extract_product",
  "prompt": "Custom extraction instructions...",
  "output_schema": { "type": "object", ... },
  "timeout": 60000,
  "callback_url": "https://your-app.com/webhook"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `url` | Yes | URL to scrape |
| `task` | No | Task template (default: `extract_product`) |
| `prompt` | For `custom` task | Custom extraction prompt |
| `output_schema` | No | JSON schema for output |
| `timeout` | No | Timeout in ms (default: 60000) |
| `callback_url` | No | Webhook for async result |

**Sync Response (< 30s timeout, no callback_url):**
```json
{
  "status": "completed",
  "data": { "name": "Product X", "price": { "current": 99.99 }, ... },
  "metadata": {
    "duration_ms": 12500,
    "tool_used": "chrome-devtools",
    "url_requested": "https://...",
    "timestamp": "2026-01-04T..."
  }
}
```

**Async Response (> 30s timeout or callback_url provided):**
```json
{
  "status": "processing",
  "job_id": "abc123def456",
  "poll_url": "/proxy/jobs/abc123def456",
  "message": "Poll /proxy/jobs/abc123def456 for results"
}
```

### Task Templates

| Task | Description |
|------|-------------|
| `extract_product` | Generic e-commerce product extraction |
| `extract_flashlight` | Flashlight specs for Little List of Lights |
| `extract_links` | Get all links from a page |
| `screenshot` | Take screenshot of page |
| `custom` | Execute custom prompt |

### Examples

```bash
# Sync product extraction
curl -X POST http://209.38.85.244:8407/proxy/crawl \
  -H "Authorization: Bearer $API_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/product", "task": "extract_product"}'

# Custom extraction with schema
curl -X POST http://209.38.85.244:8407/proxy/crawl \
  -H "Authorization: Bearer $API_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/article",
    "task": "custom",
    "prompt": "Extract article title, author, and publish date",
    "output_schema": {
      "type": "object",
      "properties": {
        "title": {"type": "string"},
        "author": {"type": "string"},
        "published": {"type": "string"}
      }
    }
  }'

# List available tasks
curl -H "Authorization: Bearer $API_SECRET" \
  http://209.38.85.244:8407/proxy/tasks

# Check job status
curl -H "Authorization: Bearer $API_SECRET" \
  http://209.38.85.244:8407/proxy/jobs/abc123def456
```

## SSH Key Setup (If You Need to Regenerate)

On the droplet:

```bash
# Generate new ed25519 key
ssh-keygen -t ed25519 -f /root/termux-key -N "" -C "termux-access"

# Add public key to authorized_keys
cat /root/termux-key.pub >> ~/.ssh/authorized_keys

# Base64 encode for the update server
base64 -w0 /root/termux-key > /root/termux-key.b64

# Restart update server
systemctl restart orchon-updates
```

## Common Tasks

### Deploy Code Changes to Droplet

```bash
# From local machine
ssh droplet "cd /root/orchon && git pull && systemctl restart orchon-bot orchon-ws orchon-updates orchon-proxy"
```

### Publish New App Version

```bash
# 1. Bump version in app/pubspec.yaml
# 2. Build APK
npm run app:build

# 3. Publish to droplet
npm run app:publish
```

### Check What's Running

```bash
# On the droplet
ps aux | grep node
systemctl list-units --type=service --state=running | grep orchon
```

## Troubleshooting

### SSH "Broken Pipe" Disconnects

Idle SSH connections get dropped. Fix by adding keep-alive to `~/.ssh/config`:

```bash
# In ~/.ssh/config
Host droplet
  HostName 209.38.85.244
  User root
  IdentityFile ~/.ssh/id_jaslr
  ServerAliveInterval 60
  ServerAliveCountMax 3

# Global fallback for all hosts
Host *
  ServerAliveInterval 60
  ServerAliveCountMax 3
```

Now just use `ssh droplet` instead of the full command.

### Random Characters on Mouse Click (Terminal Garbage)

This happens when tmux/vim/htop enable mouse reporting mode and don't clean it up on exit.

**Quick fix:** Run `reset` in terminal.

**Permanent fix:** Add to `~/.bashrc`:
```bash
# Reset mouse reporting mode on shell start
printf '\e[?1000l\e[?1002l\e[?1003l\e[?1006l' 2>/dev/null
```

### Can't Connect via SSH

```bash
# Check if SSH is running
ssh -v droplet

# Common issues:
# - Wrong key: Make sure you're using id_jaslr
# - Key permissions: chmod 600 ~/.ssh/id_jaslr
```

### App Says "Failed to Fetch SSH Key"

```bash
# Check if update server is running
curl http://209.38.85.244:8406/version

# If not responding, restart it
ssh droplet "systemctl restart orchon-updates"
```

### Update Server Returns 404

```bash
# Check if version.json exists
ssh droplet "cat /root/orchon/releases/version.json"

# Republish if missing
npm run app:publish
```

## Environment Variables

Required in `.env` for local development:

```bash
DROPLET_IP="209.38.85.244"
DROPLET_SSH_KEY="$HOME/.ssh/id_jaslr"
WS_PORT="8405"
UPDATES_PORT="8406"
PROXY_PORT="8407"
```

## Threads and Project Directories

When you create a thread in the app, you can select a project. This sets the working directory for Claude:

| Project Selection | Working Directory |
|-------------------|-------------------|
| Livna | `/root/projects/livna` |
| Brontiq | `/root/projects/brontiq` |
| ORCHON | `/root/orchon` |
| Other (no selection) | `/root` |

The orchestrator uses project context files in `/root/orchon/droplet/contexts/*.md` to understand each project.

### Adding a New Project

```bash
# On the droplet:
# 1. Clone the repo
cd /root/projects
git clone git@github.com:jaslr/your-repo.git

# 2. Create a context file (optional but helpful)
cat > /root/orchon/droplet/contexts/your-repo.md << 'EOF'
## Description
What this project does

## Aliases
- repo
- your-repo

## Deploy
**Platform**: Fly.io / Vercel / etc.
EOF

# 3. Restart WS server to reload contexts
systemctl restart orchon-ws
```

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     YOUR PHONE / DEVICE                         │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    ORCHON APP                                ││
│  │  • Check for updates (port 8406)                             ││
│  │  • SSH terminal to droplet (port 22)                         ││
│  │  • Launch Claude Code remotely                               ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                 DIGITALOCEAN DROPLET (209.38.85.244)            │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   SSH :22    │  │  WS :8405    │  │ Updates :8406│  │ Proxy :8407  │ │
│  │              │  │              │  │              │  │              │ │
│  │ • Shell      │  │ • Real-time  │  │ • /version   │  │ • /crawl     │ │
│  │ • Claude     │  │   messaging  │  │ • /download  │  │ • Chrome MCP │ │
│  │              │  │              │  │ • /termux-key│  │ • WebFetch   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                                          │
│  Systemd Services:                                                       │
│  • orchon-bot (Telegram bot)                                             │
│  • orchon-ws (WebSocket server)                                          │
│  • orchon-updates (Update server)                                        │
│  • orchon-proxy (Claude Code proxy)                                      │
└──────────────────────────────────────────────────────────────────────────┘
```
