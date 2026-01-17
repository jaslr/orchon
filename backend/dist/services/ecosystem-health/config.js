// Ecosystem node and edge configuration
// Droplet IP - configured via environment
export const DROPLET_IP = process.env.DROPLET_IP || '209.38.85.244';
// Timeout for health checks (ms)
export const CHECK_TIMEOUT = 5000;
// Response time threshold for "degraded" status (ms)
export const DEGRADED_THRESHOLD = 2000;
// Cache TTL (ms)
export const CACHE_TTL = 30000;
// Edge definitions (connections between nodes)
export const EDGE_DEFINITIONS = [
    // Flutter app connections
    { from: 'flutter-app', to: 'droplet-ws', label: 'WebSocket' },
    { from: 'flutter-app', to: 'droplet-ota', label: 'OTA Updates' },
    { from: 'flutter-app', to: 'droplet-ssh', label: 'SSH/Claude' },
    { from: 'flutter-app', to: 'flyio-backend', label: 'REST API' },
    // Telegram bot
    { from: 'telegram', to: 'droplet-bot', label: 'Bot Commands' },
    // Proxy connections
    { from: 'droplet-proxy', to: 'claude-api', label: 'AI Extraction' },
    { from: 'droplet-proxy', to: 'cloudflare-tunnel', label: 'LLOL Proxy' },
    // Backend connections
    { from: 'flyio-backend', to: 'flyio-db', label: 'Postgres' },
    { from: 'github', to: 'flyio-backend', label: 'Webhooks' },
    // Web dashboard
    { from: 'web-dashboard', to: 'flyio-backend', label: 'REST API' },
];
//# sourceMappingURL=config.js.map