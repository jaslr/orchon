// @ts-nocheck
import type { PageServerLoad } from './$types';
import { INFRASTRUCTURE } from '$lib/config/infrastructure';

export interface ProjectNode {
  id: string;
  displayName: string;
  identity: string;
  productionUrl?: string;
  services: {
    category: string;
    provider: string;
    serviceName: string;
    dashboardUrl?: string;
  }[];
}

export const load = async () => {
  // Convert infrastructure to sorted project nodes
  const projects: ProjectNode[] = Object.entries(INFRASTRUCTURE)
    .map(([id, infra]) => ({
      id,
      displayName: infra.displayName,
      identity: infra.identity,
      productionUrl: infra.productionUrl,
      services: infra.services.map(s => ({
        category: s.category,
        provider: s.provider,
        serviceName: s.serviceName,
        dashboardUrl: s.dashboardUrl,
      })),
    }))
    .sort((a, b) => a.displayName.localeCompare(b.displayName));

  return { projects };
};
;null as any as PageServerLoad;