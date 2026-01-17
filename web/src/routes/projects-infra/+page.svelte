<script lang="ts">
	import type { PageData } from './$types';
	import type { PersonalProject } from './+page.server';
	import {
		ExternalLink,
		ZoomIn,
		ZoomOut,
		ArrowUpAZ,
		ArrowDownZA,
		Focus,
		FolderGit2,
		Globe,
		Database,
		Cloud,
		Server,
		GitBranch,
		Layers,
		Shield,
		Mail,
		BarChart3,
		Activity,
		Code,
		Palette,
		TestTube,
		Package
	} from '@lucide/svelte';

	let { data }: { data: PageData } = $props();

	// View mode: cards (project cards), stack (tech stack focus), services (infra services)
	let viewMode = $state<'cards' | 'stack' | 'services'>('cards');

	// Static logos available in /logos folder
	const STATIC_LOGOS: Record<string, Record<string, boolean>> = {
		infra: {
			cloudflare: true, supabase: true, vercel: true, github: true, firebase: true,
			digitalocean: true, netlify: true, sentry: true, resend: true, aws: true,
			flyio: true, twilio: true, mailgun: true
		},
		techstack: {
			svelte: true, sveltekit: true, tailwind: true, vite: true, typescript: true,
			npm: true, playwright: true, vitest: true, angular: true, react: true,
			nextjs: true, pnpm: true, bun: true, lucide: true, nodejs: true
		}
	};

	// Helper to get logo URL for a provider/techstack item
	function getLogoUrl(type: 'infra' | 'techstack', name: string): string | null {
		const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '');

		// First check R2 logos from data
		const logo = data.logos?.find(l =>
			l.type === type && l.name.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedName
		);
		if (logo?.url) return logo.url;

		// Fallback to static logos
		if (STATIC_LOGOS[type]?.[normalizedName]) {
			return `/logos/${type}/${normalizedName}.svg`;
		}
		return null;
	}

	// Sorting
	let sortAsc = $state(true);

	// Canvas state - pan (x, y) and zoom
	let panX = $state(40);
	let panY = $state(40);
	let zoom = $state(1);
	let containerRef: HTMLDivElement;

	// Drag state
	let isDragging = $state(false);
	let dragStart = { x: 0, y: 0, panX: 0, panY: 0 };

	// Grid config
	const CARD_WIDTH = viewMode === 'stack' ? 380 : viewMode === 'services' ? 400 : 320;
	const CARD_HEIGHT = viewMode === 'stack' ? 180 : viewMode === 'services' ? 200 : 140;
	const GAP_X = 30;
	const GAP_Y = 30;
	const COLUMNS = viewMode === 'services' ? 2 : 3;
	const PADDING = 60;

	// Provider colors
	const providerColors: Record<string, { bg: string; text: string; border: string }> = {
		cloudflare: { bg: 'bg-orange-950/50', text: 'text-orange-400', border: 'border-orange-600' },
		flyio: { bg: 'bg-violet-950/50', text: 'text-violet-400', border: 'border-violet-600' },
		firebase: { bg: 'bg-yellow-950/50', text: 'text-yellow-400', border: 'border-yellow-600' },
		github: { bg: 'bg-gray-800', text: 'text-gray-400', border: 'border-gray-600' },
		none: { bg: 'bg-gray-800/50', text: 'text-gray-500', border: 'border-gray-700' },
		unknown: { bg: 'bg-gray-800', text: 'text-gray-400', border: 'border-gray-600' },
	};

	const dbColors: Record<string, string> = {
		supabase: 'text-green-400',
		pocketbase: 'text-amber-400',
		firebase: 'text-yellow-400',
	};

	const frameworkColors: Record<string, string> = {
		sveltekit: 'text-orange-400',
		svelte: 'text-orange-400',
		angular: 'text-red-400',
		nextjs: 'text-white',
		react: 'text-cyan-400',
		node: 'text-green-400',
	};

	const serviceIcons: Record<string, typeof Cloud> = {
		hosting: Cloud,
		database: Database,
		auth: Shield,
		storage: Server,
		dns: Globe,
		email: Mail,
		ci: GitBranch,
		monitoring: Activity,
		analytics: BarChart3,
		cdn: Globe,
	};

	let sortedProjects = $derived(
		sortAsc
			? [...data.projects].sort((a, b) => a.displayName.localeCompare(b.displayName))
			: [...data.projects].sort((a, b) => b.displayName.localeCompare(a.displayName))
	);

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

	// Dynamic dimensions based on view mode
	let cardWidth = $derived(viewMode === 'stack' ? 380 : viewMode === 'services' ? 400 : 320);
	let cardHeight = $derived(viewMode === 'stack' ? 180 : viewMode === 'services' ? 220 : 140);
	let columns = $derived(viewMode === 'services' ? 2 : 3);

	function getContentDimensions() {
		const rows = Math.ceil(sortedProjects.length / columns);
		return {
			width: PADDING + columns * (cardWidth + GAP_X) - GAP_X + PADDING,
			height: PADDING + rows * (cardHeight + GAP_Y) - GAP_Y + PADDING
		};
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

	let contentDimensions = $derived(getContentDimensions());
</script>

<svelte:head>
	<title>My Projects | Orchon</title>
</svelte:head>

<div class="h-full flex bg-gray-950 overflow-hidden">
	<!-- Left Sidebar with View Tabs -->
	<div class="w-48 shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col">
		<div class="p-3 border-b border-gray-800">
			<h2 class="text-sm font-semibold text-white">My Projects</h2>
			<span class="text-xs text-gray-500">{sortedProjects.length} projects</span>
		</div>

		<!-- View Mode Tabs -->
		<nav class="flex-1 p-2 space-y-1">
			<button
				onclick={() => viewMode = 'cards'}
				class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all {viewMode === 'cards'
					? 'bg-blue-600 text-white shadow-lg'
					: 'text-gray-400 hover:bg-gray-800 hover:text-white'}"
			>
				<Layers class="w-4 h-4 shrink-0" />
				<span class="text-sm font-medium">Projects</span>
			</button>
			<button
				onclick={() => viewMode = 'stack'}
				class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all {viewMode === 'stack'
					? 'bg-blue-600 text-white shadow-lg'
					: 'text-gray-400 hover:bg-gray-800 hover:text-white'}"
			>
				<Code class="w-4 h-4 shrink-0" />
				<span class="text-sm font-medium">Stack</span>
			</button>
			<button
				onclick={() => viewMode = 'services'}
				class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all {viewMode === 'services'
					? 'bg-blue-600 text-white shadow-lg'
					: 'text-gray-400 hover:bg-gray-800 hover:text-white'}"
			>
				<Server class="w-4 h-4 shrink-0" />
				<span class="text-sm font-medium">Services</span>
			</button>
		</nav>

		<!-- Controls at bottom -->
		<div class="p-2 border-t border-gray-800 space-y-2">
			<button
				onclick={() => sortAsc = !sortAsc}
				class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
			>
				{#if sortAsc}
					<ArrowUpAZ class="w-3.5 h-3.5" />
				{:else}
					<ArrowDownZA class="w-3.5 h-3.5" />
				{/if}
				Sort {sortAsc ? 'A-Z' : 'Z-A'}
			</button>
			<div class="flex items-center gap-1">
				<button onclick={zoomOut} class="flex-1 p-1.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors">
					<ZoomOut class="w-3.5 h-3.5 mx-auto" />
				</button>
				<span class="flex-1 text-xs text-gray-500 text-center">{Math.round(zoom * 100)}%</span>
				<button onclick={zoomIn} class="flex-1 p-1.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors">
					<ZoomIn class="w-3.5 h-3.5 mx-auto" />
				</button>
			</div>
			<button
				onclick={fitToView}
				class="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs text-white font-medium transition-colors"
			>
				<Focus class="w-3.5 h-3.5" />
				Fit to View
			</button>
		</div>
	</div>

	<!-- Main Content Area -->
	<div class="flex-1 flex flex-col overflow-hidden">

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
			<!-- SVG for connecting lines (dotted style) -->
			<svg class="absolute top-0 left-0 pointer-events-none" style="width: {contentDimensions.width}px; height: {contentDimensions.height}px;">
				<!-- Decorative dotted lines connecting rows -->
				{#each Array(Math.ceil(sortedProjects.length / columns)) as _, rowIdx}
					{@const y = PADDING + rowIdx * (cardHeight + GAP_Y) + cardHeight / 2}
					<line
						x1={PADDING - 20}
						y1={y}
						x2={PADDING + columns * (cardWidth + GAP_X) - GAP_X + 20}
						y2={y}
						stroke="rgba(75, 85, 99, 0.3)"
						stroke-width="1"
						stroke-dasharray="4 8"
					/>
				{/each}
			</svg>

			<!-- Project Cards -->
			{#each sortedProjects as project, idx (project.id)}
				{@const col = idx % columns}
				{@const row = Math.floor(idx / columns)}
				{@const x = PADDING + col * (cardWidth + GAP_X)}
				{@const y = PADDING + row * (cardHeight + GAP_Y)}
				{@const colors = providerColors[project.hostingProvider] || providerColors.unknown}

				{#if viewMode === 'cards'}
					<!-- Cards View -->
					<div
						class="absolute rounded-lg overflow-hidden shadow-xl transition-all hover:shadow-2xl {colors.bg} border {colors.border}"
						style="left: {x}px; top: {y}px; width: {cardWidth}px; height: {cardHeight}px;"
					>
						<div class="px-4 py-2.5 border-b border-gray-700/50 flex items-center justify-between">
							<div class="flex items-center gap-2.5">
								<FolderGit2 class="w-4 h-4 {colors.text}" />
								<span class="font-semibold text-white text-sm">{project.displayName}</span>
							</div>
							<div class="flex items-center gap-2">
								{#if project.database}
									<div class="flex items-center gap-1 px-1.5 py-0.5 bg-gray-800/80 rounded text-[10px] {dbColors[project.database] || 'text-gray-400'}">
										<Database class="w-3 h-3" />
										<span>{project.database}</span>
									</div>
								{/if}
								<div class="flex items-center gap-1 px-1.5 py-0.5 bg-gray-800/80 rounded text-[10px] {colors.text}">
									<Cloud class="w-3 h-3" />
									<span>{project.hostingProvider}</span>
								</div>
							</div>
						</div>
						<div class="px-4 py-3 space-y-2">
							{#if project.productionUrl}
								<a
									href={project.productionUrl}
									target="_blank"
									rel="noopener noreferrer"
									class="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 group"
								>
									<Globe class="w-3.5 h-3.5" />
									<span class="truncate">{getDisplayUrl(project.productionUrl)}</span>
									<ExternalLink class="w-3 h-3 opacity-60 group-hover:opacity-100" />
								</a>
							{:else}
								<div class="flex items-center gap-2 text-sm text-gray-500">
									<Globe class="w-3.5 h-3.5" />
									<span>No production URL</span>
								</div>
							{/if}
							<a
								href={project.repoUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 group"
							>
								<GitBranch class="w-3.5 h-3.5" />
								<span class="truncate">{project.id}</span>
								<ExternalLink class="w-3 h-3 opacity-60 group-hover:opacity-100" />
							</a>
						</div>
					</div>

				{:else if viewMode === 'stack'}
					<!-- Stack View -->
					<div
						class="absolute rounded-lg overflow-hidden shadow-xl transition-all hover:shadow-2xl bg-gray-800/60 border border-gray-700"
						style="left: {x}px; top: {y}px; width: {cardWidth}px; height: {cardHeight}px;"
					>
						<div class="px-4 py-2.5 border-b border-gray-700/50 flex items-center justify-between">
							<div class="flex items-center gap-2.5">
								<Code class="w-4 h-4 text-blue-400" />
								<span class="font-semibold text-white text-sm">{project.displayName}</span>
							</div>
							{#if project.stack?.framework}
								<div class="flex items-center gap-1 px-2 py-0.5 bg-gray-900/80 rounded text-xs {frameworkColors[project.stack.framework] || 'text-gray-400'}">
									{project.stack.framework}
								</div>
							{/if}
						</div>
						<div class="px-4 py-3 space-y-3">
							{#if project.stack}
								<div class="flex flex-wrap gap-1.5">
									<!-- Framework -->
									{#if project.stack.framework}
										{@const frameworkLogo = getLogoUrl('techstack', project.stack.framework)}
										<div class="flex items-center gap-1 px-2 py-0.5 bg-orange-900/40 rounded text-[10px] text-orange-300">
											{#if frameworkLogo}
												<img src={frameworkLogo} alt={project.stack.framework} class="w-3 h-3 object-contain" />
											{/if}
											{project.stack.framework}
										</div>
									{/if}
									<!-- Language -->
									{#if project.stack.language}
										{@const langLogo = getLogoUrl('techstack', project.stack.language)}
										<div class="flex items-center gap-1 px-2 py-0.5 bg-blue-900/40 rounded text-[10px] text-blue-300">
											{#if langLogo}
												<img src={langLogo} alt={project.stack.language} class="w-3 h-3 object-contain" />
											{/if}
											{project.stack.language}
										</div>
									{/if}
									<!-- CSS -->
									{#each project.stack.css || [] as css}
										{@const cssLogo = getLogoUrl('techstack', css)}
										<div class="flex items-center gap-1 px-2 py-0.5 bg-pink-900/40 rounded text-[10px] text-pink-300">
											{#if cssLogo}
												<img src={cssLogo} alt={css} class="w-3 h-3 object-contain" />
											{:else}
												<Palette class="w-2.5 h-2.5" />
											{/if}
											{css}
										</div>
									{/each}
									<!-- Build Tool -->
									{#if project.stack.buildTool}
										{@const buildLogo = getLogoUrl('techstack', project.stack.buildTool)}
										<div class="flex items-center gap-1 px-2 py-0.5 bg-yellow-900/40 rounded text-[10px] text-yellow-300">
											{#if buildLogo}
												<img src={buildLogo} alt={project.stack.buildTool} class="w-3 h-3 object-contain" />
											{:else}
												<Package class="w-2.5 h-2.5" />
											{/if}
											{project.stack.buildTool}
										</div>
									{/if}
									<!-- Package Manager -->
									{#if project.stack.packageManager}
										{@const pmLogo = getLogoUrl('techstack', project.stack.packageManager)}
										<div class="flex items-center gap-1 px-2 py-0.5 bg-green-900/40 rounded text-[10px] text-green-300">
											{#if pmLogo}
												<img src={pmLogo} alt={project.stack.packageManager} class="w-3 h-3 object-contain" />
											{/if}
											{project.stack.packageManager}
										</div>
									{/if}
								</div>
								<div class="flex flex-wrap gap-1.5">
									<!-- Testing -->
									{#each project.stack.testing || [] as test}
										{@const testLogo = getLogoUrl('techstack', test)}
										<div class="flex items-center gap-1 px-2 py-0.5 bg-purple-900/40 rounded text-[10px] text-purple-300">
											{#if testLogo}
												<img src={testLogo} alt={test} class="w-3 h-3 object-contain" />
											{:else}
												<TestTube class="w-2.5 h-2.5" />
											{/if}
											{test}
										</div>
									{/each}
									<!-- Icons -->
									{#if project.stack.icons}
										{@const iconsLogo = getLogoUrl('techstack', project.stack.icons)}
										<div class="flex items-center gap-1 px-2 py-0.5 bg-gray-700/60 rounded text-[10px] text-gray-300">
											{#if iconsLogo}
												<img src={iconsLogo} alt={project.stack.icons} class="w-3 h-3 object-contain" />
											{/if}
											{project.stack.icons}
										</div>
									{/if}
								</div>
								{#if project.stack.adapter}
									<div class="text-[10px] text-gray-500">
										Adapter: {project.stack.adapter}
									</div>
								{/if}
							{:else}
								<div class="text-sm text-gray-500">No stack info</div>
							{/if}
						</div>
					</div>

				{:else if viewMode === 'services'}
					<!-- Services View -->
					<div
						class="absolute rounded-lg overflow-hidden shadow-xl transition-all hover:shadow-2xl bg-gray-800/60 border border-gray-700"
						style="left: {x}px; top: {y}px; width: {cardWidth}px; height: {cardHeight}px;"
					>
						<div class="px-4 py-2.5 border-b border-gray-700/50 flex items-center justify-between">
							<div class="flex items-center gap-2.5">
								<Server class="w-4 h-4 text-emerald-400" />
								<span class="font-semibold text-white text-sm">{project.displayName}</span>
							</div>
							<span class="text-[10px] text-gray-500">{project.services.length} services</span>
						</div>
						<div class="px-3 py-2 space-y-1 overflow-y-auto" style="max-height: {cardHeight - 50}px;">
							{#if project.services.length > 0}
								{#each project.services as service}
									{@const Icon = serviceIcons[service.category] || Cloud}
									{@const providerLogo = getLogoUrl('infra', service.provider)}
									<a
										href={service.dashboardUrl || '#'}
										target="_blank"
										rel="noopener noreferrer"
										class="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-700/50 transition-colors group"
									>
										{#if providerLogo}
											<img src={providerLogo} alt={service.provider} class="w-4 h-4 object-contain" />
										{:else}
											<Icon class="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-300" />
										{/if}
										<div class="flex-1 min-w-0">
											<div class="text-xs text-gray-300 truncate">{service.serviceName}</div>
											<div class="text-[10px] text-gray-500">{service.provider}</div>
										</div>
										{#if service.dashboardUrl}
											<ExternalLink class="w-3 h-3 text-gray-600 group-hover:text-gray-400" />
										{/if}
									</a>
								{/each}
							{:else}
								<div class="text-sm text-gray-500 py-4 text-center">No services configured</div>
							{/if}
						</div>
					</div>
				{/if}
			{/each}
		</div>
	</div>
	</div>
</div>
