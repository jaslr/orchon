// Droplet service health checkers
import { DROPLET_IP, CHECK_TIMEOUT, DEGRADED_THRESHOLD } from '../config.js';
// TCP port check using fetch with timeout
async function checkTcpPort(port) {
    const start = Date.now();
    try {
        // For TCP ports, we'll try a simple HTTP request if applicable
        // For SSH (22), we just check if the port responds
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CHECK_TIMEOUT);
        if (port === 22) {
            // SSH port - use net connect simulation via attempting connection
            // In Node.js on Fly.io, we can't do raw TCP easily, so we'll skip SSH check
            // and rely on the fact that if other services are up, SSH likely is too
            clearTimeout(timeoutId);
            return {
                status: 'unknown',
                meta: { note: 'SSH check requires direct TCP access' },
            };
        }
        clearTimeout(timeoutId);
        return { status: 'unknown' };
    }
    catch (error) {
        return {
            status: 'down',
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
// HTTP endpoint check
async function checkHttpEndpoint(url, expectedField) {
    const start = Date.now();
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CHECK_TIMEOUT);
        const response = await fetch(url, {
            signal: controller.signal,
            headers: { Accept: 'application/json' },
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
        const data = (await response.json());
        const meta = {
            responseTime: `${responseTime}ms`,
        };
        // Extract version if available
        if (typeof data.version === 'string') {
            meta.version = data.version;
        }
        if (data.buildNumber !== undefined) {
            meta.buildNumber = String(data.buildNumber);
        }
        return {
            status: responseTime > DEGRADED_THRESHOLD ? 'degraded' : 'healthy',
            responseTime,
            meta,
        };
    }
    catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            return {
                status: 'unknown',
                error: 'Timeout',
            };
        }
        return {
            status: 'down',
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
// WebSocket upgrade check
async function checkWebSocket(url) {
    const start = Date.now();
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CHECK_TIMEOUT);
        // Try HTTP request to WS endpoint - it should return upgrade required or similar
        const httpUrl = url.replace('ws://', 'http://').replace('wss://', 'https://');
        const response = await fetch(httpUrl, {
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        const responseTime = Date.now() - start;
        // WebSocket endpoints typically return 400 or upgrade-required when accessed via HTTP
        // Any response means the server is running
        return {
            status: responseTime > DEGRADED_THRESHOLD ? 'degraded' : 'healthy',
            responseTime,
            meta: {
                responseTime: `${responseTime}ms`,
                httpStatus: String(response.status),
            },
        };
    }
    catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            return {
                status: 'unknown',
                error: 'Timeout',
            };
        }
        return {
            status: 'down',
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
// Check all droplet services
export async function checkDropletServices() {
    const nodes = [];
    // SSH check (port 22) - we'll mark as unknown since we can't TCP check from Fly.io
    nodes.push({
        id: 'droplet-ssh',
        label: 'SSH :22',
        type: 'service',
        status: 'unknown',
        parent: 'droplet',
        url: `ssh://root@${DROPLET_IP}`,
        meta: { port: '22', note: 'SSH check unavailable from cloud' },
    });
    // WebSocket check (port 8405)
    const wsResult = await checkWebSocket(`ws://${DROPLET_IP}:8405`);
    nodes.push({
        id: 'droplet-ws',
        label: 'WebSocket :8405',
        type: 'service',
        status: wsResult.status,
        parent: 'droplet',
        url: `ws://${DROPLET_IP}:8405`,
        meta: { port: '8405', ...wsResult.meta },
    });
    // OTA Updates check (port 8406)
    const otaResult = await checkHttpEndpoint(`http://${DROPLET_IP}:8406/version`);
    nodes.push({
        id: 'droplet-ota',
        label: 'OTA :8406',
        type: 'service',
        status: otaResult.status,
        parent: 'droplet',
        url: `http://${DROPLET_IP}:8406/download`,
        meta: { port: '8406', ...otaResult.meta },
    });
    // Proxy API check (port 8407)
    const proxyResult = await checkHttpEndpoint(`http://${DROPLET_IP}:8407/health`);
    nodes.push({
        id: 'droplet-proxy',
        label: 'Proxy :8407',
        type: 'service',
        status: proxyResult.status,
        parent: 'droplet',
        url: `http://${DROPLET_IP}:8407`,
        meta: { port: '8407', ...proxyResult.meta },
    });
    // Telegram bot - check via the bot service on droplet
    // We'll check if the bot's health endpoint responds (if it has one)
    // For now, mark as unknown - we'll improve this later
    nodes.push({
        id: 'droplet-bot',
        label: 'Telegram Bot',
        type: 'service',
        status: 'unknown',
        parent: 'droplet',
        meta: { note: 'Bot status check not implemented' },
    });
    // Parent droplet node - status based on children
    const childStatuses = nodes.map((n) => n.status);
    let dropletStatus = 'healthy';
    if (childStatuses.every((s) => s === 'down')) {
        dropletStatus = 'down';
    }
    else if (childStatuses.some((s) => s === 'down')) {
        dropletStatus = 'degraded';
    }
    else if (childStatuses.every((s) => s === 'unknown')) {
        dropletStatus = 'unknown';
    }
    // Add the parent platform node at the beginning
    nodes.unshift({
        id: 'droplet',
        label: `DigitalOcean ${DROPLET_IP}`,
        type: 'platform',
        status: dropletStatus,
        url: `https://cloud.digitalocean.com`,
        meta: { ip: DROPLET_IP },
    });
    return nodes;
}
//# sourceMappingURL=droplet.js.map