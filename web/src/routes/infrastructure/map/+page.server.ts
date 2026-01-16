import type { PageServerLoad } from './$types';
import {
  INFRASTRUCTURE,
  getSourceReposWithInstances,
  getClients,
  getGcpProject,
  type SourceRepoWithInstances,
  type Client
} from '$lib/config/infrastructure';

export interface PackageInfo {
  name: string;
  version: string;
  description: string;
  dependencyCount: number;
  devDependencyCount: number;
  keyPackages: string[];
}

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

// Resolved client with full GCP project details
export interface ResolvedClient {
  id: string;
  displayName: string;
  marketingUrl?: string;
  orgPortal?: {
    gcpProject: string;
    displayName: string;
    customDomain?: string;  // e.g., busyschools.junipa.com.au
    productionUrl?: string;  // https://busyschools.junipa.com.au
  };
  campuses: {
    id: string;
    displayName: string;
    gcpProject: string;
    customDomain?: string;
    productionUrl?: string;
  }[];
}

// Declare the Vite-injected package info
declare const __PACKAGE_INFO__: PackageInfo;

export const load: PageServerLoad = async () => {
  // Package info injected at build time via vite.config.ts
  const packageInfo: PackageInfo = __PACKAGE_INFO__;

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

  // Get clients with resolved GCP project details
  const clients: ResolvedClient[] = getClients().map((client: Client) => {
    // Resolve org portal GCP project
    let orgPortal: ResolvedClient['orgPortal'] = undefined;
    if (client.orgPortal) {
      const gcpProject = getGcpProject(client.orgPortal.gcpProject);
      orgPortal = {
        gcpProject: client.orgPortal.gcpProject,
        displayName: gcpProject?.displayName || client.orgPortal.gcpProject,
        customDomain: gcpProject?.customDomain,
        productionUrl: gcpProject?.customDomain ? `https://${gcpProject.customDomain}` : undefined,
      };
    }

    // Resolve campus GCP projects
    const campuses = client.campuses.map(campus => {
      const gcpProject = getGcpProject(campus.gcpProject);
      return {
        id: campus.id,
        displayName: campus.displayName,
        gcpProject: campus.gcpProject,
        customDomain: gcpProject?.customDomain,
        productionUrl: gcpProject?.customDomain ? `https://${gcpProject.customDomain}` : undefined,
      };
    });

    return {
      id: client.id,
      displayName: client.displayName,
      marketingUrl: client.marketingUrl,
      orgPortal,
      campuses,
    };
  });

  return { projects, sourceRepos, clients, packageInfo };
};
