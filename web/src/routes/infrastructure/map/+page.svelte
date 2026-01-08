<script lang="ts">
	import type { PageData } from './$types';
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
		Focus
	} from '@lucide/svelte';

	let { data }: { data: PageData } = $props();

	// Sorting
	let sortAsc = $state(true);
	let sortedProjects = $derived(
		sortAsc
			? [...data.projects].sort((a, b) => a.displayName.localeCompare(b.displayName))
			: [...data.projects].sort((a, b) => b.displayName.localeCompare(a.displayName))
	);

	// Canvas state - pan (x, y) and zoom
	let panX = $state(40);
	let panY = $state(40);
	let zoom = $state(1);
	let containerRef: HTMLDivElement;

	// Drag state
	let isDragging = $state(false);
	let dragStart = { x: 0, y: 0, panX: 0, panY: 0 };

	// Grid config
	const COLS = 4;
	const CARD_WIDTH = 300;
	const CARD_HEIGHT = 360;
	const GAP = 40;
	const PADDING = 40;

	// Calculate content bounds
	let rows = $derived(Math.ceil(sortedProjects.length / COLS));
	let contentWidth = $derived(COLS * CARD_WIDTH + (COLS - 1) * GAP + PADDING * 2);
	let contentHeight = $derived(rows * CARD_HEIGHT + (rows - 1) * GAP + PADDING * 2);

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

	function getCategoryIcon(category: string) {
		switch (category) {
			case 'hosting': return Cloud;
			case 'database': return Database;
			case 'auth': return Shield;
			case 'storage': return HardDrive;
			case 'ci': return GitBranch;
			case 'monitoring': return Activity;
			case 'dns': return Cloud;
			case 'email': return Cloud;
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

	// Zoom toward mouse cursor
	function handleWheel(e: WheelEvent) {
		e.preventDefault();

		const rect = containerRef.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		// Calculate world position under cursor before zoom
		const worldX = (mouseX - panX) / zoom;
		const worldY = (mouseY - panY) / zoom;

		// Update zoom
		const zoomDelta = e.deltaY > 0 ? 0.9 : 1.1;
		const newZoom = Math.max(0.1, Math.min(5, zoom * zoomDelta));

		// Adjust pan so the point under cursor stays fixed
		panX = mouseX - worldX * newZoom;
		panY = mouseY - worldY * newZoom;
		zoom = newZoom;
	}

	// Drag to pan
	function handleMouseDown(e: MouseEvent) {
		if ((e.target as HTMLElement).closest('a')) return;
		isDragging = true;
		dragStart = { x: e.clientX, y: e.clientY, panX, panY };
	}

	function handleMouseMove(e: MouseEvent) {
		if (!isDragging) return;
		panX = dragStart.panX + (e.clientX - dragStart.x);
		panY = dragStart.panY + (e.clientY - dragStart.y);
	}

	function handleMouseUp() {
		isDragging = false;
	}

	// Zoom controls
	function zoomIn() {
		const rect = containerRef.getBoundingClientRect();
		const centerX = rect.width / 2;
		const centerY = rect.height / 2;
		const worldX = (centerX - panX) / zoom;
		const worldY = (centerY - panY) / zoom;
		const newZoom = Math.min(5, zoom * 1.25);
		panX = centerX - worldX * newZoom;
		panY = centerY - worldY * newZoom;
		zoom = newZoom;
	}

	function zoomOut() {
		const rect = containerRef.getBoundingClientRect();
		const centerX = rect.width / 2;
		const centerY = rect.height / 2;
		const worldX = (centerX - panX) / zoom;
		const worldY = (centerY - panY) / zoom;
		const newZoom = Math.max(0.1, zoom / 1.25);
		panX = centerX - worldX * newZoom;
		panY = centerY - worldY * newZoom;
		zoom = newZoom;
	}

	// Fit diagram in view
	function fitToView() {
		if (!containerRef) return;
		const rect = containerRef.getBoundingClientRect();
		const padding = 60;

		// Calculate zoom to fit content
		const scaleX = (rect.width - padding * 2) / contentWidth;
		const scaleY = (rect.height - padding * 2) / contentHeight;
		const newZoom = Math.min(scaleX, scaleY, 1); // Don't zoom in past 100%

		// Center the content
		panX = (rect.width - contentWidth * newZoom) / 2;
		panY = (rect.height - contentHeight * newZoom) / 2;
		zoom = newZoom;
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
				<span class="text-xs text-gray-400 w-14 text-center">{Math.round(zoom * 100)}%</span>
				<button onclick={zoomIn} class="p-1.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-300">
					<ZoomIn class="w-4 h-4" />
				</button>
				<button
					onclick={fitToView}
					class="flex items-center gap-1.5 px-2 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-xs text-white font-medium ml-2"
					title="Fit diagram to view"
				>
					<Focus class="w-3.5 h-3.5" />
					Fit
				</button>
			</div>
		</div>
	</div>

	<div class="shrink-0 px-4 py-1 text-xs text-gray-500 bg-gray-900/50">
		Scroll to zoom at cursor | Drag to pan | Data: <code class="text-gray-400">lib/config/infrastructure.ts</code>
	</div>

	<!-- Infinite Canvas -->
	<div
		bind:this={containerRef}
		class="flex-1 overflow-hidden relative cursor-grab select-none"
		class:cursor-grabbing={isDragging}
		onwheel={handleWheel}
		onmousedown={handleMouseDown}
		onmousemove={handleMouseMove}
		onmouseup={handleMouseUp}
		onmouseleave={handleMouseUp}
		role="application"
		tabindex="0"
	>
		<!-- Grid background (infinite, follows pan) -->
		<div
			class="absolute inset-0 pointer-events-none"
			style="
				background-image:
					linear-gradient(rgba(55, 65, 81, 0.3) 1px, transparent 1px),
					linear-gradient(90deg, rgba(55, 65, 81, 0.3) 1px, transparent 1px);
				background-size: {40 * zoom}px {40 * zoom}px;
				background-position: {panX}px {panY}px;
			"
		></div>

		<!-- Content layer -->
		<div
			class="absolute origin-top-left"
			style="
				transform: translate({panX}px, {panY}px) scale({zoom});
				width: {contentWidth}px;
				height: {contentHeight}px;
			"
		>
			<!-- Cards grid -->
			<div
				class="grid gap-10 p-10"
				style="grid-template-columns: repeat({COLS}, {CARD_WIDTH}px);"
			>
				{#each sortedProjects as project (project.id)}
					{@const identityColor = identityColors[project.identity] || '#6b7280'}
					{@const hostProvider = getHostingProvider(project.services)}
					{@const hostColor = providerColors[hostProvider] || '#6b7280'}

					<div
						class="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-xl hover:border-gray-500 transition-colors"
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
