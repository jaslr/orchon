# Claude Instructions for Infrastructure Observatory

## Project Overview

**ORCHON** (Infrastructure Observatory) - a comprehensive platform for monitoring CI/CD pipelines, infrastructure health, and service integrations across multiple projects and accounts.

---

## Integration: ORCHON ↔ DOA

### MOU (Memorandum of Understanding)

| Project | Role | Consumes | Provides |
|---------|------|----------|----------|
| **ORCHON** | Infrastructure Observatory | GitHub webhooks, provider APIs | Deployment status API |
| **DOA** | DevOps Control Plane | ORCHON deployment data | Fix actions via Claude threads |

**Data Flow:**
```
GitHub/Cloudflare/Fly.io → ORCHON (monitors) → DOA (displays + acts)
                              ↑                      ↓
                         Webhooks              Claude Code (fixes)
```

### Handshake Configuration

| ORCHON Side | DOA Side | Notes |
|-------------|----------|-------|
| `API_SECRET` (Fly.io secret) | `ORCHON_API_SECRET` (dart-define) | **Must match** |
| Backend URL | `ORCHON_URL` config | `https://observatory-backend.fly.dev` |

**To update the shared secret:**
1. Generate new secret: `openssl rand -hex 32`
2. ORCHON: `fly secrets set API_SECRET=<new> -a observatory-backend`
3. DOA: Rebuild Flutter app with `--dart-define=ORCHON_API_SECRET=<new>`

### API Endpoints Provided to DOA

| Endpoint | Purpose | Auth |
|----------|---------|------|
| `GET /api/deployments/recent?limit=N` | Recent deployments across all projects | Bearer token |
| `GET /api/deployments/failures?limit=N` | Failed deployments only | Bearer token |
| `GET /api/deployments/:id` | Single deployment details | Bearer token |
| `GET /api/status/summary` | Overall health summary | Bearer token |

### Files to Update When Changing Integration

**ORCHON:**
- `observatory-backend/.env.example` - Document API_SECRET
- `observatory-backend/src/config/env.ts` - Secret validation
- `observatory-backend/src/routes/api.ts` - Deployment endpoints
- `observatory-backend/src/db/queries.ts` - Deployment data structure

**DOA:**
- `app/lib/core/config.dart` - ORCHON URL + secret config
- `app/lib/core/orchon/orchon_service.dart` - API client + endpoints
- `app/lib/models/deployment.dart` - Data model (must match ORCHON schema)

---

## Infrastructure Choices

| Component | Platform | Why |
|-----------|----------|-----|
| Frontend | Cloudflare Pages | Free, global CDN, direct wrangler deploys |
| Backend | Fly.io (`observatory-backend`) | Free tier, Postgres included, auto-sleep |
| Database | Fly.io Postgres | Included with Fly, easy migrations |
| DOA Backend | DigitalOcean Droplet | Persistent SSH, Claude Code sessions |
| DOA App | Self-hosted OTA | Bypass Play Store, instant updates |

**Why this split?**
- ORCHON = monitoring (stateless queries, can auto-sleep)
- DOA = actions (needs persistent SSH for Claude Code)

---

## Development Guidelines

### Use Beads for Issue Tracking

```bash
bd ready           # Check what's ready to work on
bd create "..."    # Create new issues
bd update <id>     # Update status
bd close <id>      # Complete work
```

Always commit `.beads/issues.jsonl` with related code changes.

### Code Style

- **No emojis** in UI - use Lucide icons instead
- **Mobile-first** responsive design
- **Local-first** architecture - minimize server round-trips
- **Background data fetching** - no UI refresh flashing

### Tech Stack

- SvelteKit 2.x + Svelte 5 (use runes: `$state`, `$derived`, `$effect`)
- Tailwind CSS 4.x
- Consider Skeleton UI for component library
- Lucide for icons

### Architecture Decisions

1. **Read-only Phase 1**: Display infrastructure status, no mutations
2. **CRUD Phase 2**: Add ability to trigger actions (retries, deployments)
3. **Meta-monitoring**: Deploy watcher on separate cloud (AWS/GCP/Azure free tier)

### Infrastructure Services to Support

- **CI/CD**: GitHub Actions
- **Hosting**: Cloudflare Pages, Fly.io, Vercel, Netlify
- **Database**: Supabase, PlanetScale, Neon
- **DNS**: Cloudflare, Ventra IP, DNS Made Easy
- **Storage**: AWS S3, Cloudflare R2
- **Auth**: Supabase Auth, Auth0, Clerk
- **Analytics**: Various
- **Error Tracking**: Sentry

### Account Mapping

Track which GitHub account owns each repo:
- jvp-ux (simulations)
- jaslr (Ladderbox, Junipa)
- stickyjason (misc)
- Plus client and hobby projects

### Key Features to Build

1. CI status dashboard (current)
2. Infrastructure topology diagrams (live, animated during deploys)
3. Service health checks (DNS, domains, MX records)
4. Stack detection (framework, CSS, tools)
5. Account/identity mapping
6. Ecosystem overview diagram

### Ports

| Service | Port | Description |
|---------|------|-------------|
| SvelteKit Dev | 4573 | Main app (400 above standard 4173) |
| PocketBase | 4617 | Local DB + Admin UI at /_/ |

### Commands

```bash
npm run dev        # Start dev server on port 4573
npm run dev:all    # Start both SvelteKit + PocketBase
npm run pocketbase # Start PocketBase only (port 4617)
npm run ports      # List all listening ports
npm run ports:kill # Kill observatory ports
npm run build      # Production build
npm run check      # Type checking
bd ready           # Check beads issues
```

### Quick Commands

- **"get it live"** = Full deployment workflow (see below)

### Get It Live (Cloudflare Pages Deployment)

When asked to "get it live" for this project:

1. **Check for uncommitted changes first**:
   ```bash
   git status --porcelain
   ```
2. If there are uncommitted files, commit them with a descriptive message
3. **Bump version**:
   ```bash
   npm version patch --no-git-tag-version
   ```
4. **Commit the version bump**:
   ```bash
   git add -A && git commit -m "v0.x.x: <description>"
   ```
5. **Push to GitHub** (version control/backup):
   ```bash
   git push
   ```
6. **Deploy to Cloudflare Pages (production)**:
   ```bash
   npm run build && npx wrangler pages deploy .svelte-kit/cloudflare --project-name=orchon --branch=main
   ```
   Production URL: https://orchon.pages.dev

### Task Completion Protocol

**IMPORTANT: ALWAYS deploy after completing any task. Don't wait to be asked - just get it live.**

When completing a task:
1. **Commit changes** with a descriptive message
2. **Bump version**: `npm version patch --no-git-tag-version`
3. **Commit version bump**: `git add -A && git commit -m "v0.x.x: <description>"`
4. **Push to GitHub**: `git push`
5. **Deploy backend** (if backend changes):
   ```bash
   cd observatory-backend && fly deploy --now
   ```
6. **Run migrations** (if database changes):
   ```bash
   fly ssh console -a observatory-backend -C 'node -e "
   const { Pool } = require(\"pg\");
   const fs = require(\"fs\");
   const pool = new Pool({ connectionString: process.env.DATABASE_URL });
   const sql = fs.readFileSync(\"migrations/<migration_file>.sql\", \"utf8\");
   pool.query(sql).then(() => { console.log(\"Migration successful\"); pool.end(); }).catch(e => { console.error(\"Migration failed:\", e.message); process.exit(1); });
   "'
   ```
7. **Deploy frontend**:
   ```bash
   npm run build && npx wrangler pages deploy .svelte-kit/cloudflare --project-name=orchon --branch=main
   ```

### Deployment (Forked Workflow - No GitHub Actions)

This project uses a **forked deployment workflow**:

```
Your Machine
    │
    ├──► git push     →  GitHub (version control, backup)
    │
    └──► wrangler     →  Cloudflare Pages (production)
```

**Quick commands:**
```bash
npm version patch --no-git-tag-version                                                            # Bump version
git add -A && git commit -m "v0.x.x: ..."                                                         # Commit
git push                                                                                           # Push to GitHub
npm run build && npx wrangler pages deploy .svelte-kit/cloudflare --project-name=orchon --branch=main  # Deploy to production
```

**Production URL:** https://orchon.pages.dev

**Why forked?**
- Deploys directly via Wrangler - no GitHub Actions minutes consumed
- Build errors appear locally in your terminal
- Faster than waiting for CI runner to spin up
- GitHub is for version control/backup, not deployment triggers

### VS Code Tasks

- **Run Orchon Local (with PROD connection)** - Runs dev server connecting to production backend
- **Check: Active Ports** - Shows port usage
- **Deploy: Get It Live** - Full deployment
