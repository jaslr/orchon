<script lang="ts">
	import type { PageData } from './$types';
	import { browser } from '$app/environment';
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
		Mail
	} from '@lucide/svelte';

	let { data }: { data: PageData } = $props();

	// Sorting
	let sortAsc = $state(true);
	let sortedProjects = $derived(
		sortAsc
			? [...data.projects].sort((a, b) => a.displayName.localeCompare(b.displayName))
			: [...data.projects].sort((a, b) => b.displayName.localeCompare(a.displayName))
	);

	// Zoom state - using CSS zoom (not transform scale)
	let zoomLevel = $state(1);
	let containerRef: HTMLDivElement;
	let isPanning = $state(false);
	let panStart = $state({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

	// Grid config
	const COLS = 4;
	const CARD_WIDTH = 300;
	const CARD_HEIGHT = 360;
	const GAP = 40;

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
		vercel: '#171717',
		netlify: '#00c7b7',
		resend: '#171717',
		sendgrid: '#1a82e2',
		mailgun: '#f06b66',
		digitalocean: '#0080ff',
	};

	// Category icons
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

	function getHostingProvider(services: typeof data.projects[0]['services']): string {
		const hosting = services.find(s => s.category === 'hosting');
		return hosting?.provider || 'unknown';
	}

	function getDisplayUrl(url: string): string {
		try {
			return new URL(url).hostname;
		} catch {
			return url;
		}
	}

	// Zoom with mouse wheel
	function handleWheel(e: WheelEvent) {
		e.preventDefault();
		const delta = e.deltaY > 0 ? -0.1 : 0.1;
		zoomLevel = Math.max(0.25, Math.min(3, zoomLevel + delta));
	}

	// Pan with drag
	function handleMouseDown(e: MouseEvent) {
		if (e.target instanceof HTMLAnchorElement) return;
		isPanning = true;
		panStart = {
			x: e.clientX,
			y: e.clientY,
			scrollLeft: containerRef.scrollLeft,
			scrollTop: containerRef.scrollTop
		};
	}

	function handleMouseMove(e: MouseEvent) {
		if (!isPanning) return;
		const dx = e.clientX - panStart.x;
		const dy = e.clientY - panStart.y;
		containerRef.scrollLeft = panStart.scrollLeft - dx;
		containerRef.scrollTop = panStart.scrollTop - dy;
	}

	function handleMouseUp() {
		isPanning = false;
	}

	// Zoom controls
	function zoomIn() {
		zoomLevel = Math.min(3, zoomLevel + 0.25);
	}

	function zoomOut() {
		zoomLevel = Math.max(0.25, zoomLevel - 0.25);
	}

	function resetView() {
		zoomLevel = 1;
		if (containerRef) {
			containerRef.scrollLeft = 0;
			containerRef.scrollTop = 0;
		}
	}

	// Grid dimensions
	let rows = $derived(Math.ceil(sortedProjects.length / COLS));
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
			<button
				onclick={() => sortAsc = !sortAsc}
				class="flex items-center gap-1.5 px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 transition-colors"
			>
				{#if sortAsc}
					<ArrowUpAZ class="w-3.5 h-3.5" />
				{:else}
					<ArrowDownZA class="w-3.5 h-3.5" />
				{/if}
				Sort
			</button>
			<div class="flex items-center gap-1 ml-2">
				<button onclick={zoomOut} class="p-1.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-300">
					<ZoomOut class="w-4 h-4" />
				</button>
				<span class="text-xs text-gray-400 w-12 text-center">{Math.round(zoomLevel * 100)}%</span>
				<button onclick={zoomIn} class="p-1.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-300">
					<ZoomIn class="w-4 h-4" />
				</button>
				<button onclick={resetView} class="p-1.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-300 ml-1">
					<Maximize2 class="w-4 h-4" />
				</button>
			</div>
		</div>
	</div>

	<div class="shrink-0 px-4 py-1 text-xs text-gray-500 bg-gray-900/50">
		Scroll to zoom | Drag to pan | Click links to open dashboards
	</div>

	<!-- Scrollable container -->
	<div
		bind:this={containerRef}
		class="flex-1 overflow-auto relative cursor-grab select-none"
		class:cursor-grabbing={isPanning}
		onwheel={handleWheel}
		onmousedown={handleMouseDown}
		onmousemove={handleMouseMove}
		onmouseup={handleMouseUp}
		onmouseleave={handleMouseUp}
		role="application"
		tabindex="0"
	>
		<!-- Grid background -->
		<div
			class="absolute inset-0 pointer-events-none"
			style="
				background-image:
					linear-gradient(rgba(55, 65, 81, 0.25) 1px, transparent 1px),
					linear-gradient(90deg, rgba(55, 65, 81, 0.25) 1px, transparent 1px);
				background-size: 40px 40px;
			"
		></div>

		<!-- Cards container with CSS zoom -->
		<div
			class="p-8 grid gap-10 relative"
			style="
				zoom: {zoomLevel};
				grid-template-columns: repeat({COLS}, {CARD_WIDTH}px);
				width: max-content;
				min-height: 100%;
			"
		>
			{#each sortedProjects as project (project.id)}
				{@const identityColor = identityColors[project.identity] || '#6b7280'}
				{@const hostProvider = getHostingProvider(project.services)}
				{@const hostColor = providerColors[hostProvider] || '#6b7280'}

				<div
					class="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-xl hover:border-gray-600 transition-colors"
					style="border-left: 4px solid {identityColor}; width: {CARD_WIDTH}px;"
				>
					<!-- Header -->
					<div class="px-4 py-3 bg-gray-800/70 border-b border-gray-700">
						<div class="flex items-center justify-between gap-2">
							<span class="font-semibold text-white text-sm">{project.displayName}</span>
							<span
								class="px-2 py-0.5 rounded text-[10px] font-medium"
								style="background-color: {hostColor}25; color: {hostColor};"
							>
								{hostProvider}
							</span>
						</div>
						{#if project.productionUrl}
							<a
								href={project.productionUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-1.5 group"
							>
								<span class="truncate">{getDisplayUrl(project.productionUrl)}</span>
								<ExternalLink class="w-3 h-3 opacity-60 group-hover:opacity-100" />
							</a>
						{:else}
							<div class="text-xs text-gray-500 mt-1.5">No production URL</div>
						{/if}
						<div class="text-[10px] text-gray-500 mt-1 font-mono">{project.id}</div>
					</div>

					<!-- Services -->
					<div class="p-3 space-y-1.5">
						{#each project.services as service, idx (service.provider + '-' + service.category + '-' + idx)}
							{@const Icon = getCategoryIcon(service.category)}
							{@const color = providerColors[service.provider] || '#6b7280'}

							{#if service.dashboardUrl}
								<a
									href={service.dashboardUrl}
									target="_blank"
									rel="noopener noreferrer"
									class="flex items-center gap-2.5 px-2.5 py-2 bg-gray-800/50 hover:bg-gray-800 rounded text-xs transition-colors group"
								>
									<div
										class="w-7 h-7 rounded flex items-center justify-center shrink-0"
										style="background-color: {color}20;"
									>
										<Icon class="w-4 h-4" style="color: {color};" />
									</div>
									<div class="flex-1 min-w-0 flex items-center gap-3">
										<span class="text-gray-500 w-14 shrink-0">{getCategoryLabel(service.category)}</span>
										<span class="text-gray-200 group-hover:text-white font-medium">{service.provider}</span>
									</div>
									<ExternalLink class="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400 shrink-0" />
								</a>
							{:else}
								<div class="flex items-center gap-2.5 px-2.5 py-2 bg-gray-800/50 rounded text-xs">
									<div
										class="w-7 h-7 rounded flex items-center justify-center shrink-0"
										style="background-color: {color}20;"
									>
										<Icon class="w-4 h-4" style="color: {color};" />
									</div>
									<div class="flex-1 min-w-0 flex items-center gap-3">
										<span class="text-gray-500 w-14 shrink-0">{getCategoryLabel(service.category)}</span>
										<span class="text-gray-300 font-medium">{service.provider}</span>
									</div>
								</div>
							{/if}
						{/each}
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
