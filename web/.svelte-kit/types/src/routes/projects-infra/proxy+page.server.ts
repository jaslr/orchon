// @ts-nocheck
import type { PageServerLoad } from './$types';
import { INFRASTRUCTURE } from '$lib/config/infrastructure';
import type { TechStack, InfraService } from '$lib/types/infrastructure';

export interface PersonalProject {
  id: string;
  displayName: string;
  productionUrl?: string;
  repoUrl: string;
  hostingProvider: string;
  database?: string;
  identity: string;
  localPath?: string;
  description?: string;
  stack?: Omit<TechStack, 'projectId'>;
  services: Omit<InfraService, 'id' | 'projectId' | 'lastChecked'>[];
}

interface Logo {
  id: string;
  name: string;
  url: string;
  type: 'infra' | 'techstack';
}

// Define personal projects (non-Junipa)
const PERSONAL_PROJECT_IDS = [
  'littlelistoflights',
  'livna',
  'orchon',
  'brontiq',
  'loadmanagement',  // BlatBlat
  'Ladderbox',
  'shippywhippy',
  'wwc',  // Work With Chip
  'violet',  // Design system / component library
];

export const load = async ({ platform }: Parameters<PageServerLoad>[0]) => {
  // Load logos from R2
  const bucket = platform?.env?.LOGOS_BUCKET;
  let logos: Logo[] = [];

  if (bucket) {
    try {
      const listed = await bucket.list();
      for (const obj of listed.objects) {
        const parts = obj.key.split('/');
        const type = parts[0] as 'infra' | 'techstack';
        const filename = parts.slice(1).join('/');
        const name = filename.replace(/\.(svg|png)$/i, '');
        logos.push({
          id: obj.key,
          name,
          url: `/api/logos/${obj.key}`,
          type
        });
      }
    } catch (err) {
      console.error('Failed to load logos:', err);
    }
  }

  const projects: PersonalProject[] = PERSONAL_PROJECT_IDS
    .map(id => {
      const infra = INFRASTRUCTURE[id];
      if (!infra) return null;

      // Get hosting provider
      const hostingService = infra.services.find(s => s.category === 'hosting');
      const hostingProvider = hostingService?.provider || 'unknown';

      // Get database if any
      const dbService = infra.services.find(s => s.category === 'database');
      const database = dbService?.provider;

      const project: PersonalProject = {
        id,
        displayName: infra.displayName,
        productionUrl: infra.productionUrl,
        repoUrl: `https://github.com/${infra.repoOwner}/${id}`,
        hostingProvider,
        database,
        identity: infra.identity,
        localPath: infra.localPath,
        stack: infra.stack,
        services: infra.services,
      };
      return project;
    })
    .filter((p): p is PersonalProject => p !== null);

  return {
    projects: projects.sort((a, b) =>
      a.displayName.localeCompare(b.displayName)
    ),
    logos
  };
};
