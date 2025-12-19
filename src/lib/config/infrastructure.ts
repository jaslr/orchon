/**
 * Static Infrastructure Configuration
 *
 * This contains known infrastructure metadata for all projects.
 * This data is relatively static and changes infrequently.
 *
 * STATUS is dynamic and fetched separately (when we add status checking).
 */

import type { Project, InfraService, TechStack, AccountIdentity } from '$lib/types/infrastructure';

// Infrastructure metadata by project
export const INFRASTRUCTURE: Record<string, {
  displayName: string;
  identity: AccountIdentity;
  services: Omit<InfraService, 'id' | 'projectId' | 'lastChecked'>[];
  stack: Omit<TechStack, 'projectId'>;
}> = {
  // ==========================================================================
  // LIVNA - Full-featured SvelteKit app
  // ==========================================================================
  livna: {
    displayName: 'Livna',
    identity: 'jaslr',
    services: [
      { category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages', status: 'unknown', config: {}, discoveryMethod: 'config_file' },
      { category: 'database', provider: 'supabase', serviceName: 'Supabase Database', status: 'unknown', config: {}, discoveryMethod: 'package_json' },
      { category: 'auth', provider: 'supabase', serviceName: 'Supabase Auth', status: 'unknown', config: {}, discoveryMethod: 'package_json' },
      { category: 'storage', provider: 'cloudflare', serviceName: 'Cloudflare R2', status: 'unknown', config: {}, discoveryMethod: 'env_vars' },
      { category: 'monitoring', provider: 'sentry', serviceName: 'Sentry', status: 'unknown', config: {}, discoveryMethod: 'package_json' },
      { category: 'ci', provider: 'github', serviceName: 'GitHub Actions', status: 'unknown', config: {}, discoveryMethod: 'config_file' },
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
  },

  // ==========================================================================
  // BRONTIQ
  // ==========================================================================
  brontiq: {
    displayName: 'Brontiq',
    identity: 'jaslr',
    services: [
      { category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages', status: 'unknown', config: {}, discoveryMethod: 'config_file' },
      { category: 'ci', provider: 'github', serviceName: 'GitHub Actions', status: 'unknown', config: {}, discoveryMethod: 'config_file' },
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
    services: [
      { category: 'hosting', provider: 'flyio', serviceName: 'Fly.io', status: 'unknown', config: {}, discoveryMethod: 'config_file' },
      { category: 'database', provider: 'supabase', serviceName: 'Supabase Database', status: 'unknown', config: {}, discoveryMethod: 'package_json' },
      { category: 'ci', provider: 'github', serviceName: 'GitHub Actions', status: 'unknown', config: {}, discoveryMethod: 'config_file' },
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
  // SHIPPYWHIPPY
  // ==========================================================================
  shippywhippy: {
    displayName: 'Shippy Whippy',
    identity: 'jaslr',
    services: [
      { category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages', status: 'unknown', config: {}, discoveryMethod: 'config_file' },
      { category: 'ci', provider: 'github', serviceName: 'GitHub Actions', status: 'unknown', config: {}, discoveryMethod: 'config_file' },
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
    services: [
      { category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages', status: 'unknown', config: {}, discoveryMethod: 'config_file' },
      { category: 'ci', provider: 'github', serviceName: 'GitHub Actions', status: 'unknown', config: {}, discoveryMethod: 'config_file' },
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
    services: [
      { category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages', status: 'unknown', config: {}, discoveryMethod: 'config_file' },
      { category: 'ci', provider: 'github', serviceName: 'GitHub Actions', status: 'unknown', config: {}, discoveryMethod: 'config_file' },
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
    services: [
      { category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages', status: 'unknown', config: {}, discoveryMethod: 'config_file' },
      { category: 'ci', provider: 'github', serviceName: 'GitHub Actions', status: 'unknown', config: {}, discoveryMethod: 'config_file' },
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
    services: [
      { category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages', status: 'unknown', config: {}, discoveryMethod: 'config_file' },
      { category: 'database', provider: 'supabase', serviceName: 'Supabase Database', status: 'unknown', config: {}, discoveryMethod: 'package_json' },
      { category: 'ci', provider: 'github', serviceName: 'GitHub Actions', status: 'unknown', config: {}, discoveryMethod: 'config_file' },
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
    services: [
      { category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages', status: 'unknown', config: {}, discoveryMethod: 'config_file' },
      { category: 'ci', provider: 'github', serviceName: 'GitHub Actions', status: 'unknown', config: {}, discoveryMethod: 'config_file' },
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
    services: [
      { category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages', status: 'unknown', config: {}, discoveryMethod: 'config_file' },
      { category: 'ci', provider: 'github', serviceName: 'GitHub Actions', status: 'unknown', config: {}, discoveryMethod: 'config_file' },
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
};

/**
 * Get infrastructure for a project by repo name
 */
export function getProjectInfrastructure(repoName: string): {
  displayName: string;
  identity: AccountIdentity;
  services: InfraService[];
  stack: TechStack;
} | null {
  const infra = INFRASTRUCTURE[repoName];
  if (!infra) return null;

  const now = new Date().toISOString();

  return {
    displayName: infra.displayName,
    identity: infra.identity,
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
