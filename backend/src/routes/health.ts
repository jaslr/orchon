import { Hono } from 'hono';
import { getDbStatus } from '../db/client.js';
import {
  getEcosystemStatus,
  refreshEcosystemStatus,
} from '../services/ecosystem-health/index.js';

export const healthRoutes = new Hono();

// Basic health check
healthRoutes.get('/', async (c) => {
  const dbStatus = await getDbStatus();

  return c.json({
    status: dbStatus.connected ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    checks: {
      database: dbStatus,
    },
  });
});

// Ecosystem health check - returns all nodes and edges with status
healthRoutes.get('/ecosystem', async (c) => {
  const forceRefresh = c.req.query('refresh') === 'true';

  const status = forceRefresh
    ? await refreshEcosystemStatus()
    : await getEcosystemStatus();

  // Set cache header
  c.header('Cache-Control', 'max-age=30');

  return c.json(status);
});
