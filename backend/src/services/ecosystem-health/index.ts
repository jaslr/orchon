// Ecosystem health service - orchestrates all health checks with caching

import type { EcosystemResponse, EcosystemNode } from './types.js';
import { EDGE_DEFINITIONS, CACHE_TTL } from './config.js';
import { checkDropletServices } from './checkers/droplet.js';
import { checkExternalServices } from './checkers/external.js';
import { checkPlatformServices } from './checkers/platforms.js';

// In-memory cache
let cachedResponse: EcosystemResponse | null = null;
let cacheTimestamp: number = 0;

// Check if cache is valid
function isCacheValid(): boolean {
  return cachedResponse !== null && Date.now() - cacheTimestamp < CACHE_TTL;
}

// Run all health checks in parallel
async function runAllChecks(): Promise<EcosystemNode[]> {
  const [dropletNodes, externalNodes, platformNodes] = await Promise.all([
    checkDropletServices(),
    checkExternalServices(),
    checkPlatformServices(),
  ]);

  return [...dropletNodes, ...externalNodes, ...platformNodes];
}

// Get ecosystem status (with caching)
export async function getEcosystemStatus(): Promise<EcosystemResponse> {
  // Return cached response if valid
  if (isCacheValid() && cachedResponse) {
    return cachedResponse;
  }

  // Run fresh checks
  const nodes = await runAllChecks();
  const response: EcosystemResponse = {
    nodes,
    edges: EDGE_DEFINITIONS,
    lastCheck: new Date().toISOString(),
  };

  // Update cache
  cachedResponse = response;
  cacheTimestamp = Date.now();

  return response;
}

// Force refresh (bypass cache)
export async function refreshEcosystemStatus(): Promise<EcosystemResponse> {
  cachedResponse = null;
  cacheTimestamp = 0;
  return getEcosystemStatus();
}

// Export types for route
export type { EcosystemResponse, EcosystemNode };
