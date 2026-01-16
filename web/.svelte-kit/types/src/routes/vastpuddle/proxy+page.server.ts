// @ts-nocheck
import type { PageServerLoad } from './$types';
import {
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

// Resolved client with full GCP project details
export interface ResolvedClient {
  id: string;
  displayName: string;
  marketingUrl?: string;
  orgPortal?: {
    gcpProject: string;
    displayName: string;
    customDomain?: string;
    productionUrl?: string;
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

export const load = async () => {
  // Package info injected at build time via vite.config.ts
  const packageInfo: PackageInfo = __PACKAGE_INFO__;

  // Get hierarchical structure for source repos and their instances
  // Filter to only junipa-related repos
  const allSourceRepos: SourceRepoWithInstances[] = getSourceReposWithInstances();
  const sourceRepos = allSourceRepos.filter(repo =>
    repo.id === 'junipa' || repo.id === 'junipa-organisations'
  );

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

  return { sourceRepos, clients, packageInfo };
};
;null as any as PageServerLoad;