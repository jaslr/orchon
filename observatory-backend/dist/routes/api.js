import { Hono } from 'hono';
import { projects } from '../config/projects.js';
import * as db from '../db/queries.js';
export const apiRoutes = new Hono();
// List all projects with current status
apiRoutes.get('/projects', async (c) => {
    try {
        const statuses = await db.getLatestStatusForAllProjects();
        const projectsWithStatus = projects.map((project) => ({
            ...project,
            currentStatus: statuses.find((s) => s.projectId === project.id) || null,
        }));
        return c.json({ projects: projectsWithStatus });
    }
    catch (err) {
        console.error('Error fetching projects:', err);
        return c.json({ error: 'Failed to fetch projects' }, 500);
    }
});
// Get single project details
apiRoutes.get('/projects/:id', async (c) => {
    const projectId = c.req.param('id');
    const project = projects.find((p) => p.id === projectId);
    if (!project) {
        return c.json({ error: 'Project not found' }, 404);
    }
    try {
        const [status, recentDeployments, uptimeHistory] = await Promise.all([
            db.getLatestStatus(projectId),
            db.getRecentDeployments(projectId, 10),
            db.getUptimeHistory(projectId, 24), // Last 24 hours
        ]);
        return c.json({
            project,
            status,
            recentDeployments,
            uptimeHistory,
        });
    }
    catch (err) {
        console.error(`Error fetching project ${projectId}:`, err);
        return c.json({ error: 'Failed to fetch project' }, 500);
    }
});
// Trigger manual status check for a project
apiRoutes.post('/projects/:id/check', async (c) => {
    const projectId = c.req.param('id');
    const project = projects.find((p) => p.id === projectId);
    if (!project) {
        return c.json({ error: 'Project not found' }, 404);
    }
    // TODO: Trigger immediate checks for all services
    return c.json({ message: 'Check triggered', projectId });
});
// Get status history for a project
apiRoutes.get('/projects/:id/history', async (c) => {
    const projectId = c.req.param('id');
    const hours = parseInt(c.req.query('hours') || '24', 10);
    try {
        const history = await db.getStatusHistory(projectId, hours);
        return c.json({ history });
    }
    catch (err) {
        console.error(`Error fetching history for ${projectId}:`, err);
        return c.json({ error: 'Failed to fetch history' }, 500);
    }
});
// Cost tracking endpoints
apiRoutes.get('/costs', async (c) => {
    try {
        const costs = await db.getAllCosts();
        return c.json({ costs });
    }
    catch (err) {
        console.error('Error fetching costs:', err);
        return c.json({ error: 'Failed to fetch costs' }, 500);
    }
});
apiRoutes.post('/costs', async (c) => {
    try {
        const body = await c.req.json();
        const { projectId, month, amountCents, provider, notes } = body;
        if (!projectId || !month || amountCents === undefined || !provider) {
            return c.json({ error: 'Missing required fields' }, 400);
        }
        const cost = await db.insertCost({ projectId, month, amountCents, provider, notes });
        return c.json({ cost }, 201);
    }
    catch (err) {
        console.error('Error creating cost entry:', err);
        return c.json({ error: 'Failed to create cost entry' }, 500);
    }
});
//# sourceMappingURL=api.js.map