// Project configuration - synced with ci-monitor frontend
// This defines which projects we monitor and their alert levels
// Projects to monitor - matches ci-monitor/src/lib/config/repos.ts
export const projects = [
    {
        id: 'livna',
        name: 'livna',
        displayName: 'Livna',
        owner: 'jaslr',
        alertLevel: 'business',
        uptimeUrl: 'https://livna.io',
        services: [
            { id: 'livna-hosting', category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages' },
            { id: 'livna-db', category: 'database', provider: 'supabase', serviceName: 'Supabase' },
            { id: 'livna-ci', category: 'ci', provider: 'github', serviceName: 'GitHub Actions' },
            { id: 'livna-monitoring', category: 'monitoring', provider: 'sentry', serviceName: 'Sentry' },
        ],
    },
    {
        id: 'ladderbox',
        name: 'Ladderbox',
        displayName: 'Ladderbox',
        owner: 'jaslr',
        alertLevel: 'business',
        uptimeUrl: 'https://ladderbox.fly.dev',
        services: [
            { id: 'ladderbox-hosting', category: 'hosting', provider: 'flyio', serviceName: 'Fly.io' },
            { id: 'ladderbox-db', category: 'database', provider: 'supabase', serviceName: 'Supabase' },
            { id: 'ladderbox-ci', category: 'ci', provider: 'github', serviceName: 'GitHub Actions' },
        ],
    },
    {
        id: 'ci-monitor',
        name: 'ci-monitor',
        displayName: 'Infrastructure Observatory',
        owner: 'jaslr',
        alertLevel: 'hobby',
        uptimeUrl: 'https://ci-monitor.pages.dev',
        services: [
            { id: 'ci-monitor-hosting', category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages' },
            { id: 'ci-monitor-ci', category: 'ci', provider: 'github', serviceName: 'GitHub Actions' },
        ],
    },
    {
        id: 'brontiq',
        name: 'brontiq',
        displayName: 'Brontiq',
        owner: 'jaslr',
        alertLevel: 'hobby',
        services: [
            { id: 'brontiq-ci', category: 'ci', provider: 'github', serviceName: 'GitHub Actions' },
        ],
    },
    {
        id: 'shippywhippy',
        name: 'shippywhippy',
        displayName: 'ShippyWhippy',
        owner: 'jaslr',
        alertLevel: 'hobby',
        services: [
            { id: 'shippywhippy-ci', category: 'ci', provider: 'github', serviceName: 'GitHub Actions' },
        ],
    },
    // jvp-ux projects
    {
        id: 'vastpuddle',
        name: 'vastpuddle.com.au',
        displayName: 'Vast Puddle',
        owner: 'jvp-ux',
        alertLevel: 'hobby',
        uptimeUrl: 'https://vastpuddle.com.au',
        services: [
            { id: 'vastpuddle-hosting', category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages' },
            { id: 'vastpuddle-ci', category: 'ci', provider: 'github', serviceName: 'GitHub Actions' },
        ],
    },
    {
        id: 'junipa',
        name: 'junipa.com.au',
        displayName: 'Junipa',
        owner: 'jvp-ux',
        alertLevel: 'hobby',
        uptimeUrl: 'https://junipa.com.au',
        services: [
            { id: 'junipa-hosting', category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages' },
            { id: 'junipa-ci', category: 'ci', provider: 'github', serviceName: 'GitHub Actions' },
        ],
    },
];
// Helper to find project by repo name
export function getProjectByRepo(repoName) {
    return projects.find((p) => p.name.toLowerCase() === repoName.toLowerCase());
}
// Helper to find project by owner and repo
export function getProjectByOwnerRepo(owner, repo) {
    return projects.find((p) => p.owner.toLowerCase() === owner.toLowerCase() && p.name.toLowerCase() === repo.toLowerCase());
}
//# sourceMappingURL=projects.js.map