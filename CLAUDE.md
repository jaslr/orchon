# ORCHON - Infrastructure Observatory & DevOps Control Plane

## Browser Automation

**Primary: agent-browser CLI** (try first) | **Backup: Chrome DevTools MCP**

```bash
agent-browser open <url>        # Navigate
agent-browser snapshot -i       # Get elements with refs (@e1, @e2)
agent-browser click @e1         # Click by ref
agent-browser fill @e2 "text"   # Fill input
agent-browser screenshot        # Take screenshot
agent-browser close             # Close browser
```

Fall back to Chrome DevTools MCP only if agent-browser fails.

---

## Project Overview

**ORCHON** is a comprehensive infrastructure monitoring and DevOps control platform with multiple interfaces:

| Component | Location | Purpose |
|-----------|----------|---------|
| Web Dashboard | `web/` | SvelteKit frontend on Cloudflare Pages |
| Backend API | `backend/` | Hono + Postgres on Fly.io |
| Mobile App | `app/` | Flutter app with OTA updates |
| Droplet Services | `droplet/` | Bot, WebSocket, OTA server on DigitalOcean |

---

## Monorepo Structure

```
orchon/
├── web/                    # SvelteKit frontend (Cloudflare Pages)
│   ├── src/
│   ├── package.json
│   └── wrangler.toml
├── backend/                # Hono API (Fly.io)
│   ├── src/
│   ├── migrations/
│   ├── fly.toml
│   └── Dockerfile
├── app/                    # Flutter mobile app
│   ├── lib/
│   ├── android/
│   └── pubspec.yaml
├── droplet/                # DigitalOcean Droplet services
│   ├── bot/                # Telegram bot
│   ├── ws/                 # WebSocket + OTA servers
│   ├── orchestrator/       # NLP routing
│   ├── contexts/           # Project context files
│   └── systemd/            # Service definitions
└── scripts/                # Deployment scripts
```

---

## Infrastructure Layout

| Component | Platform | URL/Port | Purpose |
|-----------|----------|----------|---------|
| Web Dashboard | Cloudflare Pages | https://orchon.pages.dev | Status UI |
| Backend API | Fly.io | https://observatory-backend.fly.dev | REST API + webhooks |
| WebSocket | Droplet :8405 | ws://209.38.85.244:8405 | Real-time Claude threads |
| OTA Server | Droplet :8406 | http://209.38.85.244:8406 | App updates |
| Proxy API | Droplet :8407 | http://209.38.85.244:8407 | Claude Code + MCP scraping |
| Telegram Bot | Droplet | @orchon_bot | Chat control |
| Database | Fly.io Postgres | Internal | Deployment data |

---

## Deployment Commands

### IMPORTANT: Git Push ≠ Production Deploy

| Action | What it does |
|--------|--------------|
| `git push` | Version control backup to GitHub |
| `npm run deploy:web` | Build + deploy frontend to Cloudflare |
| `npm run deploy:backend` | Deploy backend to Fly.io |
| `npm run deploy:droplet` | Pull + restart services on droplet |
| `npm run app:ship` | Build + publish Flutter app to OTA |

### Quick Deploy (All Components)

```bash
git push && npm run deploy:all
```

### Web Dashboard (Cloudflare Pages)

```bash
cd web && npm run build && wrangler pages deploy .svelte-kit/cloudflare --project-name=orchon
```

### Backend API (Fly.io)

```bash
cd backend && fly deploy --now
```

### Droplet Services

```bash
ssh root@209.38.85.244 "cd /root/projects/orchon && git pull && systemctl restart orchon-bot orchon-ws orchon-updates orchon-proxy"
```

### Flutter App (OTA)

**IMPORTANT:** Flutter is installed at `/home/chip/flutter/bin/flutter`. Add to PATH before building:
```bash
export PATH="$PATH:/home/chip/flutter/bin"
```

**NEVER tell the user to deploy manually. Always build and deploy automatically.**

```bash
# 1. Bump version in app/pubspec.yaml
# 2. Build APK (no ORCHON_API_SECRET needed - received from backend at login)
export PATH="$PATH:/home/chip/flutter/bin"
cd app && flutter build apk --release \
  --dart-define=WS_URL=ws://209.38.85.244:8405

# 3. Publish to OTA server
cd .. && ./droplet/scripts/publish-release.sh release
```

**Note:** API token is now received from backend after user authentication - no build-time secrets needed.

**First-time install:** http://209.38.85.244:8406/download

**Check OTA version:** `curl http://209.38.85.244:8406/version`

---

## Configuration

### API Authentication

The backend uses `API_SECRET` for API authentication. The app receives this token automatically after user login.

```bash
# Generate new secret (if needed)
openssl rand -hex 32

# Update backend (Fly.io)
fly secrets set API_SECRET=<new> -a observatory-backend
```

**Note:** The app no longer needs `ORCHON_API_SECRET` at build time. After user authenticates, the backend returns the access token which is stored locally.

### Environment Files

| Location | Purpose |
|----------|---------|
| `.env` | Root config (droplet IP, secrets) |
| `backend/.env` | Fly.io secrets (DATABASE_URL, API_SECRET) |
| `/root/projects/orchon/.env` | Droplet runtime config |

### Droplet Paths

| Path | Purpose |
|------|---------|
| `/root/projects/orchon/` | Main project directory on VPS |
| `/root/projects/orchon/releases/` | OTA APK releases |
| `/root/projects/orchon/droplet/` | Service scripts |

---

## Development

### Local Development

```bash
# Web frontend (port 4573)
npm run dev:web

# Backend (requires DATABASE_URL)
npm run dev:backend

# Flutter app
cd app && flutter run
```

### Tech Stack

| Component | Stack |
|-----------|-------|
| Web | SvelteKit 2.x + Svelte 5 + Tailwind 4 |
| Backend | Hono + TypeScript + Postgres |
| App | Flutter + Riverpod |
| Bot | Node.js |

### Code Style

- **No emojis** in UI - use Lucide icons
- **Mobile-first** responsive design
- Use Svelte 5 runes: `$state`, `$derived`, `$effect`

---

## API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /api/projects` | List monitored projects |
| `GET /api/deployments/recent?limit=N` | Recent deployments |
| `GET /api/deployments/failures?limit=N` | Failed deployments |
| `GET /api/deployments/:id` | Single deployment |
| `GET /api/status/summary` | Health overview |
| `POST /webhooks/github` | GitHub webhook receiver |

All API endpoints require `Authorization: Bearer <API_SECRET>`.

---

## Droplet Services

### Systemd Services

| Service | Description |
|---------|-------------|
| `orchon-bot` | Telegram bot |
| `orchon-ws` | WebSocket server |
| `orchon-updates` | OTA update server |
| `orchon-proxy` | Claude Code + MCP proxy API |

### Proxy API (LLOL Integration)

The proxy service (`orchon-proxy`) provides AI-powered web scraping for [Little List of Lights](https://github.com/jaslr/littlelistoflights).

**Architecture:**
```
LLOL Admin → https://proxy.littlelistoflights.com → Claude + WebFetch → Extract Flashlight Specs
```

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/proxy/crawl` | POST | Start extraction job |
| `/proxy/jobs/:id` | GET | Poll job status/progress |

**Key files:**
- `droplet/proxy/server.js` - Express server with job queue
- `droplet/proxy/executor.js` - Claude execution with MCP tools
- `droplet/proxy/tasks.js` - Extraction prompt templates

**Cloudflare Tunnel:** `proxy.littlelistoflights.com` → `localhost:8407`

**Related repo:** See [LLOL src/routes/admin/flashlights/proxyadd](https://github.com/jaslr/littlelistoflights) for the frontend UI.

### Service Management

```bash
# Check status
systemctl status orchon-bot orchon-ws orchon-updates orchon-proxy

# View logs
journalctl -u orchon-bot -f
journalctl -u orchon-proxy -f

# Restart all
systemctl restart orchon-bot orchon-ws orchon-updates orchon-proxy
```

---

## Adding New Integrations

Follow the pattern in `droplet/orchestrator/index.js`:

1. Add config constants at top
2. Add API query function
3. Add `execute*` function(s) for actions
4. Add detection patterns in `detectAction()`
5. Add cases in `executeAction()` switch

---

## Task Completion Protocol

**MANDATORY: Auto-deploy immediately after completing any task. Never ask - just do it.**

### Deployment is Part of Task Completion

A task is NOT complete until deployed. Follow this sequence:

```bash
# 1. Commit and push
git add -A && git commit -m "description" && git push

# 2. Deploy ALL affected components (don't ask, just deploy)
```

### Auto-Deploy Commands by Component

| Changed | Deploy Command |
|---------|---------------|
| `web/*` | `cd web && npm run build && wrangler pages deploy .svelte-kit/cloudflare --project-name=orchon` |
| `backend/*` | `cd backend && npm run build && fly deploy --now` |
| `droplet/*` | `ssh root@209.38.85.244 "cd /root/projects/orchon && git pull && systemctl restart orchon-bot orchon-ws orchon-updates orchon-proxy"` |
| `app/*` | See APK + OTA deploy below |

### APK + OTA Deploy (for app/ changes)

```bash
# Full auto-deploy sequence for app changes
export PATH="$PATH:/home/chip/flutter/bin"
cd /home/chip/orchon

# 1. Bump version in pubspec.yaml (increment version number)

# 2. Build APK (no API secret needed - token comes from auth at runtime)
cd app && flutter build apk --release \
  --dart-define=WS_URL=ws://209.38.85.244:8405

# 3. Publish to OTA server
cd .. && ./droplet/scripts/publish-release.sh release
```

**Note:** `ORCHON_API_SECRET` is no longer needed at build time. The app receives the access token from the backend after user authentication.

### Fly.io Authentication

If `fly deploy` fails with auth error:
```bash
flyctl auth login
```

**NEVER ask "should I deploy?" - deployment is automatic and mandatory.**
