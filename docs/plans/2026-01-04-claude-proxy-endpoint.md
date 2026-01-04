# Claude Proxy Endpoint Design

## Overview

A droplet endpoint that accepts URLs + tasks, triggers Claude Code to scrape/analyze, and returns structured data to calling apps.

## Requirements

- **Response mode**: Sync for quick tasks (<30s), auto-switch to async with job polling
- **Scraping**: Chrome DevTools MCP first, WebFetch fallback if fails
- **Tasks**: Predefined templates + freeform prompts
- **Auth**: Shared ORCHON secret (OBSERVATORY_API_SECRET)
- **Response**: Caller defines output schema, default JSON

## API Design

### POST /proxy/crawl

**Request:**
```json
{
  "url": "https://example.com/product/123",
  "task": "extract_product" | "custom",
  "prompt": "Extract product specs...",  // for custom task
  "output_schema": { ... },              // optional JSON schema
  "timeout": 60000,                       // optional, default 60s
  "callback_url": "https://app.com/webhook"  // optional async callback
}
```

**Sync Response (< 30s):**
```json
{
  "status": "completed",
  "data": { ... extracted data ... },
  "metadata": {
    "duration_ms": 12500,
    "tool_used": "chrome-devtools",
    "url_final": "https://...",
    "timestamp": "2026-01-04T..."
  }
}
```

**Async Response (> 30s or callback_url provided):**
```json
{
  "status": "processing",
  "job_id": "abc123",
  "poll_url": "/proxy/jobs/abc123"
}
```

### GET /proxy/jobs/:id

Returns job status and result when complete.

## Task Templates

1. `extract_product` - Generic product extraction
2. `extract_flashlight` - LLOL-specific flashlight specs
3. `extract_links` - Get all links from page
4. `screenshot` - Take screenshot
5. `custom` - Freeform prompt

## Implementation

### Files to Create

1. `droplet/ws/proxy.js` - New HTTP server on port 8407
2. `droplet/proxy/tasks.js` - Task templates
3. `droplet/proxy/executor.js` - Claude execution with MCP fallback
4. `droplet/systemd/orchon-proxy.service` - Systemd service

### Flow

```
Request → Auth check → Parse task/schema
    ↓
Chrome DevTools MCP attempt
    ↓ (if fails)
WebFetch fallback
    ↓
Claude processes with prompt + scraped content
    ↓
Format response per schema
    ↓
Return sync OR create job + return job_id
```

## Port Allocation

- 8405: WebSocket server (existing)
- 8406: Update server (existing)
- 8407: Proxy server (new)
