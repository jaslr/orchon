import { Hono } from 'hono';
import * as db from '../db/queries.js';
import { getDbStatus } from '../db/client.js';
import { executeAction } from '../services/executors/index.js';

export const adminRoutes = new Hono();

// =============================================================================
// Infrastructure Health
// =============================================================================

adminRoutes.get('/infra/health', async (c) => {
  try {
    const dbStatus = await getDbStatus();

    // Get all services with their latest status
    const [projects, statuses] = await Promise.all([
      db.getAllProjects(),
      db.getLatestStatusForAllProjects(),
    ]);

    const services = await Promise.all(
      projects.map(async (project) => {
        const projectServices = await db.getServicesByProject(project.id);
        const projectStatus = statuses.find((s) => s.projectId === project.id);

        return projectServices.map((svc) => ({
          id: svc.id,
          projectId: project.id,
          projectName: project.displayName,
          provider: svc.provider,
          category: svc.category,
          status: projectStatus?.status || 'unknown',
          lastChecked: projectStatus?.checkedAt || null,
        }));
      })
    );

    return c.json({
      database: dbStatus,
      services: services.flat(),
    });
  } catch (err) {
    console.error('Error fetching infra health:', err);
    return c.json({ error: 'Failed to fetch infrastructure health' }, 500);
  }
});

// =============================================================================
// Recovery Actions CRUD
// =============================================================================

// List all recovery actions
adminRoutes.get('/actions', async (c) => {
  try {
    const actions = await db.getAllRecoveryActions();
    return c.json({ actions });
  } catch (err) {
    console.error('Error fetching recovery actions:', err);
    return c.json({ error: 'Failed to fetch recovery actions' }, 500);
  }
});

// Get actions for a specific service
adminRoutes.get('/actions/service/:serviceId', async (c) => {
  const serviceId = c.req.param('serviceId');
  try {
    const actions = await db.getRecoveryActionsByService(serviceId);
    return c.json({ actions });
  } catch (err) {
    console.error(`Error fetching actions for service ${serviceId}:`, err);
    return c.json({ error: 'Failed to fetch actions' }, 500);
  }
});

// Create a new recovery action
adminRoutes.post('/actions', async (c) => {
  try {
    const body = await c.req.json();
    const { serviceId, name, actionType, config } = body;

    if (!serviceId || !name || !actionType) {
      return c.json({ error: 'Missing required fields: serviceId, name, actionType' }, 400);
    }

    const validTypes = ['fly-api', 'github-workflow', 'gcp-api', 'ssh-command'];
    if (!validTypes.includes(actionType)) {
      return c.json({ error: `Invalid actionType. Must be one of: ${validTypes.join(', ')}` }, 400);
    }

    const action = await db.createRecoveryAction({
      serviceId,
      name,
      actionType,
      config: config || {},
    });

    return c.json({ action }, 201);
  } catch (err) {
    console.error('Error creating recovery action:', err);
    return c.json({ error: 'Failed to create recovery action' }, 500);
  }
});

// Update a recovery action
adminRoutes.put('/actions/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    const { name, actionType, config } = body;

    const action = await db.updateRecoveryAction(id, { name, actionType, config });
    if (!action) {
      return c.json({ error: 'Action not found' }, 404);
    }

    return c.json({ action });
  } catch (err) {
    console.error(`Error updating action ${id}:`, err);
    return c.json({ error: 'Failed to update action' }, 500);
  }
});

// Delete a recovery action
adminRoutes.delete('/actions/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const deleted = await db.deleteRecoveryAction(id);
    if (!deleted) {
      return c.json({ error: 'Action not found' }, 404);
    }
    return c.json({ success: true });
  } catch (err) {
    console.error(`Error deleting action ${id}:`, err);
    return c.json({ error: 'Failed to delete action' }, 500);
  }
});

// =============================================================================
// Execute Actions
// =============================================================================

// Execute a recovery action
adminRoutes.post('/actions/:id/execute', async (c) => {
  const id = c.req.param('id');

  try {
    // Get the action
    const action = await db.getRecoveryActionById(id);
    if (!action) {
      return c.json({ error: 'Action not found' }, 404);
    }

    // Create execution record
    const execution = await db.createActionExecution({
      actionId: id,
      triggeredBy: 'manual',
    });

    // Execute the action asynchronously
    executeAction(action, execution.id).catch((err) => {
      console.error(`Action execution failed for ${id}:`, err);
    });

    return c.json({
      execution,
      message: `Action "${action.name}" started`,
    });
  } catch (err) {
    console.error(`Error executing action ${id}:`, err);
    return c.json({ error: 'Failed to execute action' }, 500);
  }
});

// Get recent executions
adminRoutes.get('/executions', async (c) => {
  const limit = parseInt(c.req.query('limit') || '20', 10);
  try {
    const executions = await db.getRecentExecutions(limit);
    return c.json({ executions });
  } catch (err) {
    console.error('Error fetching executions:', err);
    return c.json({ error: 'Failed to fetch executions' }, 500);
  }
});
