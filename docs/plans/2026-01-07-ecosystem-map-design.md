# ORCHON Ecosystem Map - Design Document

**Date:** 2026-01-07
**Status:** Approved
**Author:** Claude (via brainstorming session)

---

## Overview

Add an interactive ecosystem map to the ORCHON web dashboard showing all infrastructure components, their connections, and real-time health status.

---

## Goals

1. **Visibility** - See all services, platforms, and integrations at a glance
2. **Live Status** - Know immediately what's healthy, degraded, or down
3. **Navigation** - Quick access to logs, dashboards, and actions for each component
4. **Foundation** - Prepare for AI Gateway integration in Phase 2

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  ORCHON Web Dashboard (orchon.pages.dev/map)            │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Interactive Node Graph (d3-force)                │  │
│  │  - Draggable nodes with physics                   │  │
│  │  - Zoom/pan support                               │  │
│  │  - Click for details panel                        │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼ GET /api/health/ecosystem
┌─────────────────────────────────────────────────────────┐
│  ORCHON Backend (Fly.io)                                │
│  - Aggregates health checks from all services           │
│  - 30s cache TTL                                        │
│  - Parallel health check execution                      │
└─────────────────────────────────────────────────────────┘
```

---

## Data Model

### Node Structure

```typescript
interface EcosystemNode {
  id: string;              // "droplet-ws", "flyio-backend"
  label: string;           // "WebSocket :8405"
  type: "platform" | "service" | "external" | "app";
  status: "healthy" | "degraded" | "down" | "unknown";
  url?: string;            // Click to open (e.g., logs URL)
  parent?: string;         // "droplet" for services on droplet
  meta?: Record<string, string>; // Port, version, etc.
}

interface EcosystemEdge {
  from: string;            // Node ID
  to: string;              // Node ID
  label?: string;          // "WebSocket", "REST API"
}

interface EcosystemResponse {
  nodes: EcosystemNode[];
  edges: EcosystemEdge[];
  lastCheck: string;       // ISO timestamp
}
```

### Node Inventory

| ID | Label | Type | Parent | Status Check |
|----|-------|------|--------|--------------|
| `droplet` | DigitalOcean 209.38.85.244 | platform | - | Any child healthy |
| `droplet-ssh` | SSH :22 | service | droplet | TCP connect |
| `droplet-ws` | WebSocket :8405 | service | droplet | WS upgrade |
| `droplet-ota` | OTA :8406 | service | droplet | GET /version |
| `droplet-proxy` | Proxy :8407 | service | droplet | GET /health |
| `flyio` | Fly.io | platform | - | Self-check |
| `flyio-backend` | ORCHON Backend | service | flyio | GET /api/status/summary |
| `flyio-db` | Postgres | service | flyio | Backend reports |
| `cloudflare` | Cloudflare | platform | - | Any child healthy |
| `cloudflare-pages` | orchon.pages.dev | service | cloudflare | HTTP GET |
| `cloudflare-tunnel` | LLOL Proxy Tunnel | service | cloudflare | Via proxy check |
| `claude-api` | Claude API | external | - | API test or status |
| `gemini-api` | Gemini API | external | - | GET /models |
| `telegram` | Telegram Bot | external | - | getMe API |
| `github` | GitHub Webhooks | external | - | Recent webhook success |
| `flutter-app` | Doewah App | app | - | Implicit |
| `web-dashboard` | Web Dashboard | app | - | Implicit (you're viewing it) |

### Edge Inventory

| From | To | Label |
|------|----|-------|
| `flutter-app` | `droplet-ws` | WebSocket |
| `flutter-app` | `droplet-ota` | OTA Updates |
| `flutter-app` | `droplet-ssh` | SSH/Claude |
| `telegram` | `droplet` | Bot Commands |
| `droplet-proxy` | `claude-api` | AI Extraction |
| `droplet-proxy` | `cloudflare-tunnel` | LLOL Proxy |
| `flyio-backend` | `flyio-db` | Postgres |
| `github` | `flyio-backend` | Webhooks |
| `web-dashboard` | `flyio-backend` | REST API |

---

## Health Check Implementation

### Check Methods

| Service | Method | Timeout | Degraded Threshold |
|---------|--------|---------|-------------------|
| TCP ports (SSH) | `net.connect()` | 5s | >2s |
| HTTP endpoints | `fetch()` | 5s | >2s |
| WebSocket | WS upgrade attempt | 5s | >2s |
| External APIs | Lightweight test call | 5s | >2s |

### Status Logic

```
if (timeout) → "unknown"
if (error) → "down"
if (responseTime > 2000ms) → "degraded"
else → "healthy"
```

### Caching

- **TTL:** 30 seconds
- **Storage:** In-memory (Fly.io instance)
- **Parallel execution:** All checks run concurrently
- **Fail-open:** If a check fails, others still return

---

## Visual Design

### Status Colors

| Status | Border | Background |
|--------|--------|------------|
| healthy | green (#22c55e) | green/10 |
| degraded | yellow (#eab308) | yellow/10 |
| down | red (#ef4444) | red/10 |
| unknown | gray (#6b7280) | gray/10 |

### Layout

- **Force-directed graph** with collision detection
- **Parent nodes** are larger, contain child services
- **External nodes** positioned around the edges
- **Central focus** on the droplet (primary infrastructure)

### Interactions

| Action | Result |
|--------|--------|
| Drag node | Reposition (physics-based) |
| Scroll/pinch | Zoom in/out |
| Click node | Open details panel |
| Click edge | Show connection info |
| Hover | Highlight connected nodes |

### Detail Panel

Slide-out panel showing:
- Service name and status
- Last check timestamp
- Response time
- Quick actions (View logs, Restart, Open URL)
- Metadata (port, version, etc.)

---

## File Structure

### Backend (`orchon/backend/`)

```
src/
├── routes/
│   └── health.ts              # GET /api/health/ecosystem
├── services/
│   └── ecosystem-health/
│       ├── index.ts           # Orchestrator
│       ├── checkers/
│       │   ├── droplet.ts     # Port checks
│       │   ├── flyio.ts       # Self-health
│       │   ├── external.ts    # Claude, Gemini, Telegram
│       │   └── cloudflare.ts  # Pages check
│       ├── cache.ts           # TTL cache
│       └── config.ts          # Node/edge definitions
└── types/
    └── ecosystem.ts           # TypeScript interfaces
```

### Frontend (`orchon/web/`)

```
src/
├── routes/
│   └── map/
│       └── +page.svelte       # Ecosystem map page
├── lib/
│   ├── components/
│   │   └── ecosystem/
│       │   ├── Graph.svelte       # Main graph (d3-force)
│       │   ├── Node.svelte        # Node component
│       │   ├── Edge.svelte        # Edge/connection line
│       │   └── DetailPanel.svelte # Slide-out details
│   └── stores/
│       └── ecosystem.ts       # Graph state store
```

### Dependencies

- `d3-force` (~30kb) - Force simulation only
- No additional backend dependencies

---

## API Specification

### GET /api/health/ecosystem

**Response:**
```json
{
  "nodes": [
    {
      "id": "droplet",
      "label": "DigitalOcean 209.38.85.244",
      "type": "platform",
      "status": "healthy",
      "meta": { "ip": "209.38.85.244" }
    },
    {
      "id": "droplet-ws",
      "label": "WebSocket :8405",
      "type": "service",
      "status": "healthy",
      "parent": "droplet",
      "url": "ws://209.38.85.244:8405",
      "meta": { "port": "8405", "responseTime": "124ms" }
    }
  ],
  "edges": [
    { "from": "flutter-app", "to": "droplet-ws", "label": "WebSocket" }
  ],
  "lastCheck": "2026-01-07T12:34:56Z"
}
```

**Headers:**
- `Authorization: Bearer <API_SECRET>` (required)
- `Cache-Control: max-age=30`

---

## Future Phases

### Phase 2: AI Gateway Service

New droplet service (`orchon-ai-gateway` on port 8408):
- Tries Claude (login session) first
- Falls back to Gemini API on auth failure
- Unified response format for all consumers
- Stores Claude session on droplet

**Consumers:**
- orchon-proxy (LLOL scraping)
- claude-bot (Telegram)
- Flutter app (via droplet)

### Phase 3: Map Integration

- Add AI Gateway node to ecosystem map
- Show active provider (Claude vs Gemini)
- Indicate if Claude auth needs refresh

### Phase 4: Actions from Map

- "Re-authenticate Claude" button
- "Test Gemini" quick action
- Service restart buttons (with confirmation)
- Log streaming in detail panel

---

## Implementation Checklist

### Phase 1: Ecosystem Map

**Backend:**
- [ ] Create ecosystem health service structure
- [ ] Implement droplet port checkers (22, 8405, 8406, 8407)
- [ ] Implement external API checkers (Claude, Gemini, Telegram)
- [ ] Implement Fly.io/Cloudflare checkers
- [ ] Add caching layer with 30s TTL
- [ ] Create GET /api/health/ecosystem endpoint
- [ ] Add /health endpoint to droplet proxy service

**Frontend:**
- [ ] Install d3-force dependency
- [ ] Create /map route
- [ ] Build Graph.svelte with force simulation
- [ ] Build Node.svelte with status colors
- [ ] Build Edge.svelte for connections
- [ ] Build DetailPanel.svelte for node details
- [ ] Create ecosystem store for state management
- [ ] Add zoom/pan controls
- [ ] Add "Ecosystem" link to navigation
- [ ] Implement auto-refresh (30s polling)

**Deployment:**
- [ ] Deploy backend to Fly.io
- [ ] Deploy frontend to Cloudflare Pages
- [ ] Test all health checks
- [ ] Verify map loads correctly

---

## Success Criteria

1. Map displays all nodes with correct hierarchy
2. Status colors update within 30 seconds of service changes
3. Clicking a node shows relevant details
4. Graph is draggable and zoomable
5. Works on mobile (touch gestures)
6. Page loads in <2 seconds
