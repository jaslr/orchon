import { b as private_env } from "../../../../chunks/shared-server.js";
const API_URL = private_env.ORCHON_API_URL || "https://observatory-backend.fly.dev";
const API_SECRET = private_env.ORCHON_API_SECRET || "";
const load = async ({ fetch }) => {
  const headers = {
    Authorization: `Bearer ${API_SECRET}`
  };
  try {
    const [healthRes, actionsRes, executionsRes] = await Promise.all([
      fetch(`${API_URL}/admin/infra/health`, { headers }),
      fetch(`${API_URL}/admin/actions`, { headers }),
      fetch(`${API_URL}/admin/executions?limit=20`, { headers })
    ]);
    const health = healthRes.ok ? await healthRes.json() : { database: { connected: false }, services: [] };
    const actionsData = actionsRes.ok ? await actionsRes.json() : { actions: [] };
    const executionsData = executionsRes.ok ? await executionsRes.json() : { executions: [] };
    return {
      health,
      actions: actionsData.actions,
      executions: executionsData.executions
    };
  } catch (err) {
    console.error("Failed to load infra data:", err);
    return {
      health: { database: { connected: false }, services: [] },
      actions: [],
      executions: [],
      error: "Failed to load infrastructure data"
    };
  }
};
const actions = {
  execute: async ({ request, fetch }) => {
    const formData = await request.formData();
    const actionId = formData.get("actionId");
    if (!actionId) {
      return { success: false, error: "Missing action ID" };
    }
    try {
      const response = await fetch(`${API_URL}/admin/actions/${actionId}/execute`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_SECRET}`
        }
      });
      if (!response.ok) {
        const data2 = await response.json();
        return { success: false, error: data2.error || "Failed to execute action" };
      }
      const data = await response.json();
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, error: "Network error" };
    }
  },
  createAction: async ({ request, fetch }) => {
    const formData = await request.formData();
    const serviceId = formData.get("serviceId");
    const name = formData.get("name");
    const actionType = formData.get("actionType");
    const configStr = formData.get("config");
    let config = {};
    try {
      config = JSON.parse(configStr || "{}");
    } catch {
      return { success: false, error: "Invalid config JSON" };
    }
    try {
      const response = await fetch(`${API_URL}/admin/actions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_SECRET}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ serviceId, name, actionType, config })
      });
      if (!response.ok) {
        const data = await response.json();
        return { success: false, error: data.error || "Failed to create action" };
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: "Network error" };
    }
  },
  deleteAction: async ({ request, fetch }) => {
    const formData = await request.formData();
    const actionId = formData.get("actionId");
    try {
      const response = await fetch(`${API_URL}/admin/actions/${actionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${API_SECRET}`
        }
      });
      if (!response.ok) {
        const data = await response.json();
        return { success: false, error: data.error || "Failed to delete action" };
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: "Network error" };
    }
  }
};
export {
  actions,
  load
};
