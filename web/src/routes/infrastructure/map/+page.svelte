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

	// Canvas state
	let containerRef: HTMLDivElement;
	let transform = $state({ x: 0, y: 0, scale: 1 });
	let isPanning = $state(false);
	let panStart = $state({ x: 0, y: 0 });

	// Grid config - 4 columns
	const COLS = 4;
	const PROJECT_WIDTH = 280;
	const PROJECT_HEIGHT = 320;
	const GAP = 60;

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
			default: return Cloud;
		}
	}

	// Identity colors
	const identityColors: Record<string, string> = {
		jaslr: '#3b82f6',
		'jvp-ux': '#8b5cf6',
	};

	// Zoom handlers
	function handleWheel(event: WheelEvent) {
		// Require Ctrl for zoom
		if (!event.ctrlKey) return;

		event.preventDefault();

		const delta = event.deltaY > 0 ? 0.9 : 1.1;
		const newScale = Math.max(0.2, Math.min(3, transform.scale * delta));

		// Zoom toward mouse position
		const rect = containerRef.getBoundingClientRect();
		const mouseX = event.clientX - rect.left;
		const mouseY = event.clientY - rect.top;

		const scaleRatio = newScale / transform.scale;

		transform = {
			scale: newScale,
			x: mouseX - (mouseX - transform.x) * scaleRatio,
			y: mouseY - (mouseY - transform.y) * scaleRatio,
		};
	}

	// Pan handlers
	function handlePanStart(event: MouseEvent) {
		// Only left click, and not on interactive elements
		if (event.button !== 0) return;
		isPanning = true;
		panStart = { x: event.clientX - transform.x, y: event.clientY - transform.y };
	}

	function handlePanMove(event: MouseEvent) {
		if (!isPanning) return;
		transform = {
			...transform,
			x: event.clientX - panStart.x,
			y: event.clientY - panStart.y,
		};
	}

	function handlePanEnd() {
		isPanning = false;
	}

	// Zoom controls
	function zoomIn() {
		const newScale = Math.min(3, transform.scale * 1.2);
		// Center zoom
		if (containerRef) {
			const rect = containerRef.getBoundingClientRect();
			const centerX = rect.width / 2;
			const centerY = rect.height / 2;
			const scaleRatio = newScale / transform.scale;
			transform = {
				scale: newScale,
				x: centerX - (centerX - transform.x) * scaleRatio,
				y: centerY - (centerY - transform.y) * scaleRatio,
			};
		} else {
			transform = { ...transform, scale: newScale };
		}
	}

	function zoomOut() {
		const newScale = Math.max(0.2, transform.scale / 1.2);
		if (containerRef) {
			const rect = containerRef.getBoundingClientRect();
			const centerX = rect.width / 2;
			const centerY = rect.height / 2;
			const scaleRatio = newScale / transform.scale;
			transform = {
				scale: newScale,
				x: centerX - (centerX - transform.x) * scaleRatio,
				y: centerY - (centerY - transform.y) * scaleRatio,
			};
		} else {
			transform = { ...transform, scale: newScale };
		}
	}

	function resetView() {
		transform = { x: 40, y: 40, scale: 1 };
	}

	// Calculate grid dimensions
	let rows = $derived(Math.ceil(sortedProjects.length / COLS));
	let canvasWidth = $derived(COLS * PROJECT_WIDTH + (COLS - 1) * GAP + 80);
	let canvasHeight = $derived(rows * PROJECT_HEIGHT + (rows - 1) * GAP + 80);

	// Get project position
	function getProjectPosition(index: number) {
		const col = index % COLS;
		const row = Math.floor(index / COLS);
		return {
			x: 40 + col * (PROJECT_WIDTH + GAP),
			y: 40 + row * (PROJECT_HEIGHT + GAP),
		};
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
				<span class="text-xs text-gray-400 w-12 text-center">{Math.round(transform.scale * 100)}%</span>
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
		Ctrl + scroll to zoom | Drag to pan
	</div>

	<!-- Canvas container -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		bind:this={containerRef}
		class="flex-1 overflow-hidden relative cursor-grab {isPanning ? 'cursor-grabbing' : ''}"
		role="application"
		aria-label="Infrastructure map canvas"
		tabindex="0"
		onwheel={handleWheel}
		onmousedown={handlePanStart}
		onmousemove={handlePanMove}
		onmouseup={handlePanEnd}
		onmouseleave={handlePanEnd}
	>
		<!-- Grid background -->
		<div
			class="absolute inset-0 pointer-events-none"
			style="
				background-image:
					linear-gradient(rgba(55, 65, 81, 0.3) 1px, transparent 1px),
					linear-gradient(90deg, rgba(55, 65, 81, 0.3) 1px, transparent 1px);
				background-size: {40 * transform.scale}px {40 * transform.scale}px;
				background-position: {transform.x % (40 * transform.scale)}px {transform.y % (40 * transform.scale)}px;
			"
		></div>

		<!-- Transformed canvas -->
		<div
			class="absolute origin-top-left will-change-transform"
			style="
				transform: translate({transform.x}px, {transform.y}px) scale({transform.scale});
				width: {canvasWidth}px;
				height: {canvasHeight}px;
			"
		>
			{#each sortedProjects as project, index (project.id)}
				{@const pos = getProjectPosition(index)}
				{@const identityColor = identityColors[project.identity] || '#6b7280'}
				<div
					class="absolute select-none"
					style="left: {pos.x}px; top: {pos.y}px; width: {PROJECT_WIDTH}px;"
				>
					<!-- Project card -->
					<div
						class="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-lg hover:border-gray-600 transition-colors"
						style="border-left: 3px solid {identityColor};"
					>
						<!-- Header -->
						<div class="px-3 py-2 bg-gray-800/50 border-b border-gray-700">
							<div class="flex items-center justify-between">
								<span class="font-medium text-white text-sm truncate">{project.displayName}</span>
								{#if project.productionUrl}
									<a
										href={project.productionUrl}
										target="_blank"
										rel="noopener noreferrer"
										class="text-gray-400 hover:text-blue-400 transition-colors"
										onclick={(e) => e.stopPropagation()}
									>
										<ExternalLink class="w-3.5 h-3.5" />
									</a>
								{/if}
							</div>
							<div class="text-xs text-gray-500 mt-0.5">{project.id}</div>
						</div>

						<!-- Services grid -->
						<div class="p-2 grid grid-cols-2 gap-1.5">
							{#each project.services as service, svcIdx (service.provider + '-' + service.category + '-' + svcIdx)}
								{@const Icon = getCategoryIcon(service.category)}
								{@const color = providerColors[service.provider] || '#6b7280'}
								{#if service.dashboardUrl}
									<a
										href={service.dashboardUrl}
										target="_blank"
										rel="noopener noreferrer"
										class="flex items-center gap-1.5 px-2 py-1.5 bg-gray-800/50 hover:bg-gray-800 rounded text-xs transition-colors group"
										onclick={(e) => e.stopPropagation()}
									>
										<div
											class="w-5 h-5 rounded flex items-center justify-center shrink-0"
											style="background-color: {color}20;"
										>
											<Icon class="w-3 h-3" style="color: {color};" />
										</div>
										<div class="flex-1 min-w-0">
											<div class="text-gray-300 truncate group-hover:text-white">{service.provider}</div>
											<div class="text-gray-500 text-[10px] truncate">{service.category}</div>
										</div>
									</a>
								{:else}
									<div
										class="flex items-center gap-1.5 px-2 py-1.5 bg-gray-800/50 rounded text-xs"
									>
										<div
											class="w-5 h-5 rounded flex items-center justify-center shrink-0"
											style="background-color: {color}20;"
										>
											<Icon class="w-3 h-3" style="color: {color};" />
										</div>
										<div class="flex-1 min-w-0">
											<div class="text-gray-300 truncate">{service.provider}</div>
											<div class="text-gray-500 text-[10px] truncate">{service.category}</div>
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
	<div class="shrink-0 px-4 py-2 bg-gray-900/80 border-t border-gray-800 flex items-center gap-4 flex-wrap">
		<span class="text-xs text-gray-500">Identities:</span>
		{#each Object.entries(identityColors) as [identity, color] (identity)}
			<div class="flex items-center gap-1.5">
				<div class="w-3 h-3 rounded" style="background-color: {color};"></div>
				<span class="text-xs text-gray-400">{identity}</span>
			</div>
		{/each}
		<span class="text-gray-700 mx-2">|</span>
		<span class="text-xs text-gray-500">Providers:</span>
		{#each Object.entries(providerColors).slice(0, 6) as [provider, color] (provider)}
			<div class="flex items-center gap-1.5">
				<div class="w-2.5 h-2.5 rounded-sm" style="background-color: {color};"></div>
				<span class="text-xs text-gray-400">{provider}</span>
			</div>
		{/each}
	</div>
</div>
