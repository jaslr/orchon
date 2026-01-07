# Infrastructure Control Panel Design

**Date:** 2026-01-07
**Status:** Approved
**Location:** `/admin/infra` in ORCHON webapp

## Problem

When ORCHON's Postgres database went down, recovery required CLI access (`fly machine restart`). We need self-service infrastructure control from the ORCHON UI.

## Solution

Add an `/admin/infra` page that:
1. Shows health status of all monitored services
2. Allows triggering recovery actions (restart, redeploy) per service
3. Logs all actions for audit trail

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  /admin/infra                                           │
├─────────────────────────────────────────────────────────┤
│  Health Dashboard (live status of all services)         │
│  Recovery Actions (configurable per-service buttons)    │
│  Execution Log (audit trail of all actions)             │
└─────────────────────────────────────────────────────────┘
```

## Data Model

### Table: `recovery_actions`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| service_id | TEXT | FK to services table |
| name | TEXT | Display name ("Restart Machine") |
| action_type | TEXT | 'fly-api', 'github-workflow', 'gcp-api', 'ssh-command' |
| config | JSONB | Type-specific configuration |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### Table: `action_executions`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| action_id | UUID | FK to recovery_actions |
| triggered_by | TEXT | 'manual' or 'auto-heal' |
| status | TEXT | 'pending', 'running', 'success', 'failure' |
| output | TEXT | stdout/stderr or API response |
| started_at | TIMESTAMPTZ | |
| completed_at | TIMESTAMPTZ | |

## Action Type Configs

### fly-api
```json
{
  "app": "observatory-pg",
  "machine_id": "d891153be7e138",
  "action": "restart"
}
```

### github-workflow
```json
{
  "owner": "jaslr",
  "repo": "livna",
  "workflow": "deploy.yml",
  "ref": "main"
}
```

### gcp-api
```json
{
  "project": "junipa-prod",
  "service": "junipa-cedarcollege",
  "region": "australia-southeast1"
}
```

### ssh-command
```json
{
  "host": "209.38.85.244",
  "command": "systemctl restart doewah-ws"
}
```

## Implementation Tasks

### Backend (ORCHON)
1. Add database migrations for new tables
2. Create `/api/admin/actions` CRUD endpoints
3. Create `/api/admin/actions/:id/execute` endpoint
4. Implement action executors for each type:
   - `FlyExecutor` - calls Fly.io API
   - `GitHubWorkflowExecutor` - triggers GHA
   - `GCPExecutor` - calls Cloud Run API
   - `SSHExecutor` - runs remote commands

### Frontend (ORCHON Web)
1. Create `/admin/infra/+page.svelte`
2. Health dashboard component (uses existing `/health` endpoint)
3. Actions list with execute buttons
4. Action configuration modal (add/edit actions)
5. Execution log with live updates

### Security
- All endpoints require admin auth
- SSH keys stored as Fly.io secrets (not in DB)
- Execution outputs sanitized before display

## Future: Auto-Healing

Once manual actions work, add:
- Health check thresholds ("if DB unhealthy for 60s, auto-restart")
- Notification before/after auto-actions
- Cooldown periods to prevent restart loops
