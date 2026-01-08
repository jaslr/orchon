<script lang="ts">
	import type { PageData } from './$types';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { zoom, zoomIdentity } from 'd3-zoom';
	import { select } from 'd3-selection';
	import {
		ZoomIn,
		ZoomOut,
		ArrowUpAZ,
		ArrowDownZA,
		Maximize2
	} from '@lucide/svelte';

	let { data }: { data: PageData } = $props();

	// Sorting
	let sortAsc = $state(true);
	let sortedProjects = $derived(
		sortAsc
			? [...data.projects].sort((a, b) => a.displayName.localeCompare(b.displayName))
			: [...data.projects].sort((a, b) => b.displayName.localeCompare(a.displayName))
	);

	// SVG refs
	let svgRef: SVGSVGElement;
	let gRef: SVGGElement;
	let currentZoom = $state(1);
	let zoomBehavior: ReturnType<typeof zoom<SVGSVGElement, unknown>> | null = null;

	// Grid config - 4 columns
	const COLS = 4;
	const CARD_WIDTH = 300;
	const CARD_HEIGHT = 340;
	const GAP = 40;
	const PADDING = 50;

	// Provider colors
	const providerColors: Record<string, string> = {
		cloudflare: '#f38020',
		supabase: '#3ecf8e',
		flyio: '#7c3aed',
		firebase: '#ffca28',
		gcp: '#4285f4',
		github: '#6e7681',
		pocketbase: '#b8dbe4',
		sentry: '#362d59',
		vercel: '#000000',
		netlify: '#00c7b7',
		resend: '#000000',
		sendgrid: '#1a82e2',
		mailgun: '#f06b66',
		digitalocean: '#0080ff',
	};

	// Category labels and icons (using unicode for SVG)
	function getCategoryLabel(category: string): string {
		const labels: Record<string, string> = {
			hosting: 'Host',
			database: 'DB',
			auth: 'Auth',
			storage: 'Store',
			ci: 'CI/CD',
			monitoring: 'Monitor',
			dns: 'DNS',
			email: 'Email',
		};
		return labels[category] || category;
	}

	function getCategoryIcon(category: string): string {
		const icons: Record<string, string> = {
			hosting: '\u2601', // cloud
			database: '\u{1F5C4}', // file cabinet / cylinder-ish
			auth: '\u{1F6E1}', // shield
			storage: '\u{1F4BE}', // floppy
			ci: '\u2699', // gear
			monitoring: '\u{1F4CA}', // chart
			dns: '\u{1F310}', // globe
			email: '\u2709', // envelope
		};
		return icons[category] || '\u25CF';
	}

	// Identity colors
	const identityColors: Record<string, string> = {
		jaslr: '#3b82f6',
		'jvp-ux': '#8b5cf6',
	};

	// Get hosting provider
	function getHostingProvider(services: typeof data.projects[0]['services']): string {
		const hosting = services.find(s => s.category === 'hosting');
		return hosting?.provider || 'unknown';
	}

	// Get display URL
	function getDisplayUrl(url: string): string {
		try {
			return new URL(url).hostname;
		} catch {
			return url;
		}
	}

	// Calculate positions
	let rows = $derived(Math.ceil(sortedProjects.length / COLS));
	let canvasWidth = $derived(COLS * CARD_WIDTH + (COLS - 1) * GAP + PADDING * 2);
	let canvasHeight = $derived(rows * CARD_HEIGHT + (rows - 1) * GAP + PADDING * 2);

	function getCardPosition(index: number) {
		const col = index % COLS;
		const row = Math.floor(index / COLS);
		return {
			x: PADDING + col * (CARD_WIDTH + GAP),
			y: PADDING + row * (CARD_HEIGHT + GAP),
		};
	}

	// Initialize d3-zoom
	onMount(() => {
		if (!browser || !svgRef || !gRef) return;

		const svg = select(svgRef);

		zoomBehavior = zoom<SVGSVGElement, unknown>()
			.scaleExtent([0.25, 4])
			.on('zoom', (event) => {
				select(gRef).attr('transform', event.transform.toString());
				currentZoom = event.transform.k;
			});

		svg.call(zoomBehavior);

		// Set initial transform
		svg.call(zoomBehavior.transform, zoomIdentity.translate(20, 20));
	});

	// Zoom controls
	function zoomIn() {
		if (zoomBehavior && svgRef) {
			select(svgRef).transition().duration(200).call(zoomBehavior.scaleBy, 1.3);
		}
	}

	function zoomOut() {
		if (zoomBehavior && svgRef) {
			select(svgRef).transition().duration(200).call(zoomBehavior.scaleBy, 0.7);
		}
	}

	function resetView() {
		if (zoomBehavior && svgRef) {
			select(svgRef).transition().duration(300).call(
				zoomBehavior.transform,
				zoomIdentity.translate(20, 20).scale(1)
			);
		}
	}

	// Handle link clicks (prevent zoom/pan interference)
	function handleLinkClick(e: MouseEvent, url: string) {
		e.stopPropagation();
		window.open(url, '_blank', 'noopener,noreferrer');
	}
</script>

<svelte:head>
	<title>Infrastructure Map | Orchon</title>
</svelte:head>

<div class="h-full flex flex-col bg-gray-950 overflow-hidden">
	<!-- Controls -->
	<div class="shrink-0 flex items-center justify-between px-4 py-2 bg-gray-900/80 border-b border-gray-800 backdrop-blur-sm z-10">
		<div class="flex items-center gap-4">
			<h1 class="text-lg font-semibold text-white">Infrastructure Map</h1>
			<span class="text-xs text-gray-500">{sortedProjects.length} projects</span>
			<span class="text-xs text-gray-600">|</span>
			<span class="text-xs text-gray-500">Data: <code class="text-gray-400">lib/config/infrastructure.ts</code></span>
		</div>
		<div class="flex items-center gap-2">
			<!-- Sort toggle -->
			<button
				onclick={() => sortAsc = !sortAsc}
				class="flex items-center gap-1.5 px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 transition-colors"
				title={sortAsc ? 'Sort Z-A' : 'Sort A-Z'}
			>
				{#if sortAsc}
					<ArrowUpAZ class="w-3.5 h-3.5" />
				{:else}
					<ArrowDownZA class="w-3.5 h-3.5" />
				{/if}
				Sort
			</button>
			<!-- Zoom controls -->
			<div class="flex items-center gap-1 ml-2">
				<button
					onclick={zoomOut}
					class="p-1.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-300 transition-colors"
					title="Zoom out"
				>
					<ZoomOut class="w-4 h-4" />
				</button>
				<span class="text-xs text-gray-400 w-12 text-center">{Math.round(currentZoom * 100)}%</span>
				<button
					onclick={zoomIn}
					class="p-1.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-300 transition-colors"
					title="Zoom in"
				>
					<ZoomIn class="w-4 h-4" />
				</button>
				<button
					onclick={resetView}
					class="p-1.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-300 transition-colors ml-1"
					title="Reset view"
				>
					<Maximize2 class="w-4 h-4" />
				</button>
			</div>
		</div>
	</div>

	<!-- Hint -->
	<div class="shrink-0 px-4 py-1 text-xs text-gray-500 bg-gray-900/50">
		Scroll to zoom | Drag to pan | Click links to open dashboards
	</div>

	<!-- SVG Canvas -->
	<div class="flex-1 overflow-hidden relative bg-gray-950">
		<svg
			bind:this={svgRef}
			class="w-full h-full"
			style="cursor: grab;"
		>
			<!-- Defs for patterns and filters -->
			<defs>
				<!-- Grid pattern -->
				<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
					<path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(55, 65, 81, 0.3)" stroke-width="0.5"/>
				</pattern>
				<!-- Card shadow filter -->
				<filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
					<feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="rgba(0,0,0,0.5)"/>
				</filter>
			</defs>

			<!-- Background grid (fixed, doesn't zoom) -->
			<rect width="100%" height="100%" fill="url(#grid)" />

			<!-- Zoomable content group -->
			<g bind:this={gRef}>
				{#each sortedProjects as project, index (project.id)}
					{@const pos = getCardPosition(index)}
					{@const identityColor = identityColors[project.identity] || '#6b7280'}
					{@const hostProvider = getHostingProvider(project.services)}
					{@const hostColor = providerColors[hostProvider] || '#6b7280'}

					<!-- Card container -->
					<g transform="translate({pos.x}, {pos.y})">
						<!-- Card background -->
						<rect
							width={CARD_WIDTH}
							height={CARD_HEIGHT}
							rx="8"
							fill="#111827"
							stroke="#374151"
							stroke-width="1"
							filter="url(#cardShadow)"
						/>
						<!-- Identity accent -->
						<rect
							x="0"
							y="0"
							width="4"
							height={CARD_HEIGHT}
							rx="2"
							fill={identityColor}
						/>

						<!-- Header background -->
						<rect
							x="4"
							y="0"
							width={CARD_WIDTH - 4}
							height="70"
							rx="8"
							fill="#1f2937"
						/>

						<!-- Project name -->
						<text
							x="16"
							y="24"
							font-size="14"
							font-weight="600"
							fill="white"
							font-family="system-ui, -apple-system, sans-serif"
						>
							{project.displayName}
						</text>

						<!-- Host badge -->
						<rect
							x={CARD_WIDTH - 70}
							y="8"
							width="58"
							height="20"
							rx="4"
							fill="{hostColor}30"
						/>
						<text
							x={CARD_WIDTH - 41}
							y="22"
							font-size="10"
							font-weight="500"
							fill={hostColor}
							text-anchor="middle"
							font-family="system-ui, sans-serif"
						>
							{hostProvider}
						</text>

						<!-- Production URL -->
						{#if project.productionUrl}
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<g
								class="cursor-pointer"
								onclick={(e) => handleLinkClick(e, project.productionUrl!)}
							>
								<text
									x="16"
									y="42"
									font-size="11"
									fill="#60a5fa"
									font-family="system-ui, sans-serif"
								>
									{getDisplayUrl(project.productionUrl)}
								</text>
							</g>
						{:else}
							<text
								x="16"
								y="42"
								font-size="11"
								fill="#6b7280"
								font-family="system-ui, sans-serif"
							>
								No production URL
							</text>
						{/if}

						<!-- Repo ID -->
						<text
							x="16"
							y="58"
							font-size="10"
							fill="#6b7280"
							font-family="ui-monospace, monospace"
						>
							{project.id}
						</text>

						<!-- Services list -->
						{#each project.services as service, svcIdx (service.provider + '-' + service.category + '-' + svcIdx)}
							{@const svcY = 80 + svcIdx * 28}
							{@const color = providerColors[service.provider] || '#6b7280'}

							{#if svcY + 28 < CARD_HEIGHT - 10}
								<!-- Service row background -->
								<rect
									x="8"
									y={svcY}
									width={CARD_WIDTH - 16}
									height="24"
									rx="4"
									fill="#1f293780"
								/>

								<!-- Category icon circle -->
								<circle
									cx="22"
									cy={svcY + 12}
									r="10"
									fill="{color}20"
								/>
								<text
									x="22"
									y={svcY + 16}
									font-size="10"
									fill={color}
									text-anchor="middle"
									font-family="system-ui, sans-serif"
								>
									{getCategoryIcon(service.category)}
								</text>

								<!-- Category label -->
								<text
									x="40"
									y={svcY + 16}
									font-size="10"
									fill="#9ca3af"
									font-family="system-ui, sans-serif"
								>
									{getCategoryLabel(service.category)}
								</text>

								<!-- Provider name -->
								{#if service.dashboardUrl}
									<!-- svelte-ignore a11y_click_events_have_key_events -->
									<!-- svelte-ignore a11y_no_static_element_interactions -->
									<g
										class="cursor-pointer"
										onclick={(e) => handleLinkClick(e, service.dashboardUrl!)}
									>
										<text
											x="95"
											y={svcY + 16}
											font-size="11"
											font-weight="500"
											fill="#e5e7eb"
											font-family="system-ui, sans-serif"
										>
											{service.provider}
										</text>
										<!-- External link indicator -->
										<text
											x={CARD_WIDTH - 24}
											y={svcY + 16}
											font-size="10"
											fill="#6b7280"
										>
											↗
										</text>
									</g>
								{:else}
									<text
										x="95"
										y={svcY + 16}
										font-size="11"
										font-weight="500"
										fill="#d1d5db"
										font-family="system-ui, sans-serif"
									>
										{service.provider}
									</text>
								{/if}
							{/if}
						{/each}
					</g>
				{/each}
			</g>
		</svg>
	</div>

	<!-- Legend -->
	<div class="shrink-0 px-4 py-2 bg-gray-900/90 border-t border-gray-800 flex items-center gap-6 flex-wrap">
		<div class="flex items-center gap-3">
			<span class="text-xs text-gray-500">Identity:</span>
			{#each Object.entries(identityColors) as [identity, color] (identity)}
				<div class="flex items-center gap-1.5">
					<div class="w-3 h-3 rounded" style="background-color: {color};"></div>
					<span class="text-xs text-gray-400">{identity}</span>
				</div>
			{/each}
		</div>
		<div class="flex items-center gap-3">
			<span class="text-xs text-gray-500">Providers:</span>
			{#each Object.entries(providerColors).slice(0, 8) as [provider, color] (provider)}
				<div class="flex items-center gap-1">
					<div class="w-2 h-2 rounded-sm" style="background-color: {color};"></div>
					<span class="text-[10px] text-gray-500">{provider}</span>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	/* Crisp text rendering for SVG */
	svg {
		shape-rendering: geometricPrecision;
		text-rendering: optimizeLegibility;
	}
	svg text {
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
</style>
