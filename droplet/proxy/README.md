# ORCHON Proxy Server

AI-powered web scraping service using Claude Code with MCP tools. Primary use case: extracting flashlight specifications for [Little List of Lights](https://github.com/jaslr/littlelistoflights).

## Location on Droplet

| Item | Path |
|------|------|
| Service files | `/root/orchon/droplet/proxy/` |
| Systemd unit | `/etc/systemd/system/orchon-proxy.service` |
| Environment | `/root/orchon/.env` (sources `OBSERVATORY_API_SECRET`) |
| Logs | `journalctl -u orchon-proxy` |

## Service Details

**Service name:** `orchon-proxy`
**Port:** 8407
**User:** root
**Working directory:** `/root/orchon/droplet/proxy`

## Public Access

| URL | Target |
|-----|--------|
| `https://proxy.littlelistoflights.com` | Cloudflare Tunnel → `localhost:8407` |
| `http://209.38.85.244:8407` | Direct (internal only) |

The Cloudflare Tunnel is managed via `cloudflared` service on the droplet.

## Configuration

Environment variables (from `/root/orchon/.env`):

| Variable | Purpose |
|----------|---------|
| `OBSERVATORY_API_SECRET` | Bearer token for API authentication |
| `PROXY_PORT` | Port to listen on (default: 8407) |
| `ANTHROPIC_API_KEY` | Claude API key (used by executor) |

## API Endpoints

All endpoints (except health) require `Authorization: Bearer <token>`.

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/health` | Health check (no auth) |
| POST | `/proxy/crawl` | Start extraction job |
| GET | `/proxy/jobs` | List recent jobs |
| GET | `/proxy/jobs/:id` | Get job status/result/progress |
| GET | `/proxy/tasks` | List available task templates |

### POST /proxy/crawl

```json
{
  "url": "https://example.com/product",
  "task": "extract_flashlight",
  "timeout": 120000
}
```

Returns job ID for polling:
```json
{
  "status": "processing",
  "job_id": "abc123",
  "poll_url": "/proxy/jobs/abc123"
}
```

## Files

| File | Purpose |
|------|---------|
| `server.js` | HTTP server, routing, job management |
| `executor.js` | Claude Code execution with MCP tools |
| `jobs.js` | In-memory job storage with progress tracking |
| `tasks.js` | Extraction prompt templates |

## Service Management

```bash
# Check status
systemctl status orchon-proxy

# View logs (live)
journalctl -u orchon-proxy -f

# View recent logs
journalctl -u orchon-proxy -n 100

# Restart service
systemctl restart orchon-proxy

# Stop service
systemctl stop orchon-proxy

# Start service
systemctl start orchon-proxy
```

## Cloudflare Tunnel

The tunnel is configured via `cloudflared`:

```bash
# Check tunnel status
systemctl status cloudflared

# View tunnel config
cat /root/.cloudflared/config.yml
```

Tunnel routes `proxy.littlelistoflights.com` to `http://localhost:8407`.

## Deploying Updates

From dev machine:
```bash
cd /home/chip/orchon
git push origin main
ssh root@209.38.85.244 "cd /root/orchon && git pull && systemctl restart orchon-proxy"
```

Or use the deploy script:
```bash
npm run deploy:droplet
```

## Testing

```bash
# Health check
curl https://proxy.littlelistoflights.com/health

# List tasks (requires token)
curl -H "Authorization: Bearer $TOKEN" https://proxy.littlelistoflights.com/proxy/tasks

# Start extraction
curl -X POST https://proxy.littlelistoflights.com/proxy/crawl \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://fenixlighting.com/products/fenix-pd36r-pro", "task": "extract_flashlight"}'
```

## Related

- **Frontend UI:** [LLOL /admin/flashlights/proxyadd](https://github.com/jaslr/littlelistoflights/tree/master/src/routes/admin/flashlights/proxyadd)
- **Parent docs:** [ORCHON CLAUDE.md](../../CLAUDE.md)
