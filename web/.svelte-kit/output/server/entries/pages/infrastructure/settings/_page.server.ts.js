import { G as GCP_PROJECTS } from "../../../../chunks/infrastructure.js";
const load = async () => {
  const projectsByType = /* @__PURE__ */ new Map();
  for (const project of GCP_PROJECTS) {
    const type = project.type || "other";
    if (!projectsByType.has(type)) {
      projectsByType.set(type, []);
    }
    projectsByType.get(type).push(project);
  }
  const groupedProjects = Array.from(projectsByType.entries()).map(([type, projects]) => ({
    type,
    displayType: getTypeDisplayName(type),
    projects: projects.sort((a, b) => a.displayName.localeCompare(b.displayName))
  })).sort((a, b) => getTypeOrder(a.type) - getTypeOrder(b.type));
  return {
    projects: GCP_PROJECTS,
    groupedProjects,
    stats: {
      total: GCP_PROJECTS.length,
      enabled: GCP_PROJECTS.filter((p) => p.enabled).length,
      campuses: GCP_PROJECTS.filter((p) => p.type === "campus").length,
      orgPortals: GCP_PROJECTS.filter((p) => p.type === "org-portal").length,
      testing: GCP_PROJECTS.filter((p) => p.type === "testing").length,
      infrastructure: GCP_PROJECTS.filter((p) => p.type === "infrastructure").length,
      other: GCP_PROJECTS.filter((p) => p.type === "other" || !p.type).length
    }
  };
};
function getTypeDisplayName(type) {
  const names = {
    "campus": "Production Campuses",
    "org-portal": "Organisation Portals",
    "testing": "Testing & Staging",
    "infrastructure": "Infrastructure",
    "other": "Old / Deprecated"
  };
  return names[type] || type;
}
function getTypeOrder(type) {
  const order = {
    "campus": 1,
    "org-portal": 2,
    "testing": 3,
    "infrastructure": 4,
    "other": 5
  };
  return order[type] || 99;
}
const actions = {
  // Toggle a project's enabled state
  toggle: async ({ request }) => {
    const formData = await request.formData();
    const projectId = formData.get("projectId");
    const enabled = formData.get("enabled") === "true";
    return { success: true, projectId, enabled };
  }
};
export {
  actions,
  load
};
