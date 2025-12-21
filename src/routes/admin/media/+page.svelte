<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import {
		Upload,
		Trash2,
		Image,
		Layers,
		Code,
		Server,
		Check,
		X
	} from '@lucide/svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let selectedFile = $state<File | null>(null);
	let isUploading = $state(false);
	let selectedItem = $state<{ type: 'infra' | 'techstack'; name: string } | null>(null);

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			selectedFile = input.files[0];
		}
	}

	function selectItem(type: 'infra' | 'techstack', name: string) {
		selectedItem = { type, name };
	}

	// Infrastructure providers with their services
	const infrastructureProviders = [
		{
			provider: 'cloudflare',
			displayName: 'Cloudflare',
			services: [
				{ name: 'cloudflare-pages', display: 'Pages' },
				{ name: 'cloudflare-r2', display: 'R2 Storage' },
				{ name: 'cloudflare-dns', display: 'DNS' },
				{ name: 'cloudflare-cdn', display: 'CDN' },
				{ name: 'cloudflare-workers', display: 'Workers' }
			]
		},
		{
			provider: 'flyio',
			displayName: 'Fly.io',
			services: [
				{ name: 'flyio', display: 'Hosting' },
				{ name: 'flyio-postgres', display: 'Postgres' }
			]
		},
		{
			provider: 'vercel',
			displayName: 'Vercel',
			services: [
				{ name: 'vercel', display: 'Hosting' },
				{ name: 'vercel-postgres', display: 'Postgres' },
				{ name: 'vercel-blob', display: 'Blob Storage' }
			]
		},
		{
			provider: 'netlify',
			displayName: 'Netlify',
			services: [
				{ name: 'netlify', display: 'Hosting' },
				{ name: 'netlify-functions', display: 'Functions' }
			]
		},
		{
			provider: 'supabase',
			displayName: 'Supabase',
			services: [
				{ name: 'supabase-database', display: 'Database' },
				{ name: 'supabase-auth', display: 'Auth' },
				{ name: 'supabase-storage', display: 'Storage' },
				{ name: 'supabase-realtime', display: 'Realtime' },
				{ name: 'supabase-edge', display: 'Edge Functions' }
			]
		},
		{
			provider: 'planetscale',
			displayName: 'PlanetScale',
			services: [{ name: 'planetscale', display: 'Database' }]
		},
		{
			provider: 'neon',
			displayName: 'Neon',
			services: [{ name: 'neon', display: 'Postgres' }]
		},
		{
			provider: 'aws',
			displayName: 'AWS',
			services: [
				{ name: 'aws-s3', display: 'S3' },
				{ name: 'aws-route53', display: 'Route53' },
				{ name: 'aws-lambda', display: 'Lambda' },
				{ name: 'aws-cloudfront', display: 'CloudFront' }
			]
		},
		{
			provider: 'github',
			displayName: 'GitHub',
			services: [
				{ name: 'github-actions', display: 'Actions' },
				{ name: 'github-pages', display: 'Pages' }
			]
		},
		{
			provider: 'auth0',
			displayName: 'Auth0',
			services: [{ name: 'auth0', display: 'Auth' }]
		},
		{
			provider: 'clerk',
			displayName: 'Clerk',
			services: [{ name: 'clerk', display: 'Auth' }]
		},
		{
			provider: 'sentry',
			displayName: 'Sentry',
			services: [{ name: 'sentry', display: 'Error Tracking' }]
		},
		{
			provider: 'logrocket',
			displayName: 'LogRocket',
			services: [{ name: 'logrocket', display: 'Session Replay' }]
		},
		{
			provider: 'resend',
			displayName: 'Resend',
			services: [{ name: 'resend', display: 'Email' }]
		},
		{
			provider: 'sendgrid',
			displayName: 'SendGrid',
			services: [{ name: 'sendgrid', display: 'Email' }]
		},
		{
			provider: 'postmark',
			displayName: 'Postmark',
			services: [{ name: 'postmark', display: 'Email' }]
		},
		{
			provider: 'plausible',
			displayName: 'Plausible',
			services: [{ name: 'plausible', display: 'Analytics' }]
		},
		{
			provider: 'posthog',
			displayName: 'PostHog',
			services: [{ name: 'posthog', display: 'Analytics' }]
		},
		{
			provider: 'doppler',
			displayName: 'Doppler',
			services: [{ name: 'doppler', display: 'Secrets' }]
		}
	];

	// Tech stack items by category
	const techStackCategories = [
		{
			category: 'Frameworks',
			items: [
				{ name: 'sveltekit', display: 'SvelteKit' },
				{ name: 'svelte', display: 'Svelte' },
				{ name: 'nextjs', display: 'Next.js' },
				{ name: 'react', display: 'React' },
				{ name: 'angular', display: 'Angular' },
				{ name: 'nuxt', display: 'Nuxt' },
				{ name: 'vue', display: 'Vue' },
				{ name: 'astro', display: 'Astro' },
				{ name: 'nodejs', display: 'Node.js' },
				{ name: 'express', display: 'Express' }
			]
		},
		{
			category: 'CSS & Styling',
			items: [
				{ name: 'tailwind', display: 'Tailwind CSS' },
				{ name: 'skeleton', display: 'Skeleton UI' },
				{ name: 'daisyui', display: 'DaisyUI' },
				{ name: 'bootstrap', display: 'Bootstrap' },
				{ name: 'bulma', display: 'Bulma' },
				{ name: 'angular-material', display: 'Angular Material' },
				{ name: 'styled-components', display: 'Styled Components' },
				{ name: 'sass', display: 'Sass/SCSS' }
			]
		},
		{
			category: 'Testing',
			items: [
				{ name: 'playwright', display: 'Playwright' },
				{ name: 'cypress', display: 'Cypress' },
				{ name: 'vitest', display: 'Vitest' },
				{ name: 'jest', display: 'Jest' },
				{ name: 'mocha', display: 'Mocha' }
			]
		},
		{
			category: 'Build Tools',
			items: [
				{ name: 'vite', display: 'Vite' },
				{ name: 'webpack', display: 'Webpack' },
				{ name: 'esbuild', display: 'esbuild' },
				{ name: 'rollup', display: 'Rollup' },
				{ name: 'turbopack', display: 'Turbopack' }
			]
		},
		{
			category: 'Package Managers',
			items: [
				{ name: 'npm', display: 'npm' },
				{ name: 'pnpm', display: 'pnpm' },
				{ name: 'yarn', display: 'Yarn' },
				{ name: 'bun', display: 'Bun' }
			]
		},
		{
			category: 'Icons',
			items: [
				{ name: 'lucide', display: 'Lucide' },
				{ name: 'heroicons', display: 'Heroicons' },
				{ name: 'fontawesome', display: 'Font Awesome' },
				{ name: 'tabler', display: 'Tabler Icons' }
			]
		},
		{
			category: 'Languages',
			items: [
				{ name: 'typescript', display: 'TypeScript' },
				{ name: 'javascript', display: 'JavaScript' },
				{ name: 'python', display: 'Python' },
				{ name: 'go', display: 'Go' },
				{ name: 'rust', display: 'Rust' }
			]
		}
	];

	// Get existing logo names for highlighting uploaded items
	const existingLogoNames = $derived(new Set(data.logos?.map((l) => l.name.replace(/\.(svg|png)$/, '')) ?? []));
</script>

<div class="p-6 space-y-8">
	<div>
		<h2 class="text-xl font-semibold text-white">Media Library</h2>
		<p class="text-gray-400 text-sm mt-1">Upload and manage logos for services and tech stack</p>
	</div>

	<!-- Success/Error Messages -->
	{#if form?.success}
		<div class="p-4 bg-green-900/50 border border-green-700 rounded-lg flex items-center gap-3">
			<Check class="w-5 h-5 text-green-400" />
			<span class="text-green-300">{form.message}</span>
		</div>
	{/if}
	{#if form?.error}
		<div class="p-4 bg-red-900/50 border border-red-700 rounded-lg flex items-center gap-3">
			<X class="w-5 h-5 text-red-400" />
			<span class="text-red-300">{form.error}</span>
		</div>
	{/if}

	<!-- Upload Section -->
	{#if selectedItem}
		<section class="bg-gray-800 rounded-lg p-6">
			<h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
				<Upload class="w-5 h-5 text-blue-400" />
				Upload Logo: {selectedItem.name}
			</h3>
			<p class="text-gray-400 text-sm mb-4">
				Uploading to: <code class="bg-gray-700 px-2 py-1 rounded">{selectedItem.type}/{selectedItem.name}.svg</code>
			</p>

			<form
				method="POST"
				action="?/uploadLogo"
				enctype="multipart/form-data"
				use:enhance={() => {
					isUploading = true;
					return async ({ update }) => {
						await update();
						isUploading = false;
						selectedFile = null;
						selectedItem = null;
					};
				}}
			>
				<input type="hidden" name="type" value={selectedItem.type} />
				<input type="hidden" name="filename" value={selectedItem.name} />

				<div
					class="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors"
				>
					<input
						type="file"
						name="logo"
						accept=".svg,.png"
						onchange={handleFileSelect}
						class="hidden"
						id="logo-upload"
					/>
					<label for="logo-upload" class="cursor-pointer">
						<Upload class="w-12 h-12 mx-auto text-gray-500 mb-4" />
						{#if selectedFile}
							<p class="text-white font-medium">{selectedFile.name}</p>
							<p class="text-gray-500 text-sm mt-1">Click to change or drop a new file</p>
						{:else}
							<p class="text-gray-300">Click to upload or drag and drop</p>
							<p class="text-gray-500 text-sm mt-1">SVG or PNG (max 1MB)</p>
						{/if}
					</label>
				</div>

				<div class="mt-4 flex justify-between">
					<button
						type="button"
						onclick={() => { selectedItem = null; selectedFile = null; }}
						class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
					>
						Cancel
					</button>
					{#if selectedFile}
						<button
							type="submit"
							disabled={isUploading}
							class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed rounded-lg transition-colors"
						>
							<Upload class="w-4 h-4" />
							{isUploading ? 'Uploading...' : 'Upload Logo'}
						</button>
					{/if}
				</div>
			</form>
		</section>
	{/if}

	<!-- Infrastructure Section -->
	<section class="bg-gray-800 rounded-lg p-6">
		<h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
			<Server class="w-5 h-5 text-blue-400" />
			Infrastructure
		</h3>
		<p class="text-gray-400 text-sm mb-6">
			Click an item to upload its logo. Items with a green dot already have logos.
		</p>

		<div class="space-y-4">
			{#each infrastructureProviders as provider}
				<div class="border-b border-gray-700 pb-4 last:border-0 last:pb-0">
					<h4 class="text-sm font-medium text-gray-300 mb-2">{provider.displayName}</h4>
					<div class="flex flex-wrap gap-2">
						{#each provider.services as service}
							{@const hasLogo = existingLogoNames.has(service.name)}
							<button
								type="button"
								onclick={() => selectItem('infra', service.name)}
								class="relative px-3 py-1.5 text-sm rounded-lg transition-colors {selectedItem?.name === service.name
									? 'bg-blue-600 text-white'
									: hasLogo
										? 'bg-gray-600 text-gray-200 hover:bg-gray-500'
										: 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-gray-200'}"
							>
								{#if hasLogo}
									<span class="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
								{/if}
								{service.display}
							</button>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Tech Stack Section -->
	<section class="bg-gray-800 rounded-lg p-6">
		<h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
			<Code class="w-5 h-5 text-purple-400" />
			Tech Stack
		</h3>
		<p class="text-gray-400 text-sm mb-6">
			Click an item to upload its logo. Items with a green dot already have logos.
		</p>

		<div class="space-y-4">
			{#each techStackCategories as category}
				<div class="border-b border-gray-700 pb-4 last:border-0 last:pb-0">
					<h4 class="text-sm font-medium text-gray-300 mb-2">{category.category}</h4>
					<div class="flex flex-wrap gap-2">
						{#each category.items as item}
							{@const hasLogo = existingLogoNames.has(item.name)}
							<button
								type="button"
								onclick={() => selectItem('techstack', item.name)}
								class="relative px-3 py-1.5 text-sm rounded-lg transition-colors {selectedItem?.name === item.name
									? 'bg-purple-600 text-white'
									: hasLogo
										? 'bg-gray-600 text-gray-200 hover:bg-gray-500'
										: 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-gray-200'}"
							>
								{#if hasLogo}
									<span class="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
								{/if}
								{item.display}
							</button>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Existing Logos Section -->
	<section class="bg-gray-800 rounded-lg p-6">
		<h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
			<Layers class="w-5 h-5 text-purple-400" />
			Existing Logos
		</h3>

		{#if data.logos && data.logos.length > 0}
			<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
				{#each data.logos as logo}
					<div class="bg-gray-700 rounded-lg p-4 flex flex-col items-center gap-2 group relative">
						<img src={logo.url} alt={logo.name} class="w-12 h-12 object-contain" />
						<span class="text-sm text-gray-300 truncate max-w-full">{logo.name}</span>
						<span
							class="text-xs px-2 py-0.5 rounded {logo.type === 'infra'
								? 'bg-blue-900 text-blue-300'
								: 'bg-purple-900 text-purple-300'}"
						>
							{logo.type === 'infra' ? 'Infra' : 'Stack'}
						</span>
						<form method="POST" action="?/deleteLogo" class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
							<input type="hidden" name="logoId" value={logo.id} />
							<button
								type="submit"
								class="p-1 bg-red-600 hover:bg-red-700 rounded text-white"
								title="Delete logo"
							>
								<Trash2 class="w-3 h-3" />
							</button>
						</form>
					</div>
				{/each}
			</div>
		{:else}
			<div class="text-center py-8 text-gray-500">
				<Image class="w-12 h-12 mx-auto mb-3 opacity-50" />
				<p>No logos uploaded yet</p>
				<p class="text-sm">Click items above to upload logos</p>
			</div>
		{/if}
	</section>
</div>
