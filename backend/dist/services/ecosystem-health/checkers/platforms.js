// Platform health checkers (Fly.io, Cloudflare)
import { CHECK_TIMEOUT, DEGRADED_THRESHOLD } from '../config.js';
import { getDbStatus } from '../../../db/client.js';
// Generic HTTP check helper
async function checkEndpoint(url) {
    const start = Date.now();
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CHECK_TIMEOUT);
        const response = await fetch(url, {
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        const responseTime = Date.now() - start;
        if (!response.ok) {
            return {
                status: 'down',
                responseTime,
                error: `HTTP ${response.status}`,
            };
        }
        return {
            status: responseTime > DEGRADED_THRESHOLD ? 'degraded' : 'healthy',
            responseTime,
            meta: { responseTime: `${responseTime}ms` },
        };
    }
    catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            return { status: 'unknown', error: 'Timeout' };
        }
        return {
            status: 'down',
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
// Check Fly.io backend (self-check)
async function checkFlyioBackend() {
    // We're running on Fly.io, so this is a self-check
    // Check our own health endpoint
    const start = Date.now();
    try {
        const dbStatus = await getDbStatus();
        const responseTime = Date.now() - start;
        return {
            status: dbStatus.connected
                ? responseTime > DEGRADED_THRESHOLD
                    ? 'degraded'
                    : 'healthy'
                : 'down',
            responseTime,
            meta: {
                responseTime: `${responseTime}ms`,
                database: dbStatus.connected ? 'connected' : 'disconnected',
            },
        };
    }
    catch {
        return { status: 'down', error: 'Self-check failed' };
    }
}
// Check Fly.io Postgres
async function checkFlyioDb() {
    const start = Date.now();
    try {
        const dbStatus = await getDbStatus();
        const responseTime = Date.now() - start;
        const meta = {
            responseTime: `${responseTime}ms`,
            connected: String(dbStatus.connected),
        };
        if (dbStatus.latencyMs) {
            meta.latencyMs = String(dbStatus.latencyMs);
        }
        return {
            status: dbStatus.connected ? 'healthy' : 'down',
            responseTime,
            meta,
        };
    }
    catch {
        return { status: 'down', error: 'Database check failed' };
    }
}
// Check Cloudflare Pages (orchon.pages.dev)
async function checkCloudflarePages() {
    return checkEndpoint('https://orchon.pages.dev');
}
// Check Cloudflare Tunnel (proxy.littlelistoflights.com)
async function checkCloudflareTunnel() {
    // The tunnel points to droplet:8407, but we check if the tunnel itself is working
    const result = await checkEndpoint('https://proxy.littlelistoflights.com/health');
    // If we get any response (even error), the tunnel is working
    if (result.status === 'down' && result.error?.startsWith('HTTP')) {
        return {
            ...result,
            status: 'healthy',
            meta: { ...result.meta, note: 'Tunnel active' },
        };
    }
    return result;
}
// Get all platform nodes
export async function checkPlatformServices() {
    const nodes = [];
    // Fly.io Backend (self)
    const backendResult = await checkFlyioBackend();
    nodes.push({
        id: 'flyio-backend',
        label: 'ORCHON Backend',
        type: 'service',
        status: backendResult.status,
        parent: 'flyio',
        url: 'https://observatory-backend.fly.dev',
        meta: backendResult.meta,
    });
    // Fly.io Postgres
    const dbResult = await checkFlyioDb();
    nodes.push({
        id: 'flyio-db',
        label: 'Postgres',
        type: 'service',
        status: dbResult.status,
        parent: 'flyio',
        meta: dbResult.meta,
    });
    // Fly.io platform node
    const flyioStatus = backendResult.status === 'healthy' && dbResult.status === 'healthy'
        ? 'healthy'
        : backendResult.status === 'down' && dbResult.status === 'down'
            ? 'down'
            : 'degraded';
    nodes.unshift({
        id: 'flyio',
        label: 'Fly.io',
        type: 'platform',
        status: flyioStatus,
        url: 'https://fly.io/apps/observatory-backend',
    });
    // Cloudflare Pages
    const pagesResult = await checkCloudflarePages();
    nodes.push({
        id: 'cloudflare-pages',
        label: 'orchon.pages.dev',
        type: 'service',
        status: pagesResult.status,
        parent: 'cloudflare',
        url: 'https://orchon.pages.dev',
        meta: pagesResult.meta,
    });
    // Cloudflare Tunnel
    const tunnelResult = await checkCloudflareTunnel();
    nodes.push({
        id: 'cloudflare-tunnel',
        label: 'LLOL Proxy Tunnel',
        type: 'service',
        status: tunnelResult.status,
        parent: 'cloudflare',
        url: 'https://proxy.littlelistoflights.com',
        meta: tunnelResult.meta,
    });
    // Cloudflare platform node
    const cfStatus = pagesResult.status === 'healthy' ? 'healthy' : pagesResult.status;
    nodes.push({
        id: 'cloudflare',
        label: 'Cloudflare',
        type: 'platform',
        status: cfStatus,
        url: 'https://dash.cloudflare.com',
    });
    // App nodes (implicit - if you can see them, they work)
    nodes.push({
        id: 'web-dashboard',
        label: 'Web Dashboard',
        type: 'app',
        status: 'healthy', // If the API is responding, dashboard works
        url: 'https://orchon.pages.dev',
    });
    nodes.push({
        id: 'flutter-app',
        label: 'Doewah App',
        type: 'app',
        status: 'unknown', // Can't check from server
        meta: { note: 'Mobile app status unknown from server' },
    });
    return nodes;
}
//# sourceMappingURL=platforms.js.map