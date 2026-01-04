#!/usr/bin/env node
/**
 * ORCHON Proxy Server
 *
 * HTTP API for triggering Claude Code with MCP tools to scrape/analyze URLs
 *
 * Port: 8407
 */

const http = require('http');
const url = require('url');
const https = require('https');

const { execute, shouldUseAsync, SYNC_THRESHOLD, DEFAULT_TIMEOUT } = require('./executor');
const { listTasks } = require('./tasks');
const {
  createJob,
  getJob,
  startJob,
  completeJob,
  failJob,
  addJobProgress,
  listJobs
} = require('./jobs');

// Configuration
const PORT = process.env.PROXY_PORT || 8407;
const API_SECRET = process.env.OBSERVATORY_API_SECRET || process.env.API_SECRET;

if (!API_SECRET) {
  console.error('WARNING: No API_SECRET configured. Set OBSERVATORY_API_SECRET in .env');
}

/**
 * Check authentication
 */
function checkAuth(req) {
  // Check header
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    if (token === API_SECRET) return true;
  }

  // Check query param
  const parsedUrl = url.parse(req.url, true);
  if (parsedUrl.query.token === API_SECRET) return true;

  return false;
}

/**
 * Send JSON response
 */
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data, null, 2));
}

/**
 * Send error response
 */
function sendError(res, statusCode, message) {
  sendJson(res, statusCode, { error: message });
}

/**
 * Parse JSON body
 */
async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

/**
 * POST callback to URL
 */
function postCallback(callbackUrl, data) {
  return new Promise((resolve, reject) => {
    const parsed = url.parse(callbackUrl);
    const options = {
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
      path: parsed.path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const lib = parsed.protocol === 'https:' ? https : http;
    const req = lib.request(options, (res) => {
      resolve({ statusCode: res.statusCode });
    });

    req.on('error', reject);
    req.write(JSON.stringify(data));
    req.end();
  });
}

/**
 * Handle POST /proxy/crawl
 */
async function handleCrawl(req, res) {
  try {
    const body = await parseBody(req);

    // Validate required fields
    if (!body.url) {
      return sendError(res, 400, 'Missing required field: url');
    }

    const {
      url: targetUrl,
      task = 'extract_product',
      prompt,
      output_schema,
      timeout = DEFAULT_TIMEOUT,
      callback_url
    } = body;

    // Determine if we should use async mode
    const useAsync = callback_url || shouldUseAsync(timeout);

    if (useAsync) {
      // Async mode: create job and return immediately
      const job = createJob(body);
      startJob(job.id);

      // Start execution in background
      setImmediate(async () => {
        try {
          const result = await execute({
            url: targetUrl,
            task,
            prompt,
            output_schema,
            timeout,
            onProgress: (progress) => addJobProgress(job.id, progress)
          });

          completeJob(job.id, result);

          // Send callback if configured
          if (callback_url) {
            try {
              await postCallback(callback_url, {
                job_id: job.id,
                ...result
              });
            } catch (e) {
              console.error(`Callback failed for job ${job.id}:`, e.message);
            }
          }
        } catch (error) {
          failJob(job.id, error.message);

          if (callback_url) {
            try {
              await postCallback(callback_url, {
                job_id: job.id,
                status: 'failed',
                error: error.message
              });
            } catch (e) {
              console.error(`Callback failed for job ${job.id}:`, e.message);
            }
          }
        }
      });

      // Return job info
      return sendJson(res, 202, {
        status: 'processing',
        job_id: job.id,
        poll_url: `/proxy/jobs/${job.id}`,
        message: callback_url
          ? 'Results will be POSTed to callback URL'
          : `Poll ${`/proxy/jobs/${job.id}`} for results`
      });
    } else {
      // Sync mode: wait for result
      const result = await execute({
        url: targetUrl,
        task,
        prompt,
        output_schema,
        timeout
      });

      return sendJson(res, 200, result);
    }
  } catch (error) {
    console.error('Crawl error:', error);
    return sendError(res, 500, error.message);
  }
}

/**
 * Handle GET /proxy/jobs/:id
 */
async function handleGetJob(req, res, jobId) {
  const job = getJob(jobId);

  if (!job) {
    return sendError(res, 404, `Job not found: ${jobId}`);
  }

  // If completed or failed, return full result
  if (job.status === 'completed') {
    return sendJson(res, 200, {
      status: 'completed',
      job_id: job.id,
      ...job.result,
      progress: job.progress
    });
  }

  if (job.status === 'failed') {
    return sendJson(res, 200, {
      status: 'failed',
      job_id: job.id,
      error: job.error,
      progress: job.progress
    });
  }

  // Still processing
  return sendJson(res, 200, {
    status: job.status,
    job_id: job.id,
    progress: job.progress,
    created_at: job.created_at,
    updated_at: job.updated_at
  });
}

/**
 * Handle GET /proxy/tasks
 */
async function handleListTasks(req, res) {
  return sendJson(res, 200, {
    tasks: listTasks()
  });
}

/**
 * Handle GET /proxy/jobs (list recent jobs)
 */
async function handleListJobs(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const limit = parseInt(parsedUrl.query.limit) || 20;

  return sendJson(res, 200, {
    jobs: listJobs(limit)
  });
}

/**
 * Main request handler
 */
async function handleRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  // Health check (no auth)
  if (pathname === '/health' || pathname === '/proxy/health') {
    return sendJson(res, 200, { status: 'ok', service: 'orchon-proxy' });
  }

  // Auth required for all other endpoints
  if (!checkAuth(req)) {
    return sendError(res, 401, 'Unauthorized - token required');
  }

  // Route handling
  try {
    // POST /proxy/crawl
    if (pathname === '/proxy/crawl' && req.method === 'POST') {
      return await handleCrawl(req, res);
    }

    // GET /proxy/tasks
    if (pathname === '/proxy/tasks' && req.method === 'GET') {
      return await handleListTasks(req, res);
    }

    // GET /proxy/jobs
    if (pathname === '/proxy/jobs' && req.method === 'GET') {
      return await handleListJobs(req, res);
    }

    // GET /proxy/jobs/:id
    const jobMatch = pathname.match(/^\/proxy\/jobs\/([a-f0-9]+)$/);
    if (jobMatch && req.method === 'GET') {
      return await handleGetJob(req, res, jobMatch[1]);
    }

    // 404
    return sendError(res, 404, `Not found: ${pathname}`);
  } catch (error) {
    console.error('Request error:', error);
    return sendError(res, 500, error.message);
  }
}

/**
 * Start server
 */
const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`ORCHON Proxy Server running on port ${PORT}`);
  console.log(`Endpoints:`);
  console.log(`  POST /proxy/crawl     - Execute crawl task`);
  console.log(`  GET  /proxy/tasks     - List available tasks`);
  console.log(`  GET  /proxy/jobs      - List recent jobs`);
  console.log(`  GET  /proxy/jobs/:id  - Get job status/result`);
  console.log(`  GET  /health          - Health check`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down proxy server...');
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Shutting down proxy server...');
  server.close(() => {
    process.exit(0);
  });
});
