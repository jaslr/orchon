<script lang="ts">
	import type { CategoryProviders } from '$lib/config/infrastructure';
	import {
		Cloud,
		Database,
		Shield,
		HardDrive,
		Globe,
		GitBranch,
		AlertTriangle,
		Server
	} from '@lucide/svelte';

	interface Props {
		projects: { id: string; displayName: string; identity: string }[];
		categories: CategoryProviders[];
		selectedProvider: string | null;
		onProviderClick: (provider: string) => void;
	}

	let { projects, categories, selectedProvider, onProviderClick }: Props = $props();

	// Build project to providers mapping
	let projectProviders = $derived.by(() => {
		const map = new Map<string, Set<string>>();
		for (const project of projects) {
			map.set(project.id, new Set());
		}
		for (const cat of categories) {
			for (const provider of cat.providers) {
				for (const project of provider.projects) {
					map.get(project.id)?.add(provider.provider);
				}
			}
		}
		return map;
	});

	// Layout constants
	const PROJECT_START_X = 50;
	const PROJECT_SPACING = 28;
	const PROVIDER_START_X = 350;
	const CATEGORY_SPACING = 120;
	const PROVIDER_SPACING = 35;

	// Calculate project positions
	let projectPositions = $derived.by(() => {
		const positions = new Map<string, { x: number; y: number }>();
		let y = 30;
		for (const project of projects) {
			positions.set(project.id, { x: PROJECT_START_X, y });
			y += PROJECT_SPACING;
		}
		return positions;
	});

	// Calculate provider positions (grouped by category)
	let providerPositions = $derived.by(() => {
		const positions = new Map<string, { x: number; y: number; category: string }>();
		let x = PROVIDER_START_X;

		for (const cat of categories) {
			let y = 30;
			for (const provider of cat.providers) {
				positions.set(provider.provider, { x, y, category: cat.category });
				y += PROVIDER_SPACING;
			}
			x += CATEGORY_SPACING;
		}
		return positions;
	});

	// SVG dimensions
	let svgHeight = $derived(Math.max(projects.length * PROJECT_SPACING + 60, 300));
	let svgWidth = $derived(PROVIDER_START_X + categories.length * CATEGORY_SPACING + 50);

	// Provider display names
	const providerNames: Record<string, string> = {
		cloudflare: 'Cloudflare',
		flyio: 'Fly.io',
		supabase: 'Supabase',
		github: 'GitHub',
		sentry: 'Sentry',
		aws: 'AWS',
		vercel: 'Vercel',
		netlify: 'Netlify',
		google: 'Google',
		gcp: 'GCP'
	};

	// Provider colors
	const providerColorValues: Record<string, string> = {
		cloudflare: '#f97316',
		supabase: '#22c55e',
		sentry: '#a855f7',
		github: '#9ca3af',
		aws: '#eab308',
		vercel: '#ffffff',
		flyio: '#8b5cf6',
		google: '#3b82f6',
		gcp: '#3b82f6',
		netlify: '#14b8a6'
	};

	// Category icons
	const categoryIcons: Record<string, typeof Cloud> = {
		hosting: Cloud,
		database: Database,
		auth: Shield,
		storage: HardDrive,
		dns: Globe,
		ci: GitBranch,
		monitoring: AlertTriangle
	};

	function getProviderColor(provider: string): string {
		return providerColorValues[provider] || '#6b7280';
	}

	function getProviderName(provider: string): string {
		return providerNames[provider] || provider;
	}

	// Get logo URL for a provider
	function getLogoUrl(provider: string): string | null {
		const providersWithLogos = ['cloudflare', 'flyio', 'supabase', 'github', 'sentry', 'vercel', 'netlify'];
		if (providersWithLogos.includes(provider)) {
			return `/api/logos/infra/${provider}.svg`;
		}
		return null;
	}

	// Check if a connection should be highlighted
	function isConnectionHighlighted(projectId: string, provider: string): boolean {
		if (!selectedProvider) return false;
		return provider === selectedProvider && (projectProviders.get(projectId)?.has(provider) ?? false);
	}

	// Check if a connection should be dimmed
	function isConnectionDimmed(projectId: string, provider: string): boolean {
		if (!selectedProvider) return false;
		return provider !== selectedProvider || !(projectProviders.get(projectId)?.has(provider) ?? false);
	}

	// Hover state
	let hoveredProject = $state<string | null>(null);
	let hoveredProvider = $state<string | null>(null);

	function isProjectHighlighted(projectId: string): boolean {
		if (hoveredProject === projectId) return true;
		if (hoveredProvider && (projectProviders.get(projectId)?.has(hoveredProvider) ?? false)) return true;
		if (selectedProvider && (projectProviders.get(projectId)?.has(selectedProvider) ?? false)) return true;
		return false;
	}

	function isProviderHighlighted(provider: string): boolean {
		if (hoveredProvider === provider) return true;
		if (hoveredProject && (projectProviders.get(hoveredProject)?.has(provider) ?? false)) return true;
		if (selectedProvider === provider) return true;
		return false;
	}
</script>

<svg
	viewBox="0 0 {svgWidth} {svgHeight}"
	class="w-full h-full"
	style="min-height: {Math.min(svgHeight, 400)}px;"
>
	<defs>
		<style>
			@keyframes flowDash {
				to { stroke-dashoffset: -12; }
			}
			.flow-animated {
				stroke-dasharray: 4 4;
				animation: flowDash 0.8s linear infinite;
			}
		</style>
	</defs>

	<!-- Category labels -->
	{#each categories as cat, catIndex}
		{@const x = PROVIDER_START_X + catIndex * CATEGORY_SPACING}
		<text
			{x}
			y="15"
			text-anchor="start"
			class="text-[9px] fill-gray-500 uppercase tracking-wider font-medium"
		>
			{cat.category}
		</text>
	{/each}

	<!-- Connection lines -->
	{#each projects as project}
		{@const projectPos = projectPositions.get(project.id)}
		{@const providers = projectProviders.get(project.id)}
		{#if projectPos && providers}
			{#each [...providers] as provider}
				{@const providerPos = providerPositions.get(provider)}
				{#if providerPos}
					{@const highlighted = isConnectionHighlighted(project.id, provider) ||
						(hoveredProject === project.id && providers.has(provider)) ||
						(hoveredProvider === provider && providers.has(provider))}
					{@const dimmed = selectedProvider ? isConnectionDimmed(project.id, provider) : false}
					<path
						d="M {projectPos.x + 60} {projectPos.y}
						   C {projectPos.x + 150} {projectPos.y},
						     {providerPos.x - 80} {providerPos.y},
						     {providerPos.x - 12} {providerPos.y}"
						fill="none"
						stroke={highlighted ? getProviderColor(provider) : '#374151'}
						stroke-width={highlighted ? 1.5 : 0.5}
						opacity={dimmed ? 0.1 : highlighted ? 1 : 0.4}
						class={highlighted ? 'flow-animated' : ''}
					/>
				{/if}
			{/each}
		{/if}
	{/each}

	<!-- Project nodes (left side) -->
	{#each projects as project}
		{@const pos = projectPositions.get(project.id)}
		{@const highlighted = isProjectHighlighted(project.id)}
		{@const dimmed = selectedProvider && !projectProviders.get(project.id)?.has(selectedProvider)}
		{#if pos}
			<g
				transform="translate({pos.x}, {pos.y})"
				class="cursor-pointer"
				role="listitem"
				onmouseenter={() => hoveredProject = project.id}
				onmouseleave={() => hoveredProject = null}
				opacity={dimmed ? 0.2 : 1}
			>
				<circle
					cx="-8"
					cy="0"
					r="4"
					fill={highlighted ? '#3b82f6' : '#4b5563'}
					class="transition-colors"
				/>
				<text
					x="0"
					y="4"
					class="text-[10px] {highlighted ? 'fill-white' : 'fill-gray-400'} transition-colors"
				>
					{project.displayName.length > 12 ? project.displayName.slice(0, 11) + '..' : project.displayName}
				</text>
			</g>
		{/if}
	{/each}

	<!-- Provider nodes (right side) -->
	{#each categories as cat}
		{#each cat.providers as provider}
			{@const pos = providerPositions.get(provider.provider)}
			{@const highlighted = isProviderHighlighted(provider.provider)}
			{@const logoUrl = getLogoUrl(provider.provider)}
			{@const dimmed = selectedProvider && selectedProvider !== provider.provider}
			{#if pos}
				<g
					transform="translate({pos.x}, {pos.y})"
					class="cursor-pointer"
					role="button"
					tabindex="0"
					onclick={() => onProviderClick(provider.provider)}
					onkeydown={(e) => e.key === 'Enter' && onProviderClick(provider.provider)}
					onmouseenter={() => hoveredProvider = provider.provider}
					onmouseleave={() => hoveredProvider = null}
					opacity={dimmed ? 0.2 : 1}
				>
					<!-- Node background -->
					<circle
						cx="0"
						cy="0"
						r="12"
						fill="#1f2937"
						stroke={highlighted ? getProviderColor(provider.provider) : '#374151'}
						stroke-width={highlighted ? 2 : 1}
						class="transition-all"
					/>

					<!-- Logo or fallback -->
					{#if logoUrl}
						<image
							x="-8"
							y="-8"
							width="16"
							height="16"
							href={logoUrl}
							preserveAspectRatio="xMidYMid meet"
						/>
					{:else}
						<circle
							cx="0"
							cy="0"
							r="6"
							fill={getProviderColor(provider.provider)}
						/>
					{/if}

					<!-- Provider name -->
					<text
						x="18"
						y="4"
						class="text-[10px] {highlighted ? 'fill-white' : 'fill-gray-400'} transition-colors"
					>
						{getProviderName(provider.provider)}
					</text>

					<!-- Count badge -->
					<text
						x="18"
						y="14"
						class="text-[8px] fill-gray-500"
					>
						{provider.projects.length}
					</text>
				</g>
			{/if}
		{/each}
	{/each}
</svg>
