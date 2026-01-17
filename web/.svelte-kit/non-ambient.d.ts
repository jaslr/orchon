
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/admin" | "/admin/infra" | "/admin/media" | "/admin/projects" | "/admin/repos" | "/api" | "/api/logos" | "/api/logos/[...path]" | "/api/scan" | "/deployments" | "/design-system" | "/design-system/colors" | "/design-system/components" | "/design-system/data-display" | "/design-system/layout" | "/design-system/typography" | "/ecosystem" | "/infrastructure" | "/infrastructure/map" | "/infrastructure/settings" | "/login" | "/logout" | "/projects-infra" | "/projects" | "/vastpuddle";
		RouteParams(): {
			"/api/logos/[...path]": { path: string }
		};
		LayoutParams(): {
			"/": { path?: string };
			"/admin": Record<string, never>;
			"/admin/infra": Record<string, never>;
			"/admin/media": Record<string, never>;
			"/admin/projects": Record<string, never>;
			"/admin/repos": Record<string, never>;
			"/api": { path?: string };
			"/api/logos": { path?: string };
			"/api/logos/[...path]": { path: string };
			"/api/scan": Record<string, never>;
			"/deployments": Record<string, never>;
			"/design-system": Record<string, never>;
			"/design-system/colors": Record<string, never>;
			"/design-system/components": Record<string, never>;
			"/design-system/data-display": Record<string, never>;
			"/design-system/layout": Record<string, never>;
			"/design-system/typography": Record<string, never>;
			"/ecosystem": Record<string, never>;
			"/infrastructure": Record<string, never>;
			"/infrastructure/map": Record<string, never>;
			"/infrastructure/settings": Record<string, never>;
			"/login": Record<string, never>;
			"/logout": Record<string, never>;
			"/projects-infra": Record<string, never>;
			"/projects": Record<string, never>;
			"/vastpuddle": Record<string, never>
		};
		Pathname(): "/" | "/admin" | "/admin/" | "/admin/infra" | "/admin/infra/" | "/admin/media" | "/admin/media/" | "/admin/projects" | "/admin/projects/" | "/admin/repos" | "/admin/repos/" | "/api" | "/api/" | "/api/logos" | "/api/logos/" | `/api/logos/${string}` & {} | `/api/logos/${string}/` & {} | "/api/scan" | "/api/scan/" | "/deployments" | "/deployments/" | "/design-system" | "/design-system/" | "/design-system/colors" | "/design-system/colors/" | "/design-system/components" | "/design-system/components/" | "/design-system/data-display" | "/design-system/data-display/" | "/design-system/layout" | "/design-system/layout/" | "/design-system/typography" | "/design-system/typography/" | "/ecosystem" | "/ecosystem/" | "/infrastructure" | "/infrastructure/" | "/infrastructure/map" | "/infrastructure/map/" | "/infrastructure/settings" | "/infrastructure/settings/" | "/login" | "/login/" | "/logout" | "/logout/" | "/projects-infra" | "/projects-infra/" | "/projects" | "/projects/" | "/vastpuddle" | "/vastpuddle/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.svg" | "/icons/apple-touch-icon.png" | "/icons/icon-192.png" | "/icons/icon-512.png" | "/icons/icon-maskable-512.png" | "/logo.svg" | "/logos/infra/aws.svg" | "/logos/infra/cloudflare.svg" | "/logos/infra/digitalocean.svg" | "/logos/infra/firebase.svg" | "/logos/infra/flyio.svg" | "/logos/infra/github.svg" | "/logos/infra/mailgun.svg" | "/logos/infra/netlify.svg" | "/logos/infra/resend.svg" | "/logos/infra/sentry.svg" | "/logos/infra/supabase.svg" | "/logos/infra/twilio.svg" | "/logos/infra/vercel.svg" | "/logos/techstack/angular.svg" | "/logos/techstack/bun.svg" | "/logos/techstack/lucide.svg" | "/logos/techstack/nextjs.svg" | "/logos/techstack/nodejs.svg" | "/logos/techstack/npm.svg" | "/logos/techstack/playwright.svg" | "/logos/techstack/pnpm.svg" | "/logos/techstack/react.svg" | "/logos/techstack/svelte.svg" | "/logos/techstack/sveltekit.svg" | "/logos/techstack/tailwind.svg" | "/logos/techstack/typescript.svg" | "/logos/techstack/vite.svg" | "/logos/techstack/vitest.svg" | "/manifest.json" | "/robots.txt" | "/sw.js" | string & {};
	}
}