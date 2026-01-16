<script lang="ts">
	import type { PageData } from './$types';
	import type { ResolvedClient, PackageInfo } from './+page.server';
	import {
		ExternalLink,
		ZoomIn,
		ZoomOut,
		ArrowUpAZ,
		ArrowDownZA,
		Focus,
		FolderGit2,
		Server,
		Building2,
		School,
		Globe,
		Network,
		Settings,
		Package
	} from '@lucide/svelte';

	let { data }: { data: PageData } = $props();

	// View mode: 'repos' shows source repos with instances, 'ownership' shows clients with org portals and campuses, 'flat' shows all projects
	let viewMode = $state<'repos' | 'ownership' | 'flat'>('ownership');

	// Sorting
	let sortAsc = $state(true);

	// Toggle overrides from localStorage (for filtering which projects to show)
	let toggleOverrides = $state<Record<string, boolean>>({});

	// Load toggle overrides from localStorage on mount
	$effect(() => {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('gcp-project-overrides');
			if (saved) {
				try {
					toggleOverrides = JSON.parse(saved);
				} catch {
					toggleOverrides = {};
				}
			}
		}
	});

	// Check if a GCP project is enabled (considering overrides)
	function isProjectEnabled(gcpProjectId: string, defaultEnabled: boolean): boolean {
		if (gcpProjectId in toggleOverrides) {
			return toggleOverrides[gcpProjectId];
		}
		return defaultEnabled;
	}

	// For flat view - filter out instances (show only standalone projects and source repos)
	let standaloneProjects = $derived(
		data.projects.filter(p => !p.sourceRepo)
	);

	let sortedStandaloneProjects = $derived(
		sortAsc
			? [...standaloneProjects].sort((a, b) => a.displayName.localeCompare(b.displayName))
			: [...standaloneProjects].sort((a, b) => b.displayName.localeCompare(a.displayName))
	);

	// For repos view - source repos with their instances
	let sortedSourceRepos = $derived(
		sortAsc
			? [...data.sourceRepos].sort((a, b) => a.displayName.localeCompare(b.displayName))
			: [...data.sourceRepos].sort((a, b) => b.displayName.localeCompare(a.displayName))
	);

	// For ownership view - clients with org portals and campuses (3-level hierarchy)
	// Filter out clients where all campuses are disabled
	let filteredClients = $derived(
		data.clients.map((client: ResolvedClient) => {
			// Filter campuses based on toggle overrides
			const enabledCampuses = client.campuses.filter(campus =>
				isProjectEnabled(campus.gcpProject, true)
			);
			// Check if org portal is enabled
			const orgPortalEnabled = client.orgPortal
				? isProjectEnabled(client.orgPortal.gcpProject, true)
				: true;

			return {
				...client,
				campuses: enabledCampuses,
				orgPortal: orgPortalEnabled ? client.orgPortal : undefined,
			};
		}).filter(client => client.campuses.length > 0 || client.orgPortal)
	);

	let sortedClients = $derived(
		sortAsc
			? [...filteredClients].sort((a, b) => a.displayName.localeCompare(b.displayName))
			: [...filteredClients].sort((a, b) => b.displayName.localeCompare(a.displayName))
	);

	// Canvas state - pan (x, y) and zoom
	let panX = $state(40);
	let panY = $state(40);
	let zoom = $state(1);
	let containerRef: HTMLDivElement;

	// Drag state
	let isDragging = $state(false);
	let dragStart = { x: 0, y: 0, panX: 0, panY: 0 };

	// Grid config for hierarchy views
	const REPO_WIDTH = 280;
	const REPO_HEIGHT = 120;
	const INSTANCE_WIDTH = 240;
	const INSTANCE_HEIGHT = 80;
	// Ownership view: Client > Org Portal > Campuses
	const CLIENT_WIDTH = 200;  // Subdued, smaller
	const CLIENT_HEIGHT = 80;
	const ORG_PORTAL_WIDTH = 280;  // Prominent
	const ORG_PORTAL_HEIGHT = 100;
	const CAMPUS_WIDTH = 240;
	const CAMPUS_HEIGHT = 75;
	const COL1_TO_COL2_GAP = 120;  // Client to Org Portal
	const COL2_TO_COL3_GAP = 140;  // Org Portal to Campuses
	const VERTICAL_GAP = 20;
	const BLOCK_VERTICAL_GAP = 50;
	const PADDING = 60;

	// Provider/repo colors
	const repoColors: Record<string, string> = {
		'junipa': '#4285f4',  // GCP blue
		'junipa-organisations': '#8b5cf6',  // Purple
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

		const worldX = (mouseX - panX) / zoom;
		const worldY = (mouseY - panY) / zoom;

		const zoomDelta = e.deltaY > 0 ? 0.9 : 1.1;
		const newZoom = Math.max(0.1, Math.min(5, zoom * zoomDelta));

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

	// Calculate content dimensions
	function getContentDimensions() {
		if (viewMode === 'ownership') {
			let totalHeight = PADDING;
			for (const client of sortedClients) {
				// Height based on number of campuses
				const campusesHeight = client.campuses.length > 0
					? client.campuses.length * (CAMPUS_HEIGHT + VERTICAL_GAP) - VERTICAL_GAP
					: CAMPUS_HEIGHT;
				// Also consider org portal height
				const orgPortalHeight = client.orgPortal ? ORG_PORTAL_HEIGHT : 0;
				const blockHeight = Math.max(CLIENT_HEIGHT, orgPortalHeight, campusesHeight);
				totalHeight += blockHeight + BLOCK_VERTICAL_GAP;
			}
			// 3 columns: Client, Org Portal, Campuses
			const totalWidth = PADDING + CLIENT_WIDTH + COL1_TO_COL2_GAP + ORG_PORTAL_WIDTH + COL2_TO_COL3_GAP + CAMPUS_WIDTH + PADDING;
			return {
				width: totalWidth,
				height: totalHeight + PADDING
			};
		} else if (viewMode === 'repos') {
			let totalHeight = PADDING;
			for (const repo of sortedSourceRepos) {
				const instancesHeight = repo.instances.length > 0
					? repo.instances.length * (INSTANCE_HEIGHT + VERTICAL_GAP) - VERTICAL_GAP
					: 0;
				const repoBlockHeight = Math.max(REPO_HEIGHT, instancesHeight);
				totalHeight += repoBlockHeight + BLOCK_VERTICAL_GAP;
			}
			return {
				width: PADDING + REPO_WIDTH + COL1_TO_COL2_GAP + INSTANCE_WIDTH + PADDING,
				height: totalHeight + PADDING
			};
		}
		return { width: 1400, height: 1200 };
	}

	function fitToView() {
		if (!containerRef) return;
		const rect = containerRef.getBoundingClientRect();
		const padding = 60;
		const { width: contentWidth, height: contentHeight } = getContentDimensions();

		const scaleX = (rect.width - padding * 2) / contentWidth;
		const scaleY = (rect.height - padding * 2) / contentHeight;
		const newZoom = Math.min(scaleX, scaleY, 1);

		panX = (rect.width - contentWidth * newZoom) / 2;
		panY = (rect.height - contentHeight * newZoom) / 2;
		zoom = newZoom;
	}

	// Calculate positions for ownership view (3-level hierarchy: Client > Org Portal > Campuses)
	interface ClientPositions {
		clientX: number;
		clientY: number;
		orgPortalX?: number;
		orgPortalY?: number;
		campusPositions: { id: string; x: number; y: number }[];
	}

	function getClientPositions() {
		const positions: Map<string, ClientPositions> = new Map();
		let currentY = PADDING;

		// Column X positions
		const col1X = PADDING;  // Client
		const col2X = PADDING + CLIENT_WIDTH + COL1_TO_COL2_GAP;  // Org Portal
		const col3X = col2X + ORG_PORTAL_WIDTH + COL2_TO_COL3_GAP;  // Campuses

		for (const client of sortedClients) {
			// Calculate block height based on campuses
			const campusesHeight = client.campuses.length > 0
				? client.campuses.length * (CAMPUS_HEIGHT + VERTICAL_GAP) - VERTICAL_GAP
				: CAMPUS_HEIGHT;
			const orgPortalHeight = client.orgPortal ? ORG_PORTAL_HEIGHT : 0;
			const blockHeight = Math.max(CLIENT_HEIGHT, orgPortalHeight, campusesHeight);

			// Client card position (vertically centered in block)
			const clientX = col1X;
			const clientY = currentY + (blockHeight - CLIENT_HEIGHT) / 2;

			// Org Portal position (only if exists)
			let orgPortalX: number | undefined;
			let orgPortalY: number | undefined;
			if (client.orgPortal) {
				orgPortalX = col2X;
				orgPortalY = currentY + (blockHeight - ORG_PORTAL_HEIGHT) / 2;
			}

			// Campus positions
			const campusPositions: { id: string; x: number; y: number }[] = [];
			const campusesStartY = currentY + (blockHeight - campusesHeight) / 2;
			for (let i = 0; i < client.campuses.length; i++) {
				campusPositions.push({
					id: client.campuses[i].id,
					x: col3X,
					y: campusesStartY + i * (CAMPUS_HEIGHT + VERTICAL_GAP),
				});
			}

			positions.set(client.id, { clientX, clientY, orgPortalX, orgPortalY, campusPositions });
			currentY += blockHeight + BLOCK_VERTICAL_GAP;
		}

		return positions;
	}

	// Calculate positions for repos view
	function getRepoPositions() {
		const positions: Map<string, { x: number; y: number; instancePositions: { id: string; x: number; y: number }[] }> = new Map();
		let currentY = PADDING;

		for (const repo of sortedSourceRepos) {
			const instancesHeight = repo.instances.length > 0
				? repo.instances.length * (INSTANCE_HEIGHT + VERTICAL_GAP) - VERTICAL_GAP
				: 0;
			const repoBlockHeight = Math.max(REPO_HEIGHT, instancesHeight);

			const repoX = PADDING;
			const repoY = currentY + (repoBlockHeight - REPO_HEIGHT) / 2;

			const instancePositions: { id: string; x: number; y: number }[] = [];
			const instanceStartY = currentY + (repoBlockHeight - instancesHeight) / 2;

			for (let i = 0; i < repo.instances.length; i++) {
				instancePositions.push({
					id: repo.instances[i].id,
					x: PADDING + REPO_WIDTH + COL1_TO_COL2_GAP,
					y: instanceStartY + i * (INSTANCE_HEIGHT + VERTICAL_GAP),
				});
			}

			positions.set(repo.id, { x: repoX, y: repoY, instancePositions });
			currentY += repoBlockHeight + BLOCK_VERTICAL_GAP;
		}

		return positions;
	}

	let clientPositions = $derived(getClientPositions());
	let repoPositions = $derived(getRepoPositions());
	let contentDimensions = $derived(getContentDimensions());
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
					onclick={() => viewMode = 'ownership'}
					class="px-3 py-1 text-xs rounded-md transition-colors {viewMode === 'ownership' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'}"
				>
					Ownership
				</button>
				<button
					onclick={() => viewMode = 'repos'}
					class="px-3 py-1 text-xs rounded-md transition-colors {viewMode === 'repos' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}"
				>
					Repos
				</button>
				<button
					onclick={() => viewMode = 'flat'}
					class="px-3 py-1 text-xs rounded-md transition-colors {viewMode === 'flat' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}"
				>
					Flat
				</button>
			</div>
			<span class="text-xs text-gray-500">
				{#if viewMode === 'ownership'}
					{sortedClients.length} clients, {sortedClients.filter(c => c.orgPortal).length} org portals, {sortedClients.reduce((acc, c) => acc + c.campuses.length, 0)} campuses
				{:else if viewMode === 'repos'}
					{sortedSourceRepos.length} repos, {sortedSourceRepos.reduce((acc, r) => acc + r.instances.length, 0)} instances
				{:else}
					{sortedStandaloneProjects.length} projects
				{/if}
			</span>
		</div>
		<div class="flex items-center gap-2">
			<a
				href="/infrastructure/settings"
				class="flex items-center gap-1.5 px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 transition-colors"
				title="Manage GCP Projects"
			>
				<Settings class="w-3.5 h-3.5" />
				Settings
			</a>
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
		Scroll to zoom | Drag to pan | {viewMode === 'ownership' ? 'Organisation ownership hierarchy' : viewMode === 'repos' ? 'Source repos with deployed instances' : 'All projects'}
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
		<!-- Grid background -->
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
			style="transform: translate({panX}px, {panY}px) scale({zoom});"
		>
			{#if viewMode === 'ownership'}
				<!-- Ownership View: 3-level hierarchy - Client > Org Portal > Campuses -->
				<svg class="absolute top-0 left-0 pointer-events-none" style="width: {contentDimensions.width}px; height: {contentDimensions.height}px;">
					{#each sortedClients as client (client.id)}
						{@const pos = clientPositions.get(client.id)}
						{#if pos}
							<!-- Lines from Client to Org Portal (if exists) -->
							{#if client.orgPortal && pos.orgPortalX !== undefined && pos.orgPortalY !== undefined}
								<path
									d="M {pos.clientX + CLIENT_WIDTH} {pos.clientY + CLIENT_HEIGHT / 2}
									   C {pos.clientX + CLIENT_WIDTH + COL1_TO_COL2_GAP / 2} {pos.clientY + CLIENT_HEIGHT / 2},
									     {pos.orgPortalX - COL1_TO_COL2_GAP / 2} {pos.orgPortalY + ORG_PORTAL_HEIGHT / 2},
									     {pos.orgPortalX} {pos.orgPortalY + ORG_PORTAL_HEIGHT / 2}"
									fill="none"
									stroke="rgba(139, 92, 246, 0.5)"
									stroke-width="2"
								/>
								<!-- Lines from Org Portal to Campuses -->
								{#each pos.campusPositions as campusPos (campusPos.id)}
									<path
										d="M {pos.orgPortalX + ORG_PORTAL_WIDTH} {pos.orgPortalY + ORG_PORTAL_HEIGHT / 2}
										   C {pos.orgPortalX + ORG_PORTAL_WIDTH + COL2_TO_COL3_GAP / 2} {pos.orgPortalY + ORG_PORTAL_HEIGHT / 2},
										     {campusPos.x - COL2_TO_COL3_GAP / 2} {campusPos.y + CAMPUS_HEIGHT / 2},
										     {campusPos.x} {campusPos.y + CAMPUS_HEIGHT / 2}"
										fill="none"
										stroke="rgba(16, 185, 129, 0.4)"
										stroke-width="2"
										stroke-dasharray="6 4"
									/>
									<circle
										cx={campusPos.x}
										cy={campusPos.y + CAMPUS_HEIGHT / 2}
										r="4"
										fill="rgb(16, 185, 129)"
									/>
								{/each}
							{:else}
								<!-- No org portal - draw lines directly from Client to Campuses -->
								{#each pos.campusPositions as campusPos (campusPos.id)}
									<path
										d="M {pos.clientX + CLIENT_WIDTH} {pos.clientY + CLIENT_HEIGHT / 2}
										   C {pos.clientX + CLIENT_WIDTH + (COL1_TO_COL2_GAP + ORG_PORTAL_WIDTH + COL2_TO_COL3_GAP) / 2} {pos.clientY + CLIENT_HEIGHT / 2},
										     {campusPos.x - COL2_TO_COL3_GAP / 2} {campusPos.y + CAMPUS_HEIGHT / 2},
										     {campusPos.x} {campusPos.y + CAMPUS_HEIGHT / 2}"
										fill="none"
										stroke="rgba(75, 85, 99, 0.6)"
										stroke-width="2"
										stroke-dasharray="4 4"
									/>
									<circle
										cx={campusPos.x}
										cy={campusPos.y + CAMPUS_HEIGHT / 2}
										r="4"
										fill="rgb(107, 114, 128)"
									/>
								{/each}
							{/if}
						{/if}
					{/each}
				</svg>

				{#each sortedClients as client (client.id)}
					{@const pos = clientPositions.get(client.id)}
					{#if pos}
						<!-- Client Card (subdued, plain) -->
						<div
							class="absolute bg-gray-800/60 border border-gray-700 rounded-lg overflow-hidden"
							style="left: {pos.clientX}px; top: {pos.clientY}px; width: {CLIENT_WIDTH}px; min-height: {CLIENT_HEIGHT}px;"
						>
							<div class="px-3 py-2">
								<div class="flex items-center gap-2">
									<Building2 class="w-4 h-4 text-gray-400" />
									<span class="font-medium text-gray-200 text-sm">{client.displayName}</span>
								</div>
								{#if client.marketingUrl}
									<a
										href={client.marketingUrl}
										target="_blank"
										rel="noopener noreferrer"
										class="flex items-center gap-1 text-[10px] text-gray-500 hover:text-gray-400 mt-1.5 group"
									>
										<Globe class="w-3 h-3" />
										<span class="truncate">{getDisplayUrl(client.marketingUrl)}</span>
										<ExternalLink class="w-2 h-2 opacity-50 group-hover:opacity-100" />
									</a>
								{/if}
								<div class="text-[10px] text-gray-600 mt-1">
									{client.campuses.length} campus{client.campuses.length !== 1 ? 'es' : ''}
								</div>
							</div>
						</div>

						<!-- Org Portal Card (prominent emerald, only if exists) -->
						{#if client.orgPortal && pos.orgPortalX !== undefined && pos.orgPortalY !== undefined}
							<div
								class="absolute bg-gray-900 border-2 border-emerald-500 rounded-lg overflow-hidden shadow-xl shadow-emerald-500/10"
								style="left: {pos.orgPortalX}px; top: {pos.orgPortalY}px; width: {ORG_PORTAL_WIDTH}px; min-height: {ORG_PORTAL_HEIGHT}px;"
							>
								<div class="px-4 py-2.5 bg-emerald-950/50 border-b border-emerald-500/30">
									<div class="flex items-center gap-2">
										<Network class="w-4 h-4 text-emerald-400" />
										<span class="font-semibold text-white text-sm">Org Portal</span>
									</div>
									<div class="text-[9px] text-emerald-300/70 mt-0.5">junipa-organisations</div>
								</div>
								<div class="px-4 py-2">
									{#if client.orgPortal.productionUrl}
										<a
											href={client.orgPortal.productionUrl}
											target="_blank"
											rel="noopener noreferrer"
											class="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 group"
										>
											<span class="truncate">{client.orgPortal.customDomain}</span>
											<ExternalLink class="w-2.5 h-2.5 opacity-60 group-hover:opacity-100" />
										</a>
									{/if}
									<div class="text-[9px] text-gray-500 mt-1 font-mono">{client.orgPortal.gcpProject}</div>
								</div>
							</div>
						{/if}

						<!-- Campus Cards -->
						{#each pos.campusPositions as campusPos, i (campusPos.id)}
							{@const campus = client.campuses[i]}
							<div
								class="absolute bg-gray-900 border border-gray-600 rounded-lg overflow-hidden shadow-lg hover:border-gray-500 transition-colors"
								style="left: {campusPos.x}px; top: {campusPos.y}px; width: {CAMPUS_WIDTH}px; min-height: {CAMPUS_HEIGHT}px;"
							>
								<div class="px-3 py-1.5 bg-gray-800/50 border-b border-gray-700">
									<div class="flex items-center gap-2">
										<School class="w-3.5 h-3.5 text-blue-400" />
										<span class="font-medium text-white text-xs truncate">{campus.displayName}</span>
									</div>
								</div>
								<div class="px-3 py-1.5">
									{#if campus.productionUrl}
										<a
											href={campus.productionUrl}
											target="_blank"
											rel="noopener noreferrer"
											class="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 group"
										>
											<span class="truncate">{campus.customDomain || getDisplayUrl(campus.productionUrl)}</span>
											<ExternalLink class="w-2.5 h-2.5 opacity-60 group-hover:opacity-100" />
										</a>
									{/if}
									<div class="text-[9px] text-gray-500 mt-0.5 font-mono">{campus.gcpProject}</div>
								</div>
							</div>
						{/each}
					{/if}
				{/each}

			{:else if viewMode === 'repos'}
				<!-- Repos View: Source repos with deployed instances -->
				<svg class="absolute top-0 left-0 pointer-events-none" style="width: {contentDimensions.width}px; height: {contentDimensions.height}px;">
					{#each sortedSourceRepos as repo (repo.id)}
						{@const pos = repoPositions.get(repo.id)}
						{#if pos && repo.instances.length > 0}
							{#each pos.instancePositions as instPos (instPos.id)}
								<path
									d="M {pos.x + REPO_WIDTH} {pos.y + REPO_HEIGHT / 2}
									   C {pos.x + REPO_WIDTH + COL1_TO_COL2_GAP / 2} {pos.y + REPO_HEIGHT / 2},
									     {instPos.x - COL1_TO_COL2_GAP / 2} {instPos.y + INSTANCE_HEIGHT / 2},
									     {instPos.x} {instPos.y + INSTANCE_HEIGHT / 2}"
									fill="none"
									stroke="rgba(99, 102, 241, 0.4)"
									stroke-width="2"
									stroke-dasharray="6 4"
								/>
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

				{#each sortedSourceRepos as repo (repo.id)}
					{@const pos = repoPositions.get(repo.id)}
					{@const identityColor = identityColors[repo.identity] || '#6b7280'}
					{#if pos}
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

			{:else}
				<!-- Flat view - grid of all projects -->
				<div class="grid gap-8 p-10" style="grid-template-columns: repeat(4, 280px);">
					{#each sortedStandaloneProjects as project (project.id)}
						{@const identityColor = identityColors[project.identity] || '#6b7280'}
						{@const hostProvider = getHostingProvider(project.services)}
						<div
							class="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-xl hover:border-gray-500 transition-colors"
							style="border-left: 4px solid {identityColor}; width: 280px;"
						>
							<div class="px-4 py-3 bg-gray-800/70 border-b border-gray-700">
								<div class="flex items-center justify-between gap-2">
									<div class="flex items-center gap-2">
										{#if project.isSourceRepo}
											<FolderGit2 class="w-4 h-4 text-indigo-400" />
										{/if}
										<span class="font-semibold text-white text-sm">{project.displayName}</span>
									</div>
									<span class="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-700 text-gray-300">
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

							<div class="p-3 space-y-1.5 max-h-[200px] overflow-y-auto">
								{#each project.services as service, idx (service.provider + '-' + service.category + '-' + idx)}
									<div class="flex items-center gap-2 px-2 py-1.5 bg-gray-800/50 rounded text-xs">
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
	<div class="shrink-0 px-4 py-2 bg-gray-900/90 border-t border-gray-800 flex items-center justify-between gap-6 flex-wrap">
		<div class="flex items-center gap-6 flex-wrap">
			{#if viewMode === 'ownership'}
				<div class="flex items-center gap-3">
					<span class="text-xs text-gray-500">Hierarchy:</span>
					<div class="flex items-center gap-1.5">
						<Building2 class="w-3.5 h-3.5 text-gray-400" />
						<span class="text-xs text-gray-400">Client</span>
					</div>
					<div class="flex items-center gap-1.5">
						<Network class="w-3.5 h-3.5 text-emerald-400" />
						<span class="text-xs text-gray-400">Org Portal</span>
					</div>
					<div class="flex items-center gap-1.5">
						<School class="w-3.5 h-3.5 text-blue-400" />
						<span class="text-xs text-gray-400">Campus</span>
					</div>
				</div>
				<div class="flex items-center gap-3">
					<span class="text-xs text-gray-500">Lines:</span>
					<div class="flex items-center gap-1.5">
						<div class="w-6 h-0.5 rounded bg-purple-500"></div>
						<span class="text-xs text-gray-400">to org portal</span>
					</div>
					<div class="flex items-center gap-1.5">
						<div class="w-6 h-0.5 rounded bg-emerald-500 opacity-60" style="background: repeating-linear-gradient(90deg, rgb(16 185 129 / 0.6) 0px, rgb(16 185 129 / 0.6) 4px, transparent 4px, transparent 8px);"></div>
						<span class="text-xs text-gray-400">to campus</span>
					</div>
				</div>
			{:else if viewMode === 'repos'}
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
			{:else}
				<div class="flex items-center gap-3">
					<span class="text-xs text-gray-500">Identity:</span>
					{#each Object.entries(identityColors) as [identity, color] (identity)}
						<div class="flex items-center gap-1.5">
							<div class="w-3 h-3 rounded" style="background-color: {color};"></div>
							<span class="text-xs text-gray-400">{identity}</span>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Package Info -->
		{#if data.packageInfo}
			<div class="flex items-center gap-4 text-xs border-l border-gray-700 pl-4">
				<div class="flex items-center gap-1.5">
					<Package class="w-3.5 h-3.5 text-cyan-500" />
					<span class="text-gray-400 font-mono">{data.packageInfo.name}</span>
					<span class="text-cyan-400 font-mono">v{data.packageInfo.version}</span>
				</div>
				<div class="flex items-center gap-2 text-gray-500">
					<span>{data.packageInfo.dependencyCount} deps</span>
					<span class="text-gray-600">|</span>
					<span>{data.packageInfo.devDependencyCount} dev</span>
				</div>
				<div class="flex items-center gap-1.5 text-gray-600">
					{#each data.packageInfo.keyPackages.slice(0, 4) as pkg (pkg)}
						<span class="px-1.5 py-0.5 bg-gray-800 rounded text-[10px] text-gray-400">{pkg.replace('@', '').split('/').pop()}</span>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>
