<script lang="ts">
	/**
	 * Bipartite Dependency Graph Visualization
	 *
	 * Source nodes (projects) on left vertical axis
	 * Target nodes (providers) on right vertical axis, grouped by category
	 * Edges represent "depends-on" relationships (M:N, no flow semantics)
	 *
	 * Provider node size/intensity encodes in-degree (vendor concentration risk)
	 */
	import type { CategoryProviders } from '$lib/config/infrastructure';

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

	// Flatten all providers with their in-degree and category
	let allProviders = $derived.by(() => {
		const providers: Array<{
			provider: string;
			category: string;
			inDegree: number;
			projects: { id: string; displayName: string }[];
		}> = [];

		for (const cat of categories) {
			for (const p of cat.providers) {
				providers.push({
					provider: p.provider,
					category: cat.category,
					inDegree: p.projects.length,
					projects: p.projects
				});
			}
		}
		return providers;
	});

	// Max in-degree for scaling
	let maxInDegree = $derived(Math.max(...allProviders.map(p => p.inDegree), 1));

	// Layout constants
	const LEFT_MARGIN = 20;
	const RIGHT_MARGIN = 120;
	const PROJECT_NODE_X = LEFT_MARGIN + 100;
	const PROVIDER_NODE_X = 500;
	const TOP_MARGIN = 40;
	const PROJECT_SPACING = 24;
	const PROVIDER_SPACING = 50;
	const CATEGORY_GAP = 25;
	const MIN_NODE_RADIUS = 8;
	const MAX_NODE_RADIUS = 22;

	// Category colors for grouping
	const categoryColors: Record<string, string> = {
		hosting: '#f97316',    // orange
		database: '#22c55e',   // green
		auth: '#eab308',       // yellow
		storage: '#ec4899',    // pink
		ci: '#6b7280',         // gray
		monitoring: '#ef4444', // red
		dns: '#06b6d4',        // cyan
		email: '#8b5cf6',      // purple
		analytics: '#3b82f6',  // blue
		cdn: '#14b8a6',        // teal
		secrets: '#a855f7'     // violet
	};

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

	// Calculate project positions (left side, simple vertical list)
	let projectPositions = $derived.by(() => {
		const positions = new Map<string, { x: number; y: number }>();
		let y = TOP_MARGIN;
		for (const project of projects) {
			positions.set(project.id, { x: PROJECT_NODE_X, y });
			y += PROJECT_SPACING;
		}
		return positions;
	});

	// Calculate provider positions (right side, grouped by category)
	let providerPositions = $derived.by(() => {
		const positions = new Map<string, { x: number; y: number; category: string; inDegree: number }>();
		let y = TOP_MARGIN;
		let currentCategory = '';

		for (const p of allProviders) {
			// Add category gap when category changes
			if (p.category !== currentCategory) {
				if (currentCategory !== '') {
					y += CATEGORY_GAP;
				}
				currentCategory = p.category;
			}

			positions.set(p.provider, {
				x: PROVIDER_NODE_X,
				y,
				category: p.category,
				inDegree: p.inDegree
			});
			y += PROVIDER_SPACING;
		}
		return positions;
	});

	// Calculate node radius based on in-degree
	function getNodeRadius(inDegree: number): number {
		const normalized = inDegree / maxInDegree;
		return MIN_NODE_RADIUS + (MAX_NODE_RADIUS - MIN_NODE_RADIUS) * normalized;
	}

	// Calculate opacity/intensity based on in-degree
	function getNodeIntensity(inDegree: number): number {
		const normalized = inDegree / maxInDegree;
		return 0.4 + 0.6 * normalized; // Range: 0.4 to 1.0
	}

	// SVG dimensions
	let svgHeight = $derived.by(() => {
		const projectHeight = projects.length * PROJECT_SPACING + TOP_MARGIN + 40;
		let providerHeight = TOP_MARGIN;
		let currentCategory = '';
		for (const p of allProviders) {
			if (p.category !== currentCategory && currentCategory !== '') {
				providerHeight += CATEGORY_GAP;
			}
			currentCategory = p.category;
			providerHeight += PROVIDER_SPACING;
		}
		providerHeight += 40;
		return Math.max(projectHeight, providerHeight, 300);
	});

	const svgWidth = PROVIDER_NODE_X + RIGHT_MARGIN;

	function getProviderName(provider: string): string {
		return providerNames[provider] || provider;
	}

	function getCategoryColor(category: string): string {
		return categoryColors[category] || '#6b7280';
	}

	// Get logo URL for a provider
	function getLogoUrl(provider: string): string | null {
		const providersWithLogos = ['cloudflare', 'flyio', 'supabase', 'github', 'sentry', 'vercel', 'netlify'];
		if (providersWithLogos.includes(provider)) {
			return `/api/logos/infra/${provider}.svg`;
		}
		return null;
	}

	// Hover state
	let hoveredProject = $state<string | null>(null);
	let hoveredProvider = $state<string | null>(null);

	// Check if edge should be highlighted
	function isEdgeHighlighted(projectId: string, provider: string): boolean {
		if (selectedProvider === provider) return true;
		if (hoveredProvider === provider) return true;
		if (hoveredProject === projectId && (projectProviders.get(projectId)?.has(provider) ?? false)) return true;
		return false;
	}

	// Check if edge should be dimmed
	function isEdgeDimmed(projectId: string, provider: string): boolean {
		if (!selectedProvider && !hoveredProject && !hoveredProvider) return false;

		if (selectedProvider) {
			return provider !== selectedProvider;
		}
		if (hoveredProvider) {
			return provider !== hoveredProvider;
		}
		if (hoveredProject) {
			return !(projectProviders.get(hoveredProject)?.has(provider) ?? false);
		}
		return false;
	}

	// Check if project node should be highlighted
	function isProjectHighlighted(projectId: string): boolean {
		if (hoveredProject === projectId) return true;
		if (hoveredProvider && (projectProviders.get(projectId)?.has(hoveredProvider) ?? false)) return true;
		if (selectedProvider && (projectProviders.get(projectId)?.has(selectedProvider) ?? false)) return true;
		return false;
	}

	// Check if project should be dimmed
	function isProjectDimmed(projectId: string): boolean {
		if (selectedProvider && !(projectProviders.get(projectId)?.has(selectedProvider) ?? false)) return true;
		if (hoveredProvider && !(projectProviders.get(projectId)?.has(hoveredProvider) ?? false)) return true;
		return false;
	}

	// Check if provider node should be highlighted
	function isProviderHighlighted(provider: string): boolean {
		if (hoveredProvider === provider) return true;
		if (selectedProvider === provider) return true;
		if (hoveredProject && (projectProviders.get(hoveredProject)?.has(provider) ?? false)) return true;
		return false;
	}

	// Check if provider should be dimmed
	function isProviderDimmed(provider: string): boolean {
		if (selectedProvider && selectedProvider !== provider) return true;
		if (hoveredProvider && hoveredProvider !== provider) return true;
		if (hoveredProject && !(projectProviders.get(hoveredProject)?.has(provider) ?? false)) return true;
		return false;
	}

	// Generate curved edge path with slight bundling effect
	function getEdgePath(projectId: string, provider: string): string {
		const projectPos = projectPositions.get(projectId);
		const providerPos = providerPositions.get(provider);

		if (!projectPos || !providerPos) return '';

		const x1 = projectPos.x + 8; // Right edge of project node
		const y1 = projectPos.y;
		const x2 = providerPos.x - getNodeRadius(providerPos.inDegree) - 2; // Left edge of provider node
		const y2 = providerPos.y;

		// Control points for bezier curve
		const midX = (x1 + x2) / 2;

		// Slight vertical offset based on edge density to reduce overlap
		const yDiff = y2 - y1;
		const curveFactor = Math.min(Math.abs(yDiff) * 0.3, 80);

		return `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
	}

	// Get category labels with positions
	let categoryLabels = $derived.by(() => {
		const labels: Array<{ category: string; y: number }> = [];
		let currentCategory = '';

		for (const p of allProviders) {
			if (p.category !== currentCategory) {
				const pos = providerPositions.get(p.provider);
				if (pos) {
					labels.push({ category: p.category, y: pos.y - 20 });
				}
				currentCategory = p.category;
			}
		}
		return labels;
	});
</script>

<svg
	viewBox="0 0 {svgWidth} {svgHeight}"
	class="w-full h-full"
	style="min-height: {Math.min(svgHeight, 450)}px;"
>
	<defs>
		<!-- Gradient for high-degree nodes -->
		{#each allProviders as p}
			{@const color = getCategoryColor(p.category)}
			<radialGradient id="grad-{p.provider}" cx="30%" cy="30%">
				<stop offset="0%" stop-color="{color}" stop-opacity="0.9" />
				<stop offset="100%" stop-color="{color}" stop-opacity="0.4" />
			</radialGradient>
		{/each}
	</defs>

	<!-- Axis labels -->
	<text x="{PROJECT_NODE_X}" y="18" text-anchor="middle" class="text-[10px] fill-gray-500 uppercase tracking-wider font-semibold">
		Projects
	</text>
	<text x="{PROVIDER_NODE_X}" y="18" text-anchor="middle" class="text-[10px] fill-gray-500 uppercase tracking-wider font-semibold">
		Providers
	</text>

	<!-- Category labels on right side -->
	{#each categoryLabels as label}
		<text
			x="{PROVIDER_NODE_X + 50}"
			y="{label.y + 5}"
			text-anchor="start"
			class="text-[8px] uppercase tracking-wider font-medium"
			fill="{getCategoryColor(label.category)}"
			opacity="0.7"
		>
			{label.category}
		</text>
	{/each}

	<!-- Dependency edges -->
	{#each projects as project}
		{@const providers = projectProviders.get(project.id)}
		{#if providers}
			{#each [...providers] as provider}
				{@const providerPos = providerPositions.get(provider)}
				{@const highlighted = isEdgeHighlighted(project.id, provider)}
				{@const dimmed = isEdgeDimmed(project.id, provider)}
				{#if providerPos}
					<path
						d={getEdgePath(project.id, provider)}
						fill="none"
						stroke={highlighted ? getCategoryColor(providerPos.category) : '#374151'}
						stroke-width={highlighted ? 2 : 1}
						opacity={dimmed ? 0.08 : highlighted ? 0.9 : 0.25}
						class="transition-all duration-150"
					/>
				{/if}
			{/each}
		{/if}
	{/each}

	<!-- Project nodes (left side - source nodes) -->
	{#each projects as project}
		{@const pos = projectPositions.get(project.id)}
		{@const highlighted = isProjectHighlighted(project.id)}
		{@const dimmed = isProjectDimmed(project.id)}
		{#if pos}
			<g
				transform="translate({pos.x}, {pos.y})"
				class="cursor-pointer"
				role="listitem"
				onmouseenter={() => hoveredProject = project.id}
				onmouseleave={() => hoveredProject = null}
				opacity={dimmed ? 0.15 : 1}
			>
				<!-- Project node -->
				<circle
					cx="0"
					cy="0"
					r="6"
					fill={highlighted ? '#3b82f6' : '#4b5563'}
					stroke={highlighted ? '#60a5fa' : 'transparent'}
					stroke-width="2"
					class="transition-all duration-150"
				/>
				<!-- Project label (left of node) -->
				<text
					x="-12"
					y="4"
					text-anchor="end"
					class="text-[10px] {highlighted ? 'fill-white font-medium' : 'fill-gray-400'} transition-colors"
				>
					{project.displayName.length > 18 ? project.displayName.slice(0, 17) + '..' : project.displayName}
				</text>
			</g>
		{/if}
	{/each}

	<!-- Provider nodes (right side - target nodes) -->
	{#each allProviders as p}
		{@const pos = providerPositions.get(p.provider)}
		{@const highlighted = isProviderHighlighted(p.provider)}
		{@const dimmed = isProviderDimmed(p.provider)}
		{@const radius = getNodeRadius(p.inDegree)}
		{@const intensity = getNodeIntensity(p.inDegree)}
		{@const logoUrl = getLogoUrl(p.provider)}
		{#if pos}
			<g
				transform="translate({pos.x}, {pos.y})"
				class="cursor-pointer"
				role="button"
				tabindex="0"
				onclick={() => onProviderClick(p.provider)}
				onkeydown={(e) => e.key === 'Enter' && onProviderClick(p.provider)}
				onmouseenter={() => hoveredProvider = p.provider}
				onmouseleave={() => hoveredProvider = null}
				opacity={dimmed ? 0.15 : 1}
			>
				<!-- Node circle - size reflects in-degree (vendor concentration risk) -->
				<circle
					cx="0"
					cy="0"
					r={radius}
					fill="url(#grad-{p.provider})"
					stroke={highlighted ? getCategoryColor(p.category) : '#374151'}
					stroke-width={highlighted ? 3 : 1.5}
					opacity={intensity}
					class="transition-all duration-150"
				/>

				<!-- Inner glow for high-degree nodes -->
				{#if p.inDegree > maxInDegree * 0.5}
					<circle
						cx="0"
						cy="0"
						r={radius - 3}
						fill="none"
						stroke={getCategoryColor(p.category)}
						stroke-width="1"
						opacity="0.4"
					/>
				{/if}

				<!-- Logo or provider initial -->
				{#if logoUrl}
					<image
						x={-radius * 0.55}
						y={-radius * 0.55}
						width={radius * 1.1}
						height={radius * 1.1}
						href={logoUrl}
						preserveAspectRatio="xMidYMid meet"
					/>
				{:else}
					<text
						x="0"
						y="4"
						text-anchor="middle"
						class="text-[10px] fill-white font-bold"
					>
						{p.provider.charAt(0).toUpperCase()}
					</text>
				{/if}

				<!-- Provider name (right of node) -->
				<text
					x={radius + 8}
					y="0"
					text-anchor="start"
					dominant-baseline="middle"
					class="text-[11px] {highlighted ? 'fill-white font-medium' : 'fill-gray-300'} transition-colors"
				>
					{getProviderName(p.provider)}
				</text>

				<!-- Dependency count badge - key analytical output -->
				<g transform="translate({radius + 8}, 12)">
					<text
						x="0"
						y="0"
						text-anchor="start"
						class="text-[9px] font-semibold"
						fill={getCategoryColor(p.category)}
					>
						{p.inDegree} {p.inDegree === 1 ? 'project' : 'projects'}
					</text>
				</g>

				<!-- Risk indicator for high-concentration vendors -->
				{#if p.inDegree >= Math.ceil(projects.length * 0.5)}
					<g transform="translate({-radius - 6}, {-radius + 4})">
						<circle cx="0" cy="0" r="4" fill="#ef4444" />
						<text x="0" y="3" text-anchor="middle" class="text-[6px] fill-white font-bold">!</text>
					</g>
				{/if}
			</g>
		{/if}
	{/each}

	<!-- Legend -->
	<g transform="translate(20, {svgHeight - 50})">
		<text x="0" y="0" class="text-[8px] fill-gray-500 uppercase tracking-wider">Vendor Risk</text>
		<g transform="translate(0, 12)">
			<circle cx="6" cy="0" r="4" fill="#4b5563" />
			<text x="16" y="3" class="text-[8px] fill-gray-400">Low (1-2 projects)</text>
		</g>
		<g transform="translate(0, 26)">
			<circle cx="6" cy="0" r="8" fill="#6b7280" />
			<text x="20" y="3" class="text-[8px] fill-gray-400">Medium</text>
		</g>
		<g transform="translate(80, 12)">
			<circle cx="10" cy="0" r="12" fill="#9ca3af" />
			<circle cx="0" cy="-6" r="4" fill="#ef4444" />
			<text x="-2" y="-3" class="text-[6px] fill-white font-bold">!</text>
			<text x="28" y="3" class="text-[8px] fill-gray-400">High (50%+ projects)</text>
		</g>
	</g>
</svg>
