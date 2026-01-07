# ORCHON

Infrastructure Observatory - deployment monitoring, health checks, and recovery actions across multiple platforms.

**Live:** https://orchon.pages.dev

## Features

- **Deployment Dashboard** - Real-time status of deployments across GitHub Actions, Cloudflare, Fly.io
- **Infrastructure Control Panel** - Monitor service health and trigger recovery actions
- **Project Management** - Configure repos, groups, and tech stack detection
- **Media Management** - Upload and manage project logos

## Tech Stack

- **Frontend:** SvelteKit + Tailwind CSS (Cloudflare Pages)
- **Backend:** Node.js + Hono (Fly.io)
- **Database:** PostgreSQL (Fly.io Postgres)

## Project Structure

```
orchon/
├── web/           # SvelteKit frontend
├── backend/       # Hono API server
├── .env           # Environment variables (not committed)
└── package.json   # Monorepo scripts
```

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
```

## Development

```bash
# Install dependencies
npm install

# Run frontend (http://localhost:5173)
npm run dev:web

# Run backend (http://localhost:3000)
npm run dev:backend
```

## Deployment

### Frontend (Cloudflare Pages)

**Important:** The deploy script reads credentials from `.env` to avoid wrangler account detection issues.

```bash
npm run deploy:web
```

This runs:
```bash
cd web && npm run build && \
CLOUDFLARE_API_TOKEN=$(grep CLOUDFLARE_API_TOKEN ../.env | cut -d= -f2) \
CLOUDFLARE_ACCOUNT_ID=$(grep CLOUDFLARE_ACCOUNT_ID ../.env | cut -d= -f2) \
npx wrangler pages deploy .svelte-kit/cloudflare --project-name=orchon
```

### Backend (Fly.io)

```bash
npm run deploy:backend
```

### Deploy All

```bash
npm run deploy:all
```

## Cloudflare API Token Permissions

The `CLOUDFLARE_API_TOKEN` needs these permissions:
- **Account:** Cloudflare Pages (Edit)
- **Account:** Account Settings (Read)

Create at: https://dash.cloudflare.com/profile/api-tokens

## Admin Routes

- `/admin/infra` - Infrastructure health & recovery actions
- `/admin/media` - Logo upload and management
- `/admin/projects` - Repository and group configuration
- `/admin/repos` - Tech stack detection config
