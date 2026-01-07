# Session Summary: Infrastructure Map Feature

**Date:** 2026-01-07
**Feature:** Live Infrastructure Status Map for ORCHON Dashboard

---

## What Was Built

An **Interactive Infrastructure Map** showing live health status of the entire ORCHON ecosystem:

### Frontend (SvelteKit + d3-force)
- **New component:** `web/src/lib/components/InfrastructureMap.svelte`
  - Interactive d3-force graph with draggable nodes
  - Zoom/pan controls
  - Click nodes to see details panel
  - Auto-refresh every 30 seconds
  - Status legend (Healthy/Degraded/Down/Unknown)

- **Modified:** `web/src/routes/ecosystem/+page.svelte`
  - Added "Infrastructure" as new default tab
  - Imports InfrastructureMap component

### Backend (Hono on Fly.io)
- **New service:** `backend/src/services/ecosystem-health/`
  - `types.ts` - TypeScript interfaces for nodes/edges
  - `config.ts` - Timeout and threshold settings
  - `index.ts` - Orchestrator with 30s cache TTL
  - `checkers/droplet.ts` - DigitalOcean services (WS:8405, OTA:8406, Proxy:8407, SSH, Bot)
  - `checkers/platforms.ts` - Fly.io (backend, Postgres) + Cloudflare (Pages, Tunnel)
  - `checkers/external.ts` - Claude API, Gemini API, Telegram API, GitHub API

- **New endpoint:** `GET /health/ecosystem`
  - Returns `{ nodes: EcosystemNode[], edges: EcosystemEdge[], timestamp: string, cacheAge: number }`
  - Query param `?refresh=true` forces cache refresh

- **Modified:** `backend/src/index.ts`
  - Added CORS support for Cloudflare Pages preview deployments (`*.orchon-3tt.pages.dev`)

---

## Files Created

```
backend/src/services/ecosystem-health/
├── types.ts           # NodeStatus, NodeType, EcosystemNode, EcosystemEdge interfaces
├── config.ts          # DROPLET_IP, CHECK_TIMEOUT (5s), DEGRADED_THRESHOLD (1s), CACHE_TTL (30s)
├── index.ts           # getEcosystemStatus(), refreshEcosystemStatus()
└── checkers/
    ├── droplet.ts     # checkDropletServices() - SSH, WS, OTA, Proxy, Bot
    ├── external.ts    # checkExternalServices() - Claude, Gemini, Telegram, GitHub
    └── platforms.ts   # checkPlatformServices() - Fly.io, Cloudflare

web/src/lib/components/
└── InfrastructureMap.svelte  # d3-force interactive graph component

docs/plans/
└── 2026-01-07-ecosystem-map-design.md  # Full design document
```

---

## Files Modified

| File | Changes |
|------|---------|
| `backend/src/routes/health.ts` | Added `/ecosystem` endpoint |
| `backend/src/config/env.ts` | Added `dropletIp` config |
| `backend/src/index.ts` | Updated CORS to allow preview deployments |
| `web/src/routes/ecosystem/+page.svelte` | Added Infrastructure tab (default) |
| `web/src/routes/admin/infra/+page.svelte` | Fixed Svelte template literal issue |

---

## API Response Format

```typescript
interface EcosystemNode {
  id: string;           // e.g., "droplet-ws", "flyio-backend"
  label: string;        // Display name
  type: 'platform' | 'service' | 'external' | 'app';
  status: 'healthy' | 'degraded' | 'down' | 'unknown';
  url?: string;         // Clickable link
  parent?: string;      // Parent node ID for grouping
  meta?: Record<string, string>;  // Response time, version, etc.
}

interface EcosystemEdge {
  from: string;
  to: string;
  label?: string;
}
```

---

## Nodes Monitored

### Platforms
- **DigitalOcean Droplet** (209.38.85.244)
  - SSH :22 (marked unknown - can't TCP from cloud)
  - WebSocket :8405
  - OTA Updates :8406
  - Proxy API :8407
  - Telegram Bot

- **Fly.io**
  - ORCHON Backend
  - Postgres Database

- **Cloudflare**
  - orchon.pages.dev (Pages)
  - LLOL Proxy Tunnel

### External APIs
- Claude API (Anthropic)
- Gemini API (Google)
- Telegram Bot API
- GitHub API

### Apps
- Web Dashboard
- Doewah Flutter App (status unknown from server)

---

## Commits

1. `a5234c1` - docs: add ecosystem map design document
2. `ec6c3b8` - feat: add live infrastructure status map to ecosystem page

---

## Deployments

| Component | Status | URL |
|-----------|--------|-----|
| Backend | Deployed | https://observatory-backend.fly.dev |
| Web | Deployed | https://orchon.pages.dev/ecosystem |

---

## Future Phases (from design doc)

- **Phase 2:** AI Gateway service (port 8408) with Claude/Gemini fallback
- **Phase 3:** Map integration showing active AI provider
- **Phase 4:** Actions from map (re-auth Claude, restart services)

---

## Troubleshooting

### CORS Error on Preview Deployments
Backend now allows `*.orchon-3tt.pages.dev` via dynamic origin check.

### "Failed to fetch" on Infrastructure tab
1. Check backend is running: `curl https://observatory-backend.fly.dev/health`
2. Check ecosystem endpoint: `curl https://observatory-backend.fly.dev/health/ecosystem -H "Authorization: Bearer $API_SECRET"`
3. Check browser console for CORS errors

### Droplet services showing "down"
Verify services are running on droplet:
```bash
ssh root@209.38.85.244 "systemctl status orchon-ws orchon-updates orchon-proxy"
```
