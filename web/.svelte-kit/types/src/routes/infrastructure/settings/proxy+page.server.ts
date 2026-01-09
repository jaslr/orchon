// @ts-nocheck
import type { PageServerLoad, Actions } from './$types';
import { GCP_PROJECTS, type GcpProject } from '$lib/config/infrastructure';

export const load = async () => {
  // Group projects by type
  const projectsByType = new Map<string, GcpProject[]>();

  for (const project of GCP_PROJECTS) {
    const type = project.type || 'other';
    if (!projectsByType.has(type)) {
      projectsByType.set(type, []);
    }
    projectsByType.get(type)!.push(project);
  }

  // Convert to array format for easier rendering
  const groupedProjects = Array.from(projectsByType.entries())
    .map(([type, projects]) => ({
      type,
      displayType: getTypeDisplayName(type),
      projects: projects.sort((a, b) => a.displayName.localeCompare(b.displayName)),
    }))
    .sort((a, b) => getTypeOrder(a.type) - getTypeOrder(b.type));

  return {
    projects: GCP_PROJECTS,
    groupedProjects,
    stats: {
      total: GCP_PROJECTS.length,
      enabled: GCP_PROJECTS.filter(p => p.enabled).length,
      campuses: GCP_PROJECTS.filter(p => p.type === 'campus').length,
      orgPortals: GCP_PROJECTS.filter(p => p.type === 'org-portal').length,
      testing: GCP_PROJECTS.filter(p => p.type === 'testing').length,
      infrastructure: GCP_PROJECTS.filter(p => p.type === 'infrastructure').length,
      other: GCP_PROJECTS.filter(p => p.type === 'other' || !p.type).length,
    },
  };
};

function getTypeDisplayName(type: string): string {
  const names: Record<string, string> = {
    'campus': 'Production Campuses',
    'org-portal': 'Organisation Portals',
    'testing': 'Testing & Staging',
    'infrastructure': 'Infrastructure',
    'other': 'Old / Deprecated',
  };
  return names[type] || type;
}

function getTypeOrder(type: string): number {
  const order: Record<string, number> = {
    'campus': 1,
    'org-portal': 2,
    'testing': 3,
    'infrastructure': 4,
    'other': 5,
  };
  return order[type] || 99;
}

export const actions = {
  // Toggle a project's enabled state
  toggle: async ({ request }: import('./$types').RequestEvent) => {
    const formData = await request.formData();
    const projectId = formData.get('projectId') as string;
    const enabled = formData.get('enabled') === 'true';

    // For now, return the toggle state - actual persistence would need backend
    return { success: true, projectId, enabled };
  },
};
;null as any as PageServerLoad;;null as any as Actions;