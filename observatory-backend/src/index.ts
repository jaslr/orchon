import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import { env, validateEnv } from './config/env.js';
import { healthRoutes } from './routes/health.js';
import { webhookRoutes } from './routes/webhooks.js';
import { eventsRoutes } from './routes/events.js';
import { apiRoutes } from './routes/api.js';
import { startScheduler } from './jobs/scheduler.js';
import { initDb } from './db/client.js';

// Validate environment
validateEnv();

// Create Hono app
const app = new Hono();

// Middleware
app.use('*', logger());
app.use(
  '*',
  cors({
    origin: ['https://ci-monitor.pages.dev', 'http://localhost:4573', 'http://localhost:5173'],
    credentials: true,
  })
);

// Routes
app.route('/health', healthRoutes);
app.route('/webhooks', webhookRoutes);
app.route('/events', eventsRoutes);
app.route('/api', apiRoutes);

// Root
app.get('/', (c) => {
  return c.json({
    name: 'observatory-backend',
    version: '0.1.0',
    status: 'running',
  });
});

// Start server
async function main() {
  // Initialize database
  await initDb();

  // Start background jobs
  startScheduler();

  // Start HTTP server
  console.log(`Starting observatory-backend on port ${env.port}...`);
  serve({
    fetch: app.fetch,
    port: env.port,
  });
  console.log(`Server running at http://localhost:${env.port}`);
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
