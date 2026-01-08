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
		Focus,
		FolderGit2,
		Server
	} from '@lucide/svelte';

	let { data }: { data: PageData } = $props();

	// View mode: 'hierarchy' shows repos with instances, 'flat' shows all projects
	let viewMode = $state<'hierarchy' | 'flat'>('hierarchy');

	// Sorting
	let sortAsc = $state(true);

	// For flat view - filter out instances (show only standalone projects and source repos)
	let standaloneProjects = $derived(
		data.projects.filter(p => !p.sourceRepo)
	);

	let sortedStandaloneProjects = $derived(
		sortAsc
			? [...standaloneProjects].sort((a, b) => a.displayName.localeCompare(b.displayName))
			: [...standaloneProjects].sort((a, b) => b.displayName.localeCompare(a.displayName))
	);

	// For hierarchy view - source repos with their instances
	let sortedSourceRepos = $derived(
		sortAsc
			? [...data.sourceRepos].sort((a, b) => a.displayName.localeCompare(b.displayName))
			: [...data.sourceRepos].sort((a, b) => b.displayName.localeCompare(a.displayName))
	);

	// Canvas state - pan (x, y) and zoom
	let panX = $state(40);
	let panY = $state(40);
	let zoom = $state(1);
	let containerRef: HTMLDivElement;

	// Drag state
	let isDragging = $state(false);
	let dragStart = { x: 0, y: 0, panX: 0, panY: 0 };

	// Grid config for hierarchy view
	const REPO_WIDTH = 280;
	const REPO_HEIGHT = 120;
	const INSTANCE_WIDTH = 240;
	const INSTANCE_HEIGHT = 80;
	const HORIZONTAL_GAP = 200;
	const VERTICAL_GAP = 30;
	const REPO_VERTICAL_GAP = 80;
	const PADDING = 60;

	// Calculate content bounds for hierarchy view
	let hierarchyContentWidth = $derived(() => {
		let maxWidth = 0;
		for (const repo of sortedSourceRepos) {
			const width = PADDING + REPO_WIDTH + HORIZONTAL_GAP + INSTANCE_WIDTH + PADDING;
			if (width > maxWidth) maxWidth = width;
		}
		return Math.max(maxWidth, 800);
	});

	let hierarchyContentHeight = $derived(() => {
		let totalHeight = PADDING;
		for (const repo of sortedSourceRepos) {
			const instancesHeight = repo.instances.length > 0
				? repo.instances.length * (INSTANCE_HEIGHT + VERTICAL_GAP) - VERTICAL_GAP
				: 0;
			const repoBlockHeight = Math.max(REPO_HEIGHT, instancesHeight);
			totalHeight += repoBlockHeight + REPO_VERTICAL_GAP;
		}
		return totalHeight + PADDING;
	});

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

	const identityColors: Record<string, string> = {
		jaslr: '#3b82f6',
		'jvp-ux': '#8b5cf6',
	};

	function getDisplayUrl(url: string): string {
		try {
			return new URL(url).hostname;
		} catch {
			return url;
		}
	}

	function getHostingProvider(services: typeof data.projects[0]['services']): string {
		const hosting = services.find(s => s.category === 'hosting');
		return hosting?.provider || 'unknown';
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

		const contentWidth = viewMode === 'hierarchy' ? hierarchyContentWidth() : 1400;
		const contentHeight = viewMode === 'hierarchy' ? hierarchyContentHeight() : 1200;

		// Calculate zoom to fit content
		const scaleX = (rect.width - padding * 2) / contentWidth;
		const scaleY = (rect.height - padding * 2) / contentHeight;
		const newZoom = Math.min(scaleX, scaleY, 1);

		// Center the content
		panX = (rect.width - contentWidth * newZoom) / 2;
		panY = (rect.height - contentHeight * newZoom) / 2;
		zoom = newZoom;
	}

	// Calculate positions for hierarchy view
	function getRepoPositions() {
		const positions: Map<string, { x: number; y: number; instancePositions: { id: string; x: number; y: number }[] }> = new Map();
		let currentY = PADDING;

		for (const repo of sortedSourceRepos) {
			const instancesHeight = repo.instances.length > 0
				? repo.instances.length * (INSTANCE_HEIGHT + VERTICAL_GAP) - VERTICAL_GAP
				: 0;
			const repoBlockHeight = Math.max(REPO_HEIGHT, instancesHeight);

			// Repo position (left side)
			const repoX = PADDING;
			const repoY = currentY + (repoBlockHeight - REPO_HEIGHT) / 2;

			// Instance positions (right side, stacked vertically)
			const instancePositions: { id: string; x: number; y: number }[] = [];
			const instanceStartY = currentY + (repoBlockHeight - instancesHeight) / 2;

			for (let i = 0; i < repo.instances.length; i++) {
				instancePositions.push({
					id: repo.instances[i].id,
					x: PADDING + REPO_WIDTH + HORIZONTAL_GAP,
					y: instanceStartY + i * (INSTANCE_HEIGHT + VERTICAL_GAP),
				});
			}

			positions.set(repo.id, { x: repoX, y: repoY, instancePositions });
			currentY += repoBlockHeight + REPO_VERTICAL_GAP;
		}

		return positions;
	}

	let repoPositions = $derived(getRepoPositions());
</script>

<svelte:head>
	<title>Infrastructure Map | Orchon</title>
</svelte:head>

<div class="h-full flex flex-col bg-gray-950 overflow-hidden">
	<!-- Controls -->
	<div class="shrink-0 flex items-center justify-between px-4 py-2 bg-gray-900/80 border-b border-gray-800 backdrop-blur-sm z-10">
		<div class="flex items-center gap-4">
			<h1 class="text-lg font-semibold text-white">Infrastructure Map</h1>
			<div class="flex items-center gap-1 bg-gray-800 rounded-lg p-0.5">
				<button
					onclick={() => viewMode = 'hierarchy'}
					class="px-3 py-1 text-xs rounded-md transition-colors {viewMode === 'hierarchy' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}"
				>
					Hierarchy
				</button>
				<button
					onclick={() => viewMode = 'flat'}
					class="px-3 py-1 text-xs rounded-md transition-colors {viewMode === 'flat' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}"
				>
					Flat
				</button>
			</div>
			<span class="text-xs text-gray-500">
				{viewMode === 'hierarchy'
					? `${sortedSourceRepos.length} repos, ${sortedSourceRepos.reduce((acc, r) => acc + r.instances.length, 0)} instances`
					: `${sortedStandaloneProjects.length} projects`}
			</span>
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
			"
		>
			{#if viewMode === 'hierarchy'}
				<!-- SVG for connecting lines -->
				<svg class="absolute top-0 left-0 pointer-events-none" style="width: {hierarchyContentWidth()}px; height: {hierarchyContentHeight()}px;">
					{#each sortedSourceRepos as repo (repo.id)}
						{@const pos = repoPositions.get(repo.id)}
						{#if pos && repo.instances.length > 0}
							{#each pos.instancePositions as instPos (instPos.id)}
								<!-- Bezier curve from repo to instance -->
								<path
									d="M {pos.x + REPO_WIDTH} {pos.y + REPO_HEIGHT / 2}
									   C {pos.x + REPO_WIDTH + HORIZONTAL_GAP / 2} {pos.y + REPO_HEIGHT / 2},
									     {instPos.x - HORIZONTAL_GAP / 2} {instPos.y + INSTANCE_HEIGHT / 2},
									     {instPos.x} {instPos.y + INSTANCE_HEIGHT / 2}"
									fill="none"
									stroke="rgba(99, 102, 241, 0.4)"
									stroke-width="2"
									stroke-dasharray="6 4"
								/>
								<!-- Arrow at end -->
								<circle
									cx={instPos.x}
									cy={instPos.y + INSTANCE_HEIGHT / 2}
									r="4"
									fill="rgb(99, 102, 241)"
								/>
							{/each}
						{/if}
					{/each}
				</svg>

				<!-- Source repos and instances -->
				{#each sortedSourceRepos as repo (repo.id)}
					{@const pos = repoPositions.get(repo.id)}
					{@const identityColor = identityColors[repo.identity] || '#6b7280'}
					{#if pos}
						<!-- Source Repo Card -->
						<div
							class="absolute bg-gray-900 border-2 border-indigo-500 rounded-lg overflow-hidden shadow-xl shadow-indigo-500/10"
							style="left: {pos.x}px; top: {pos.y}px; width: {REPO_WIDTH}px; height: {REPO_HEIGHT}px; border-left: 4px solid {identityColor};"
						>
							<div class="px-4 py-3 bg-indigo-950/50 border-b border-indigo-500/30">
								<div class="flex items-center gap-2">
									<FolderGit2 class="w-4 h-4 text-indigo-400" />
									<span class="font-semibold text-white text-sm">{repo.displayName}</span>
								</div>
								<div class="text-[10px] text-indigo-300 mt-1">Source Repository</div>
							</div>
							<div class="px-4 py-2">
								{#if repo.productionUrl}
									<a
										href={repo.productionUrl}
										target="_blank"
										rel="noopener noreferrer"
										class="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 group"
									>
										<span class="truncate">{getDisplayUrl(repo.productionUrl)}</span>
										<ExternalLink class="w-3 h-3 opacity-60 group-hover:opacity-100" />
									</a>
								{/if}
								<div class="text-[10px] text-gray-500 mt-1">{repo.instances.length} deployed instance{repo.instances.length !== 1 ? 's' : ''}</div>
							</div>
						</div>

						<!-- Instance Cards -->
						{#each pos.instancePositions as instPos, i (instPos.id)}
							{@const instance = repo.instances[i]}
							<div
								class="absolute bg-gray-900 border border-gray-600 rounded-lg overflow-hidden shadow-lg hover:border-gray-500 transition-colors"
								style="left: {instPos.x}px; top: {instPos.y}px; width: {INSTANCE_WIDTH}px; height: {INSTANCE_HEIGHT}px;"
							>
								<div class="px-3 py-2 bg-gray-800/50 border-b border-gray-700">
									<div class="flex items-center gap-2">
										<Server class="w-3.5 h-3.5 text-emerald-400" />
										<span class="font-medium text-white text-xs truncate">{instance.displayName}</span>
									</div>
								</div>
								<div class="px-3 py-2">
									{#if instance.productionUrl}
										<a
											href={instance.productionUrl}
											target="_blank"
											rel="noopener noreferrer"
											class="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 group"
										>
											<span class="truncate">{getDisplayUrl(instance.productionUrl)}</span>
											<ExternalLink class="w-2.5 h-2.5 opacity-60 group-hover:opacity-100" />
										</a>
									{/if}
									{#if instance.gcpProject}
										<div class="text-[10px] text-gray-500 mt-0.5 font-mono">{instance.gcpProject}</div>
									{/if}
								</div>
							</div>
						{/each}
					{/if}
				{/each}

				<!-- Standalone projects (no sourceRepo and not a source repo with instances) -->
				{@const standaloneInHierarchy = standaloneProjects.filter(p => !p.isSourceRepo || !sortedSourceRepos.find(r => r.id === p.id)?.instances.length)}
				{#if standaloneInHierarchy.length > 0}
					<div
						class="absolute"
						style="left: {PADDING}px; top: {hierarchyContentHeight() + 40}px;"
					>
						<div class="text-xs text-gray-500 mb-4 uppercase tracking-wide">Standalone Projects</div>
						<div class="flex flex-wrap gap-4" style="max-width: {hierarchyContentWidth() - PADDING * 2}px;">
							{#each standaloneInHierarchy.filter(p => !p.isSourceRepo) as project (project.id)}
								{@const identityColor = identityColors[project.identity] || '#6b7280'}
								{@const hostProvider = getHostingProvider(project.services)}
								{@const hostColor = providerColors[hostProvider] || '#6b7280'}
								<div
									class="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-lg hover:border-gray-500 transition-colors"
									style="width: 220px; border-left: 3px solid {identityColor};"
								>
									<div class="px-3 py-2 bg-gray-800/50 border-b border-gray-700">
										<div class="flex items-center justify-between gap-2">
											<span class="font-medium text-white text-xs truncate">{project.displayName}</span>
											<span
												class="px-1.5 py-0.5 rounded text-[9px] font-medium shrink-0"
												style="background-color: {hostColor}25; color: {hostColor};"
											>
												{hostProvider}
											</span>
										</div>
									</div>
									<div class="px-3 py-2">
										{#if project.productionUrl}
											<a
												href={project.productionUrl}
												target="_blank"
												rel="noopener noreferrer"
												class="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 group"
											>
												<span class="truncate">{getDisplayUrl(project.productionUrl)}</span>
												<ExternalLink class="w-2.5 h-2.5 opacity-60 group-hover:opacity-100" />
											</a>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			{:else}
				<!-- Flat view - grid of all projects -->
				<div class="grid gap-8 p-10" style="grid-template-columns: repeat(4, 280px);">
					{#each sortedStandaloneProjects as project (project.id)}
						{@const identityColor = identityColors[project.identity] || '#6b7280'}
						{@const hostProvider = getHostingProvider(project.services)}
						{@const hostColor = providerColors[hostProvider] || '#6b7280'}
						<div
							class="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-xl hover:border-gray-500 transition-colors"
							style="border-left: 4px solid {identityColor}; width: 280px;"
						>
							<!-- Header -->
							<div class="px-4 py-3 bg-gray-800/70 border-b border-gray-700">
								<div class="flex items-center justify-between gap-2">
									<div class="flex items-center gap-2">
										{#if project.isSourceRepo}
											<FolderGit2 class="w-4 h-4 text-indigo-400" />
										{/if}
										<span class="font-semibold text-white text-sm">{project.displayName}</span>
									</div>
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
							<div class="p-3 space-y-1.5 max-h-[200px] overflow-y-auto">
								{#each project.services as service, idx (service.provider + '-' + service.category + '-' + idx)}
									{@const color = providerColors[service.provider] || '#6b7280'}
									<div class="flex items-center gap-2 px-2 py-1.5 bg-gray-800/50 rounded text-xs">
										<div
											class="w-2 h-2 rounded-full shrink-0"
											style="background-color: {color};"
										></div>
										<span class="text-gray-400 w-12 shrink-0">{service.category}</span>
										<span class="text-gray-200 font-medium">{service.provider}</span>
									</div>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			{/if}
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
			<span class="text-xs text-gray-500">Node Types:</span>
			<div class="flex items-center gap-1.5">
				<FolderGit2 class="w-3.5 h-3.5 text-indigo-400" />
				<span class="text-xs text-gray-400">Source Repo</span>
			</div>
			<div class="flex items-center gap-1.5">
				<Server class="w-3.5 h-3.5 text-emerald-400" />
				<span class="text-xs text-gray-400">Deployed Instance</span>
			</div>
		</div>
	</div>
</div>
