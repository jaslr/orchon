# ORCHON

Infrastructure Observatory & DevOps Control Plane - deployment monitoring, health checks, and recovery actions across multiple platforms.

**Live:** https://orchon.pages.dev

## Features

- **Deployment Dashboard** - Real-time status of deployments across GitHub Actions, Cloudflare, Fly.io
- **Infrastructure Control Panel** - Monitor service health and trigger recovery actions
- **Mobile App** - Flutter app with SSH terminal, Claude AI sessions, server management
- **Telegram Bot** - Chat-based control and notifications
- **Project Management** - Configure repos, groups, and tech stack detection

## Architecture

| Component | Platform | URL/Port |
|-----------|----------|----------|
| Web Dashboard | Cloudflare Pages | https://orchon.pages.dev |
| Backend API | Fly.io | https://observatory-backend.fly.dev |
| Mobile App | Flutter/Android | OTA via droplet |
| WebSocket | Droplet :8405 | ws://209.38.85.244:8405 |
| OTA Server | Droplet :8406 | http://209.38.85.244:8406 |
| Telegram Bot | Droplet | @orchon_bot |

## Tech Stack

- **Frontend:** SvelteKit + Tailwind CSS (Cloudflare Pages)
- **Backend:** Node.js + Hono (Fly.io)
- **Database:** PostgreSQL (Fly.io Postgres)
- **Mobile:** Flutter + Riverpod + dartssh2
- **Droplet:** Node.js services on DigitalOcean

## Project Structure

```
orchon/
├── web/                    # SvelteKit frontend (Cloudflare Pages)
├── backend/                # Hono API server (Fly.io)
├── app/                    # Flutter mobile app
│   ├── lib/
│   │   ├── features/       # Screen modules
│   │   ├── core/           # Services, config
│   │   └── models/         # Data models
│   └── pubspec.yaml
├── droplet/                # DigitalOcean Droplet services
│   ├── bot/                # Telegram bot
│   ├── ws/                 # WebSocket + OTA servers
│   ├── scripts/            # Deployment scripts
│   └── systemd/            # Service definitions
└── .env                    # Environment variables (not committed)
```

---

## Mobile App Deployment (Flutter APK)

### Prerequisites

```bash
# Flutter installed at /home/chip/flutter/bin
export PATH="$PATH:/home/chip/flutter/bin"

# SSH key for droplet access
# Key: ~/.ssh/id_jaslr
# User: root@209.38.85.244
```

### Build & Deploy

```bash
# 1. Bump version in app/pubspec.yaml
#    e.g., version: 1.3.30+40 -> 1.3.31+41

# 2. Build release APK
export PATH="$PATH:/home/chip/flutter/bin"
cd /home/chip/orchon/app
flutter build apk --release --dart-define=WS_URL=ws://209.38.85.244:8405

# 3. Publish to OTA server
cd /home/chip/orchon
./droplet/scripts/publish-release.sh release
```

### OTA Server Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/version` | GET | Current version JSON |
| `/download` | GET | Download latest APK |
| `/server/stats` | GET | CPU, memory, disk usage |
| `/server/processes` | GET | Top processes by CPU |
| `/tmux-sessions` | GET | List Claude sessions |

### Verify Deployment

```bash
# Check version on OTA server
curl http://209.38.85.244:8406/version

# Test download
curl -s http://209.38.85.244:8406/download -o /dev/null -w "Size: %{size_download}\n"

# First-time install URL
# http://209.38.85.244:8406/download
```

### SSH Access to Droplet

```bash
# From WSL
ssh -i ~/.ssh/id_jaslr root@209.38.85.244

# Check services
systemctl status orchon-bot orchon-ws orchon-updates

# View logs
journalctl -u orchon-updates -f

# Restart services
systemctl restart orchon-bot orchon-ws orchon-updates
```

---

## Web & Backend Deployment

### Frontend (Cloudflare Pages)

```bash
npm run deploy:web
```

### Backend (Fly.io)

```bash
npm run deploy:backend
```

### Deploy All

```bash
npm run deploy:all
```

---

## Droplet Services

### Systemd Services

| Service | Port | Description |
|---------|------|-------------|
| orchon-bot | - | Telegram bot |
| orchon-ws | 8405 | WebSocket server |
| orchon-updates | 8406 | OTA update server |

### Service Management

```bash
# SSH to droplet
ssh -i ~/.ssh/id_jaslr root@209.38.85.244

# Check all services
systemctl status orchon-bot orchon-ws orchon-updates --no-pager

# Restart all
systemctl restart orchon-bot orchon-ws orchon-updates

# Pull latest code and restart
cd /root/projects/orchon && git pull && systemctl restart orchon-bot orchon-ws orchon-updates
```

### Releases Directory

```
/root/projects/orchon/releases/
├── orchon-1.3.30-release.apk   # Current APK
├── version.json                 # Version metadata
└── ...                          # Previous versions
```

---

## Environment Variables

Create `.env` in the root directory:

```bash
# GitHub Personal Access Tokens
GITHUB_PAT_JASLR=ghp_xxx
GITHUB_PAT_JVP_UX=ghp_xxx

# Authentication
AUTH_USERNAME_HASH=your@email.com
AUTH_PASSWORD_HASH=your-password

# Backend API Secret (must match Fly.io secret)
API_SECRET=your-api-secret

# Cloudflare (for frontend deployment)
CLOUDFLARE_API_TOKEN=xxx
CLOUDFLARE_ACCOUNT_ID=e9af2f15702b07294053971e6cf5cf39

# Droplet
DROPLET_IP=209.38.85.244
```

---

## Development

```bash
# Install dependencies
npm install

# Run frontend (http://localhost:5173)
npm run dev:web

# Run backend (http://localhost:3000)
npm run dev:backend

# Run Flutter app
cd app && flutter run
```

---

## Admin Routes

- `/admin/infra` - Infrastructure health & recovery actions
- `/admin/media` - Logo upload and management
- `/admin/projects` - Repository and group configuration
- `/admin/repos` - Tech stack detection config
