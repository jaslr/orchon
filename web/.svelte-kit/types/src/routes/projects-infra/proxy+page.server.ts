// @ts-nocheck
import type { PageServerLoad } from './$types';
import { INFRASTRUCTURE } from '$lib/config/infrastructure';

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
  'wwc',  // Work With Chip / Violet
];

export const load = async () => {
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
      };
      return project;
    })
    .filter((p): p is PersonalProject => p !== null);

  // Add Violet (static description project)
  const additionalProjects: PersonalProject[] = [
    {
      id: 'violet',
      displayName: 'Violet',
      productionUrl: undefined,
      repoUrl: 'https://github.com/jaslr/violet',
      hostingProvider: 'none',
      identity: 'jaslr',
      description: 'Design system / component library',
    },
  ];

  return {
    projects: [...projects, ...additionalProjects].sort((a, b) =>
      a.displayName.localeCompare(b.displayName)
    )
  };
};
;null as any as PageServerLoad;