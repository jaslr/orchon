import type { PageServerLoad } from './$types';
import {
  INFRASTRUCTURE,
  getSourceReposWithInstances,
  getOrganisations,
  type SourceRepoWithInstances,
  type Organisation
} from '$lib/config/infrastructure';

export interface ProjectNode {
  id: string;
  displayName: string;
  identity: string;
  productionUrl?: string;
  sourceRepo?: string;  // If this is an instance, which repo it comes from
  isSourceRepo?: boolean;  // If this is a source repo
  services: {
    category: string;
    provider: string;
    serviceName: string;
    dashboardUrl?: string;
  }[];
}

export const load: PageServerLoad = async () => {
  // Convert infrastructure to sorted project nodes
  const projects: ProjectNode[] = Object.entries(INFRASTRUCTURE)
    .map(([id, infra]) => ({
      id,
      displayName: infra.displayName,
      identity: infra.identity,
      productionUrl: infra.productionUrl,
      sourceRepo: infra.sourceRepo,
      isSourceRepo: infra.isSourceRepo,
      services: infra.services.map(s => ({
        category: s.category,
        provider: s.provider,
        serviceName: s.serviceName,
        dashboardUrl: s.dashboardUrl,
      })),
    }))
    .sort((a, b) => a.displayName.localeCompare(b.displayName));

  // Get hierarchical structure for source repos and their instances
  const sourceRepos: SourceRepoWithInstances[] = getSourceReposWithInstances();

  // Get organisations for ownership view
  const organisations: Organisation[] = getOrganisations();

  return { projects, sourceRepos, organisations };
};
