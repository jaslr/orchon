// @ts-nocheck
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

const API_URL = env.ORCHON_API_URL || 'https://observatory-backend.fly.dev';
const API_SECRET = env.ORCHON_API_SECRET || '';

interface InfraHealth {
  database: {
    connected: boolean;
    message?: string;
  };
  services: Array<{
    id: string;
    projectId: string;
    projectName: string;
    provider: string;
    category: string;
    status: string;
    lastChecked: string | null;
  }>;
}

interface RecoveryAction {
  id: string;
  serviceId: string;
  name: string;
  actionType: string;
  config: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

interface ActionExecution {
  id: string;
  actionId: string;
  actionName: string;
  serviceId: string;
  triggeredBy: string;
  status: string;
  output?: string;
  startedAt: string;
  completedAt?: string;
}

export const load = async ({ fetch }: Parameters<PageServerLoad>[0]) => {
  const headers = {
    Authorization: `Bearer ${API_SECRET}`,
  };

  try {
    const [healthRes, actionsRes, executionsRes] = await Promise.all([
      fetch(`${API_URL}/admin/infra/health`, { headers }),
      fetch(`${API_URL}/admin/actions`, { headers }),
      fetch(`${API_URL}/admin/executions?limit=20`, { headers }),
    ]);

    const health: InfraHealth = healthRes.ok
      ? await healthRes.json()
      : { database: { connected: false }, services: [] };

    const actionsData = actionsRes.ok ? await actionsRes.json() : { actions: [] };
    const executionsData = executionsRes.ok ? await executionsRes.json() : { executions: [] };

    return {
      health,
      actions: actionsData.actions as RecoveryAction[],
      executions: executionsData.executions as ActionExecution[],
    };
  } catch (err) {
    console.error('Failed to load infra data:', err);
    return {
      health: { database: { connected: false }, services: [] },
      actions: [],
      executions: [],
      error: 'Failed to load infrastructure data',
    };
  }
};

export const actions = {
  execute: async ({ request, fetch }) => {
    const formData = await request.formData();
    const actionId = formData.get('actionId') as string;

    if (!actionId) {
      return { success: false, error: 'Missing action ID' };
    }

    try {
      const response = await fetch(`${API_URL}/admin/actions/${actionId}/execute`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_SECRET}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        return { success: false, error: data.error || 'Failed to execute action' };
      }

      const data = await response.json();
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, error: 'Network error' };
    }
  },

  createAction: async ({ request, fetch }) => {
    const formData = await request.formData();
    const serviceId = formData.get('serviceId') as string;
    const name = formData.get('name') as string;
    const actionType = formData.get('actionType') as string;
    const configStr = formData.get('config') as string;

    let config = {};
    try {
      config = JSON.parse(configStr || '{}');
    } catch {
      return { success: false, error: 'Invalid config JSON' };
    }

    try {
      const response = await fetch(`${API_URL}/admin/actions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_SECRET}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ serviceId, name, actionType, config }),
      });

      if (!response.ok) {
        const data = await response.json();
        return { success: false, error: data.error || 'Failed to create action' };
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: 'Network error' };
    }
  },

  deleteAction: async ({ request, fetch }) => {
    const formData = await request.formData();
    const actionId = formData.get('actionId') as string;

    try {
      const response = await fetch(`${API_URL}/admin/actions/${actionId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${API_SECRET}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        return { success: false, error: data.error || 'Failed to delete action' };
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: 'Network error' };
    }
  },
};
