/**
 * Static Infrastructure Configuration
 *
 * This contains known infrastructure metadata for all projects.
 * This data is relatively static and changes infrequently.
 *
 * STATUS is dynamic and fetched separately (when we add status checking).
 */

import type { Project, InfraService, TechStack, AccountIdentity, LogCommand } from '$lib/types/infrastructure';

// Infrastructure metadata by project
export const INFRASTRUCTURE: Record<string, {
  displayName: string;
  identity: AccountIdentity;
  services: Omit<InfraService, 'id' | 'projectId' | 'lastChecked'>[];
  stack: Omit<TechStack, 'projectId'>;
  repoOwner: string;
  localPath?: string;
  logCommands?: LogCommand[];
}> = {
  // ==========================================================================
  // CI-MONITOR - This application (monitors itself!)
  // ==========================================================================
  'ci-monitor': {
    displayName: 'Infrastructure Observatory',
    identity: 'jaslr',
    repoOwner: 'jaslr',
    localPath: '/home/chip/ci-monitor',
    services: [
      { category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://dash.cloudflare.com/?to=/:account/pages/view/ci-monitor' },
      { category: 'ci', provider: 'github', serviceName: 'GitHub Actions', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://github.com/jaslr/ci-monitor/actions' },
    ],
    stack: {
      framework: 'sveltekit',
      frameworkVersion: '2.x',
      language: 'typescript',
      css: ['tailwind'],
      icons: 'lucide',
      testing: [],
      buildTool: 'vite',
      packageManager: 'npm',
    },
    logCommands: [
      { label: 'Dev Server', command: 'npm run dev 2>&1 | tail -f', environment: 'local', target: 'server', description: 'Dev server output' },
      { label: 'PocketBase', command: 'npm run pocketbase', environment: 'local', target: 'database', description: 'Local PocketBase logs' },
    ],
  },

  // ==========================================================================
  // LIVNA - Full-featured SvelteKit app
  // ==========================================================================
  livna: {
    displayName: 'Livna',
    identity: 'jaslr',
    repoOwner: 'jaslr',
    localPath: '/home/chip/livna',
    services: [
      { category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://dash.cloudflare.com/?to=/:account/pages/view/livna' },
      { category: 'database', provider: 'supabase', serviceName: 'Supabase Database', status: 'unknown', config: {}, discoveryMethod: 'package_json', dashboardUrl: 'https://supabase.com/dashboard/project/vtyfsrpupgrkkbnsiuqe' },
      { category: 'auth', provider: 'supabase', serviceName: 'Supabase Auth', status: 'unknown', config: {}, discoveryMethod: 'package_json', dashboardUrl: 'https://supabase.com/dashboard/project/vtyfsrpupgrkkbnsiuqe/auth/users' },
      { category: 'storage', provider: 'cloudflare', serviceName: 'Cloudflare R2', status: 'unknown', config: {}, discoveryMethod: 'env_vars', dashboardUrl: 'https://dash.cloudflare.com/?to=/:account/r2/default/buckets' },
      { category: 'monitoring', provider: 'sentry', serviceName: 'Sentry', status: 'unknown', config: {}, discoveryMethod: 'package_json', dashboardUrl: 'https://jaslr.sentry.io/projects/livna/' },
      { category: 'ci', provider: 'github', serviceName: 'GitHub Actions', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://github.com/jaslr/livna/actions' },
    ],
    stack: {
      framework: 'sveltekit',
      frameworkVersion: '2.x',
      language: 'typescript',
      css: ['tailwind', 'skeleton'],
      icons: 'lucide',
      testing: ['playwright'],
      buildTool: 'vite',
      packageManager: 'pnpm',
    },
    logCommands: [
      { label: 'Dev Server (5173)', command: 'tail -f .logs/sveltekit-dev-5173.log', environment: 'local', target: 'server', description: 'Live dev server logs' },
      { label: 'Dev Server (5183)', command: 'tail -f .logs/sveltekit-dev-5183.log', environment: 'local', target: 'server', description: 'Alternate port dev logs' },
      { label: 'Dev Errors Only', command: 'tail -n 100 .logs/sveltekit-dev-5173.log | grep -E "(ERROR|error|Error)"', environment: 'local', target: 'server', description: 'Filter for errors' },
      { label: 'Monitor Errors', command: 'bash scripts/monitor-dev-logs.sh', environment: 'local', target: 'server', description: 'Real-time error monitoring' },
      { label: 'Production Logs', command: 'npm run logs:tail', environment: 'production', target: 'server', description: 'Tail Cloudflare Pages deployment' },
      { label: 'Latest Deploy Logs', command: 'npm run logs:latest', environment: 'production', target: 'server', description: 'Get latest deployment logs' },
      { label: 'List Deployments', command: 'npm run logs:list', environment: 'production', target: 'all', description: 'List all Cloudflare deployments' },
    ],
  },

  // ==========================================================================
  // BRONTIQ
  // ==========================================================================
  brontiq: {
    displayName: 'Brontiq',
    identity: 'jaslr',
    repoOwner: 'jaslr',
    services: [
      { category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://dash.cloudflare.com/?to=/:account/pages/view/brontiq' },
      { category: 'ci', provider: 'github', serviceName: 'GitHub Actions', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://github.com/jaslr/brontiq/actions' },
    ],
    stack: {
      framework: 'sveltekit',
      language: 'typescript',
      css: ['tailwind'],
      testing: [],
      buildTool: 'vite',
      packageManager: 'npm',
    },
  },

  // ==========================================================================
  // LADDERBOX
  // ==========================================================================
  Ladderbox: {
    displayName: 'Ladderbox',
    identity: 'jaslr',
    repoOwner: 'jaslr',
    localPath: '/home/chip/blaterbox/ladderbox',
    services: [
      { category: 'hosting', provider: 'flyio', serviceName: 'Fly.io', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://fly.io/apps/ladderbox' },
      { category: 'database', provider: 'flyio', serviceName: 'Fly.io PocketBase', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://fly.io/apps/ladderbox-pocketbase' },
      { category: 'ci', provider: 'github', serviceName: 'GitHub Actions', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://github.com/jaslr/Ladderbox/actions' },
    ],
    stack: {
      framework: 'sveltekit',
      language: 'typescript',
      css: ['tailwind'],
      testing: [],
      buildTool: 'vite',
      packageManager: 'npm',
    },
    logCommands: [
      { label: 'Dev Server', command: 'tail -f .logs/dev.log', environment: 'local', target: 'server', description: 'Live dev server logs' },
      { label: 'Dev Errors', command: 'grep ERROR .logs/dev.log', environment: 'local', target: 'server', description: 'Filter for errors' },
      { label: 'Production UI Logs', command: 'fly logs --app ladderbox --since 5m', environment: 'production', target: 'server', description: 'Last 5 min UI app logs' },
      { label: 'Production DB Logs', command: 'fly logs --app ladderbox-pocketbase --since 5m', environment: 'production', target: 'database', description: 'Last 5 min PocketBase logs' },
      { label: 'UI App Status', command: 'fly status --app ladderbox', environment: 'production', target: 'server', description: 'Check UI app health' },
      { label: 'DB App Status', command: 'fly status --app ladderbox-pocketbase', environment: 'production', target: 'database', description: 'Check PocketBase health' },
    ],
  },

  // ==========================================================================
  // SHIPPYWHIPPY
  // ==========================================================================
  shippywhippy: {
    displayName: 'Shippy Whippy',
    identity: 'jaslr',
    repoOwner: 'jaslr',
    services: [
      { category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://dash.cloudflare.com/?to=/:account/pages/view/shippywhippy' },
      { category: 'ci', provider: 'github', serviceName: 'GitHub Actions', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://github.com/jaslr/shippywhippy/actions' },
    ],
    stack: {
      framework: 'sveltekit',
      language: 'typescript',
      css: ['tailwind'],
      testing: [],
      buildTool: 'vite',
      packageManager: 'npm',
    },
  },

  // ==========================================================================
  // LOADMANAGEMENT
  // ==========================================================================
  loadmanagement: {
    displayName: 'Load Management',
    identity: 'jaslr',
    repoOwner: 'jaslr',
    services: [
      { category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://dash.cloudflare.com/?to=/:account/pages/view/loadmanagement' },
      { category: 'ci', provider: 'github', serviceName: 'GitHub Actions', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://github.com/jaslr/loadmanagement/actions' },
    ],
    stack: {
      framework: 'sveltekit',
      language: 'typescript',
      css: ['tailwind'],
      testing: [],
      buildTool: 'vite',
      packageManager: 'npm',
    },
  },

  // ==========================================================================
  // LITTLELISTOFLIGHTS
  // ==========================================================================
  littlelistoflights: {
    displayName: 'Little List of Lights',
    identity: 'jaslr',
    repoOwner: 'jaslr',
    services: [
      { category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://dash.cloudflare.com/?to=/:account/pages/view/littlelistoflights' },
      { category: 'ci', provider: 'github', serviceName: 'GitHub Actions', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://github.com/jaslr/littlelistoflights/actions' },
    ],
    stack: {
      framework: 'sveltekit',
      language: 'typescript',
      css: ['tailwind'],
      testing: [],
      buildTool: 'vite',
      packageManager: 'npm',
    },
  },

  // ==========================================================================
  // JVP-UX PROJECTS
  // ==========================================================================
  'vastpuddle.com.au': {
    displayName: 'Vast Puddle',
    identity: 'jvp-ux',
    repoOwner: 'jvp-ux',
    services: [
      { category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://dash.cloudflare.com/?to=/:account/pages/view/vastpuddle-com-au' },
      { category: 'ci', provider: 'github', serviceName: 'GitHub Actions', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://github.com/jvp-ux/vastpuddle.com.au/actions' },
    ],
    stack: {
      framework: 'sveltekit',
      language: 'typescript',
      css: ['tailwind'],
      testing: [],
      buildTool: 'vite',
      packageManager: 'npm',
    },
  },

  'junipa.com.au': {
    displayName: 'Junipa',
    identity: 'jvp-ux',
    repoOwner: 'jvp-ux',
    services: [
      { category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://dash.cloudflare.com/?to=/:account/pages/view/junipa-com-au' },
      { category: 'database', provider: 'supabase', serviceName: 'Supabase Database', status: 'unknown', config: {}, discoveryMethod: 'package_json', dashboardUrl: 'https://supabase.com/dashboard/project/junipa' },
      { category: 'ci', provider: 'github', serviceName: 'GitHub Actions', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://github.com/jvp-ux/junipa.com.au/actions' },
    ],
    stack: {
      framework: 'angular',
      language: 'typescript',
      css: ['tailwind'],
      testing: [],
      buildTool: 'webpack',
      packageManager: 'npm',
    },
  },

  'junipa-organisations': {
    displayName: 'Junipa Organisations',
    identity: 'jvp-ux',
    repoOwner: 'jvp-ux',
    services: [
      { category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://dash.cloudflare.com/?to=/:account/pages/view/junipa-organisations' },
      { category: 'ci', provider: 'github', serviceName: 'GitHub Actions', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://github.com/jvp-ux/junipa-organisations/actions' },
    ],
    stack: {
      framework: 'sveltekit',
      language: 'typescript',
      css: ['tailwind'],
      testing: [],
      buildTool: 'vite',
      packageManager: 'npm',
    },
  },

  'support.junipa.com.au': {
    displayName: 'Junipa Support',
    identity: 'jvp-ux',
    repoOwner: 'jvp-ux',
    services: [
      { category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://dash.cloudflare.com/?to=/:account/pages/view/support-junipa-com-au' },
      { category: 'ci', provider: 'github', serviceName: 'GitHub Actions', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://github.com/jvp-ux/support.junipa.com.au/actions' },
    ],
    stack: {
      framework: 'sveltekit',
      language: 'typescript',
      css: ['tailwind'],
      testing: [],
      buildTool: 'vite',
      packageManager: 'npm',
    },
  },

  // ==========================================================================
  // JUNIPA TENANT APPS (GCP Cloud Build)
  // ==========================================================================
  'junipa-demo': {
    displayName: 'Junipa Demo',
    identity: 'jvp-ux',
    repoOwner: 'jvp-ux',
    services: [
      { category: 'hosting', provider: 'gcp', serviceName: 'GCP App Engine', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://console.cloud.google.com/appengine?project=junipa' },
      { category: 'ci', provider: 'gcp', serviceName: 'GCP Cloud Build', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://console.cloud.google.com/cloud-build/builds?project=junipa' },
    ],
    stack: {
      framework: 'angular',
      language: 'typescript',
      css: ['angular-material'],
      testing: [],
      buildTool: 'webpack',
      packageManager: 'npm',
    },
  },

  'junipa-cedarcollege': {
    displayName: 'Junipa - Cedar College',
    identity: 'jvp-ux',
    repoOwner: 'jvp-ux',
    services: [
      { category: 'hosting', provider: 'gcp', serviceName: 'GCP App Engine', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://console.cloud.google.com/appengine?project=cedarcollege-prod' },
      { category: 'ci', provider: 'gcp', serviceName: 'GCP Cloud Build', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://console.cloud.google.com/cloud-build/builds?project=cedarcollege-prod' },
    ],
    stack: {
      framework: 'angular',
      language: 'typescript',
      css: ['angular-material'],
      testing: [],
      buildTool: 'webpack',
      packageManager: 'npm',
    },
  },

  'junipa-menofbusiness': {
    displayName: 'Junipa - Men of Business',
    identity: 'jvp-ux',
    repoOwner: 'jvp-ux',
    services: [
      { category: 'hosting', provider: 'gcp', serviceName: 'GCP App Engine', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://console.cloud.google.com/appengine?project=menofbusiness-prod' },
      { category: 'ci', provider: 'gcp', serviceName: 'GCP Cloud Build', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://console.cloud.google.com/cloud-build/builds?project=menofbusiness-prod' },
    ],
    stack: {
      framework: 'angular',
      language: 'typescript',
      css: ['angular-material'],
      testing: [],
      buildTool: 'webpack',
      packageManager: 'npm',
    },
  },

  'junipa-mjc': {
    displayName: 'Junipa - MJC',
    identity: 'jvp-ux',
    repoOwner: 'jvp-ux',
    services: [
      { category: 'hosting', provider: 'gcp', serviceName: 'GCP App Engine', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://console.cloud.google.com/appengine?project=mjc-prod-2022b' },
      { category: 'ci', provider: 'gcp', serviceName: 'GCP Cloud Build', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://console.cloud.google.com/cloud-build/builds?project=mjc-prod-2022b' },
    ],
    stack: {
      framework: 'angular',
      language: 'typescript',
      css: ['angular-material'],
      testing: [],
      buildTool: 'webpack',
      packageManager: 'npm',
    },
  },

  'junipa-tuncurry': {
    displayName: 'Junipa - Tuncurry',
    identity: 'jvp-ux',
    repoOwner: 'jvp-ux',
    services: [
      { category: 'hosting', provider: 'gcp', serviceName: 'GCP App Engine', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://console.cloud.google.com/appengine?project=mjc-tuncurry-prod' },
      { category: 'ci', provider: 'gcp', serviceName: 'GCP Cloud Build', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://console.cloud.google.com/cloud-build/builds?project=mjc-tuncurry-prod' },
    ],
    stack: {
      framework: 'angular',
      language: 'typescript',
      css: ['angular-material'],
      testing: [],
      buildTool: 'webpack',
      packageManager: 'npm',
    },
  },

  'junipa-central-demo': {
    displayName: 'Junipa Central Demo',
    identity: 'jvp-ux',
    repoOwner: 'jvp-ux',
    services: [
      { category: 'hosting', provider: 'gcp', serviceName: 'GCP App Engine', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://console.cloud.google.com/appengine?project=junipa-central-demo' },
      { category: 'ci', provider: 'gcp', serviceName: 'GCP Cloud Build', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://console.cloud.google.com/cloud-build/builds?project=junipa-central-demo' },
    ],
    stack: {
      framework: 'angular',
      language: 'typescript',
      css: ['angular-material'],
      testing: [],
      buildTool: 'webpack',
      packageManager: 'npm',
    },
  },

  'junipa-west-demo': {
    displayName: 'Junipa West Demo',
    identity: 'jvp-ux',
    repoOwner: 'jvp-ux',
    services: [
      { category: 'hosting', provider: 'gcp', serviceName: 'GCP App Engine', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://console.cloud.google.com/appengine?project=junipa-west-demo' },
      { category: 'ci', provider: 'gcp', serviceName: 'GCP Cloud Build', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://console.cloud.google.com/cloud-build/builds?project=junipa-west-demo' },
    ],
    stack: {
      framework: 'angular',
      language: 'typescript',
      css: ['angular-material'],
      testing: [],
      buildTool: 'webpack',
      packageManager: 'npm',
    },
  },
};

/**
 * Get infrastructure for a project by repo name
 */
export function getProjectInfrastructure(repoName: string): {
  displayName: string;
  identity: AccountIdentity;
  repoOwner: string;
  localPath?: string;
  services: InfraService[];
  stack: TechStack;
  logCommands?: LogCommand[];
} | null {
  const infra = INFRASTRUCTURE[repoName];
  if (!infra) return null;

  const now = new Date().toISOString();

  return {
    displayName: infra.displayName,
    identity: infra.identity,
    repoOwner: infra.repoOwner,
    localPath: infra.localPath,
    services: infra.services.map((s, i) => ({
      ...s,
      id: `${repoName}-${s.provider}-${s.category}-${i}`,
      projectId: repoName,
      lastChecked: now,
    })),
    stack: {
      ...infra.stack,
      projectId: repoName,
    },
    logCommands: infra.logCommands,
  };
}

/**
 * Get all known projects with infrastructure
 */
export function getAllProjectsInfrastructure(): Map<string, ReturnType<typeof getProjectInfrastructure>> {
  const result = new Map();
  for (const repoName of Object.keys(INFRASTRUCTURE)) {
    result.set(repoName, getProjectInfrastructure(repoName));
  }
  return result;
}

/**
 * Provider usage info for ecosystem view
 */
export interface ProviderUsage {
  provider: string;
  serviceName: string;
  projects: { id: string; displayName: string }[];
  dashboardUrl?: string;
}

/**
 * Category with providers for ecosystem view
 */
export interface CategoryProviders {
  category: string;
  providers: ProviderUsage[];
}

/**
 * Get all providers grouped by category with their dependent projects
 * Inverts the data structure from project-centric to provider-centric
 */
export function getProvidersByCategory(): CategoryProviders[] {
  const categoryMap = new Map<string, Map<string, ProviderUsage>>();

  for (const [repoName, infra] of Object.entries(INFRASTRUCTURE)) {
    for (const service of infra.services) {
      // Get or create category
      if (!categoryMap.has(service.category)) {
        categoryMap.set(service.category, new Map());
      }
      const providerMap = categoryMap.get(service.category)!;

      // Get or create provider entry
      if (!providerMap.has(service.provider)) {
        providerMap.set(service.provider, {
          provider: service.provider,
          serviceName: service.serviceName,
          projects: [],
          dashboardUrl: undefined,
        });
      }

      // Add project to provider
      const providerUsage = providerMap.get(service.provider)!;
      providerUsage.projects.push({
        id: repoName,
        displayName: infra.displayName,
      });

      // Keep first dashboard URL as representative
      if (!providerUsage.dashboardUrl && service.dashboardUrl) {
        providerUsage.dashboardUrl = service.dashboardUrl;
      }
    }
  }

  // Convert to array format, sorted by category importance
  const categoryOrder = ['hosting', 'database', 'auth', 'storage', 'ci', 'monitoring', 'dns', 'email', 'analytics', 'cdn', 'secrets'];

  const result: CategoryProviders[] = [];

  for (const category of categoryOrder) {
    const providerMap = categoryMap.get(category);
    if (providerMap) {
      const providers = Array.from(providerMap.values())
        .sort((a, b) => b.projects.length - a.projects.length);

      result.push({ category, providers });
    }
  }

  // Add any remaining categories not in the order
  for (const [category, providerMap] of categoryMap) {
    if (!categoryOrder.includes(category)) {
      const providers = Array.from(providerMap.values())
        .sort((a, b) => b.projects.length - a.projects.length);
      result.push({ category, providers });
    }
  }

  return result;
}

/**
 * Get flat list of all projects for ecosystem diagram
 */
export function getAllProjects(): { id: string; displayName: string; identity: string }[] {
  return Object.entries(INFRASTRUCTURE).map(([id, infra]) => ({
    id,
    displayName: infra.displayName,
    identity: infra.identity,
  }));
}
