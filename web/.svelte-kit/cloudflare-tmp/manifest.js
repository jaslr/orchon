export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.svg","icons/apple-touch-icon.png","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-512.png","logo.svg","logos/infra/aws.svg","logos/infra/cloudflare.svg","logos/infra/digitalocean.svg","logos/infra/firebase.svg","logos/infra/flyio.svg","logos/infra/github.svg","logos/infra/mailgun.svg","logos/infra/netlify.svg","logos/infra/resend.svg","logos/infra/sentry.svg","logos/infra/supabase.svg","logos/infra/twilio.svg","logos/infra/vercel.svg","logos/techstack/angular.svg","logos/techstack/bun.svg","logos/techstack/lucide.svg","logos/techstack/nextjs.svg","logos/techstack/nodejs.svg","logos/techstack/npm.svg","logos/techstack/playwright.svg","logos/techstack/pnpm.svg","logos/techstack/react.svg","logos/techstack/svelte.svg","logos/techstack/sveltekit.svg","logos/techstack/tailwind.svg","logos/techstack/typescript.svg","logos/techstack/vite.svg","logos/techstack/vitest.svg","manifest.json","robots.txt","sw.js"]),
	mimeTypes: {".svg":"image/svg+xml",".png":"image/png",".json":"application/json",".txt":"text/plain",".js":"text/javascript"},
	_: {
		client: {start:"_app/immutable/entry/start.BI5OuFaw.js",app:"_app/immutable/entry/app.DCcqQet_.js",imports:["_app/immutable/entry/start.BI5OuFaw.js","_app/immutable/chunks/Cyzlk6cb.js","_app/immutable/chunks/D5oE3Dzy.js","_app/immutable/chunks/Dnd2HTQh.js","_app/immutable/chunks/BDR25Ma5.js","_app/immutable/chunks/Dc2clUla.js","_app/immutable/chunks/-9B-tiFA.js","_app/immutable/entry/app.DCcqQet_.js","_app/immutable/chunks/Dnd2HTQh.js","_app/immutable/chunks/BDR25Ma5.js","_app/immutable/chunks/Dc2clUla.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/D5oE3Dzy.js","_app/immutable/chunks/-9B-tiFA.js","_app/immutable/chunks/DKZzDoih.js","_app/immutable/chunks/LdpL5_qW.js","_app/immutable/chunks/BxCSoznQ.js","_app/immutable/chunks/CqyOSPLz.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js')),
			__memo(() => import('../output/server/nodes/2.js')),
			__memo(() => import('../output/server/nodes/3.js')),
			__memo(() => import('../output/server/nodes/4.js')),
			__memo(() => import('../output/server/nodes/5.js')),
			__memo(() => import('../output/server/nodes/6.js')),
			__memo(() => import('../output/server/nodes/7.js')),
			__memo(() => import('../output/server/nodes/8.js')),
			__memo(() => import('../output/server/nodes/9.js')),
			__memo(() => import('../output/server/nodes/10.js')),
			__memo(() => import('../output/server/nodes/11.js')),
			__memo(() => import('../output/server/nodes/12.js')),
			__memo(() => import('../output/server/nodes/13.js')),
			__memo(() => import('../output/server/nodes/14.js')),
			__memo(() => import('../output/server/nodes/15.js')),
			__memo(() => import('../output/server/nodes/16.js')),
			__memo(() => import('../output/server/nodes/17.js')),
			__memo(() => import('../output/server/nodes/18.js')),
			__memo(() => import('../output/server/nodes/19.js')),
			__memo(() => import('../output/server/nodes/20.js')),
			__memo(() => import('../output/server/nodes/21.js')),
			__memo(() => import('../output/server/nodes/22.js')),
			__memo(() => import('../output/server/nodes/23.js')),
			__memo(() => import('../output/server/nodes/24.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/admin",
				pattern: /^\/admin\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/admin/infra",
				pattern: /^\/admin\/infra\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/admin/media",
				pattern: /^\/admin\/media\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/admin/projects",
				pattern: /^\/admin\/projects\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/admin/repos",
				pattern: /^\/admin\/repos\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/api/logos/[...path]",
				pattern: /^\/api\/logos(?:\/([^]*))?\/?$/,
				params: [{"name":"path","optional":false,"rest":true,"chained":true}],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/logos/_...path_/_server.ts.js'))
			},
			{
				id: "/api/scan",
				pattern: /^\/api\/scan\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/scan/_server.ts.js'))
			},
			{
				id: "/deployments",
				pattern: /^\/deployments\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/design-system",
				pattern: /^\/design-system\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/design-system/colors",
				pattern: /^\/design-system\/colors\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/design-system/components",
				pattern: /^\/design-system\/components\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/design-system/data-display",
				pattern: /^\/design-system\/data-display\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/design-system/layout",
				pattern: /^\/design-system\/layout\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/design-system/typography",
				pattern: /^\/design-system\/typography\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/ecosystem",
				pattern: /^\/ecosystem\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/infrastructure/map",
				pattern: /^\/infrastructure\/map\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/infrastructure/settings",
				pattern: /^\/infrastructure\/settings\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 20 },
				endpoint: null
			},
			{
				id: "/logout",
				pattern: /^\/logout\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 21 },
				endpoint: null
			},
			{
				id: "/projects-infra",
				pattern: /^\/projects-infra\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 23 },
				endpoint: null
			},
			{
				id: "/projects",
				pattern: /^\/projects\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 22 },
				endpoint: null
			},
			{
				id: "/vastpuddle",
				pattern: /^\/vastpuddle\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 24 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

export const prerendered = new Set([]);

export const base_path = "";
