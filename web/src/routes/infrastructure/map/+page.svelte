<script lang="ts">
	import type { PageData } from './$types';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import panzoom from 'panzoom';
	import {
		Cloud,
		Database,
		Shield,
		HardDrive,
		GitBranch,
		Activity,
		ExternalLink,
		ZoomIn,
		ZoomOut,
		ArrowUpAZ,
		ArrowDownZA,
		Maximize2,
		Globe,
		Mail,
		Link
	} from '@lucide/svelte';

	let { data }: { data: PageData } = $props();

	// Sorting
	let sortAsc = $state(true);
	let sortedProjects = $derived(
		sortAsc
			? [...data.projects].sort((a, b) => a.displayName.localeCompare(b.displayName))
			: [...data.projects].sort((a, b) => b.displayName.localeCompare(a.displayName))
	);

	// Panzoom instance
	let canvasRef: HTMLDivElement;
	let panzoomInstance: ReturnType<typeof panzoom> | null = null;
	let currentZoom = $state(1);

	// Grid config - 4 columns
	const COLS = 4;
	const PROJECT_WIDTH = 320;
	const PROJECT_HEIGHT = 380;
	const GAP = 50;

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

	// Category icons and labels
	function getCategoryIcon(category: string) {
		switch (category) {
			case 'hosting': return Cloud;
			case 'database': return Database;
			case 'auth': return Shield;
			case 'storage': return HardDrive;
			case 'ci': return GitBranch;
			case 'monitoring': return Activity;
			case 'dns': return Globe;
			case 'email': return Mail;
			default: return Cloud;
		}
	}

	function getCategoryLabel(category: string): string {
		const labels: Record<string, string> = {
			hosting: 'Host',
			database: 'DB',
			auth: 'Auth',
			storage: 'Storage',
			ci: 'CI/CD',
			monitoring: 'Monitor',
			dns: 'DNS',
			email: 'Email',
		};
		return labels[category] || category;
	}

	// Identity colors
	const identityColors: Record<string, string> = {
		jaslr: '#3b82f6',
		'jvp-ux': '#8b5cf6',
	};

	// Get hosting provider for display
	function getHostingProvider(services: typeof data.projects[0]['services']): string {
		const hosting = services.find(s => s.category === 'hosting');
		return hosting?.provider || 'unknown';
	}

	// Initialize panzoom
	onMount(() => {
		if (!browser || !canvasRef) return;

		panzoomInstance = panzoom(canvasRef, {
			maxZoom: 4,
			minZoom: 0.25,
			smoothScroll: false,
			zoomDoubleClickSpeed: 1,
			filterKey: () => true,  // Allow all keys
			beforeWheel: (e) => {
				// Only zoom with Ctrl key
				return !e.ctrlKey;
			},
			beforeMouseDown: (e) => {
				// Don't pan when clicking on links
				const target = e.target as HTMLElement;
				return target.tagName === 'A' || target.closest('a') !== null;
			},
		});

		panzoomInstance.on('zoom', (e: { getTransform: () => { scale: number } }) => {
			currentZoom = e.getTransform().scale;
		});

		return () => {
			panzoomInstance?.dispose();
		};
	});

	// Zoom controls
	function zoomIn() {
		panzoomInstance?.smoothZoom(0, 0, 1.3);
	}

	function zoomOut() {
		panzoomInstance?.smoothZoom(0, 0, 0.7);
	}

	function resetView() {
		panzoomInstance?.moveTo(40, 40);
		panzoomInstance?.zoomAbs(0, 0, 1);
		currentZoom = 1;
	}

	// Calculate grid dimensions
	let rows = $derived(Math.ceil(sortedProjects.length / COLS));
	let canvasWidth = $derived(COLS * PROJECT_WIDTH + (COLS - 1) * GAP + 100);
	let canvasHeight = $derived(rows * PROJECT_HEIGHT + (rows - 1) * GAP + 100);

	// Get project position
	function getProjectPosition(index: number) {
		const col = index % COLS;
		const row = Math.floor(index / COLS);
		return {
			x: 50 + col * (PROJECT_WIDTH + GAP),
			y: 50 + row * (PROJECT_HEIGHT + GAP),
		};
	}

	// Get display URL (shortened)
	function getDisplayUrl(url: string): string {
		try {
			const u = new URL(url);
			return u.hostname;
		} catch {
			return url;
		}
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
			<span class="text-xs text-gray-500">Data source: <code class="text-gray-400">lib/config/infrastructure.ts</code></span>
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
		Ctrl + scroll to zoom | Drag to pan | Click service badges to open dashboards
	</div>

	<!-- Canvas container -->
	<div class="flex-1 overflow-hidden relative bg-gray-950">
		<!-- Grid background (fixed) -->
		<div
			class="absolute inset-0 pointer-events-none"
			style="
				background-image:
					linear-gradient(rgba(55, 65, 81, 0.2) 1px, transparent 1px),
					linear-gradient(90deg, rgba(55, 65, 81, 0.2) 1px, transparent 1px);
				background-size: 40px 40px;
			"
		></div>

		<!-- Panzoom canvas -->
		<div
			bind:this={canvasRef}
			class="absolute origin-top-left cursor-grab active:cursor-grabbing"
			style="
				width: {canvasWidth}px;
				height: {canvasHeight}px;
				transform-origin: 0 0;
				will-change: transform;
				backface-visibility: hidden;
			"
		>
			{#each sortedProjects as project, index (project.id)}
				{@const pos = getProjectPosition(index)}
				{@const identityColor = identityColors[project.identity] || '#6b7280'}
				{@const hostProvider = getHostingProvider(project.services)}
				{@const hostColor = providerColors[hostProvider] || '#6b7280'}
				<div
					class="absolute select-none"
					style="
						left: {pos.x}px;
						top: {pos.y}px;
						width: {PROJECT_WIDTH}px;
						transform: translateZ(0);
					"
				>
					<!-- Project card -->
					<div
						class="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-xl hover:border-gray-500 transition-colors"
						style="border-left: 4px solid {identityColor};"
					>
						<!-- Header with URL -->
						<div class="px-3 py-2.5 bg-gray-800/70 border-b border-gray-700">
							<div class="flex items-center justify-between gap-2">
								<span class="font-semibold text-white text-sm">{project.displayName}</span>
								<div
									class="px-1.5 py-0.5 rounded text-[10px] font-medium"
									style="background-color: {hostColor}30; color: {hostColor};"
								>
									{hostProvider}
								</div>
							</div>
							{#if project.productionUrl}
								<a
									href={project.productionUrl}
									target="_blank"
									rel="noopener noreferrer"
									class="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-1 group"
									onclick={(e) => e.stopPropagation()}
								>
									<Link class="w-3 h-3" />
									<span class="truncate">{getDisplayUrl(project.productionUrl)}</span>
									<ExternalLink class="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
								</a>
							{:else}
								<div class="text-xs text-gray-500 mt-1">No production URL</div>
							{/if}
							<div class="text-[10px] text-gray-500 mt-1 font-mono">{project.id}</div>
						</div>

						<!-- Services list -->
						<div class="p-2 space-y-1">
							{#each project.services as service, svcIdx (service.provider + '-' + service.category + '-' + svcIdx)}
								{@const Icon = getCategoryIcon(service.category)}
								{@const color = providerColors[service.provider] || '#6b7280'}
								{#if service.dashboardUrl}
									<a
										href={service.dashboardUrl}
										target="_blank"
										rel="noopener noreferrer"
										class="flex items-center gap-2 px-2 py-1.5 bg-gray-800/40 hover:bg-gray-800 rounded text-xs transition-colors group"
										onclick={(e) => e.stopPropagation()}
									>
										<div
											class="w-6 h-6 rounded flex items-center justify-center shrink-0"
											style="background-color: {color}20;"
										>
											<Icon class="w-3.5 h-3.5" style="color: {color};" />
										</div>
										<div class="flex-1 min-w-0 flex items-center gap-2">
											<span class="text-gray-500 w-12 shrink-0">{getCategoryLabel(service.category)}</span>
											<span class="text-gray-200 group-hover:text-white font-medium">{service.provider}</span>
										</div>
										<ExternalLink class="w-3 h-3 text-gray-600 group-hover:text-gray-400 shrink-0" />
									</a>
								{:else}
									<div class="flex items-center gap-2 px-2 py-1.5 bg-gray-800/40 rounded text-xs">
										<div
											class="w-6 h-6 rounded flex items-center justify-center shrink-0"
											style="background-color: {color}20;"
										>
											<Icon class="w-3.5 h-3.5" style="color: {color};" />
										</div>
										<div class="flex-1 min-w-0 flex items-center gap-2">
											<span class="text-gray-500 w-12 shrink-0">{getCategoryLabel(service.category)}</span>
											<span class="text-gray-300 font-medium">{service.provider}</span>
										</div>
									</div>
								{/if}
							{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>
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
	/* Prevent blurry text during transforms */
	:global(.panzoom) {
		-webkit-font-smoothing: subpixel-antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-rendering: optimizeLegibility;
	}
</style>
