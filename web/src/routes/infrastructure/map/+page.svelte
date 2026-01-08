<script lang="ts">
	import type { PageData } from './$types';
	import { browser } from '$app/environment';
	import { onMount, onDestroy } from 'svelte';
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

	// Canvas ref and PixiJS app
	let canvasContainer: HTMLDivElement;
	let pixiApp: import('pixi.js').Application | null = null;
	let worldContainer: import('pixi.js').Container | null = null;
	let currentZoom = $state(1);

	// Grid config
	const COLS = 4;
	const CARD_WIDTH = 300;
	const CARD_HEIGHT = 340;
	const GAP = 40;
	const PADDING = 50;

	// Provider colors
	const providerColors: Record<string, number> = {
		cloudflare: 0xf38020,
		supabase: 0x3ecf8e,
		flyio: 0x7c3aed,
		firebase: 0xffca28,
		gcp: 0x4285f4,
		github: 0x6e7681,
		pocketbase: 0xb8dbe4,
		sentry: 0x362d59,
		vercel: 0x000000,
		netlify: 0x00c7b7,
		resend: 0x000000,
		sendgrid: 0x1a82e2,
		mailgun: 0xf06b66,
		digitalocean: 0x0080ff,
	};

	// Identity colors
	const identityColors: Record<string, number> = {
		jaslr: 0x3b82f6,
		'jvp-ux': 0x8b5cf6,
	};

	// Category labels
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

	// Card position
	function getCardPosition(index: number) {
		const col = index % COLS;
		const row = Math.floor(index / COLS);
		return {
			x: PADDING + col * (CARD_WIDTH + GAP),
			y: PADDING + row * (CARD_HEIGHT + GAP),
		};
	}

	// Pan/zoom state
	let isDragging = false;
	let lastPointerPos = { x: 0, y: 0 };

	// Initialize PixiJS
	onMount(async () => {
		if (!browser || !canvasContainer) return;

		const PIXI = await import('pixi.js');

		// Create application with WebGL
		pixiApp = new PIXI.Application();
		await pixiApp.init({
			resizeTo: canvasContainer,
			backgroundColor: 0x030712,
			antialias: true,
			resolution: window.devicePixelRatio || 1,
			autoDensity: true,
		});

		canvasContainer.appendChild(pixiApp.canvas);

		// Create world container for pan/zoom
		worldContainer = new PIXI.Container();
		worldContainer.x = 20;
		worldContainer.y = 20;
		pixiApp.stage.addChild(worldContainer);

		// Draw grid background
		const gridGraphics = new PIXI.Graphics();
		const gridSize = 40;
		const gridWidth = 3000;
		const gridHeight = 3000;
		gridGraphics.setStrokeStyle({ width: 0.5, color: 0x374151, alpha: 0.3 });
		for (let x = 0; x <= gridWidth; x += gridSize) {
			gridGraphics.moveTo(x, 0);
			gridGraphics.lineTo(x, gridHeight);
		}
		for (let y = 0; y <= gridHeight; y += gridSize) {
			gridGraphics.moveTo(0, y);
			gridGraphics.lineTo(gridWidth, y);
		}
		gridGraphics.stroke();
		worldContainer.addChild(gridGraphics);

		// Render cards
		renderCards(PIXI);

		// Setup interaction
		setupInteraction();
	});

	function renderCards(PIXI: typeof import('pixi.js')) {
		if (!worldContainer) return;

		// Clear existing cards (except grid)
		while (worldContainer.children.length > 1) {
			worldContainer.removeChildAt(1);
		}

		sortedProjects.forEach((project, index) => {
			const pos = getCardPosition(index);
			const identityColor = identityColors[project.identity] || 0x6b7280;
			const hostProvider = getHostingProvider(project.services);
			const hostColor = providerColors[hostProvider] || 0x6b7280;

			// Card container
			const cardContainer = new PIXI.Container();
			cardContainer.x = pos.x;
			cardContainer.y = pos.y;

			// Card background with shadow
			const shadow = new PIXI.Graphics();
			shadow.roundRect(4, 4, CARD_WIDTH, CARD_HEIGHT, 8);
			shadow.fill({ color: 0x000000, alpha: 0.3 });
			cardContainer.addChild(shadow);

			const cardBg = new PIXI.Graphics();
			cardBg.roundRect(0, 0, CARD_WIDTH, CARD_HEIGHT, 8);
			cardBg.fill(0x111827);
			cardBg.stroke({ width: 1, color: 0x374151 });
			cardContainer.addChild(cardBg);

			// Identity accent bar
			const accentBar = new PIXI.Graphics();
			accentBar.roundRect(0, 0, 4, CARD_HEIGHT, 2);
			accentBar.fill(identityColor);
			cardContainer.addChild(accentBar);

			// Header background
			const headerBg = new PIXI.Graphics();
			headerBg.roundRect(4, 0, CARD_WIDTH - 4, 70, 8);
			headerBg.fill(0x1f2937);
			cardContainer.addChild(headerBg);

			// Project name - using resolution for crisp text
			const nameText = new PIXI.Text({
				text: project.displayName,
				style: {
					fontFamily: 'system-ui, -apple-system, sans-serif',
					fontSize: 14,
					fontWeight: '600',
					fill: 0xffffff,
				}
			});
			nameText.x = 16;
			nameText.y = 10;
			cardContainer.addChild(nameText);

			// Host badge background
			const badgeBg = new PIXI.Graphics();
			badgeBg.roundRect(CARD_WIDTH - 70, 8, 58, 20, 4);
			badgeBg.fill({ color: hostColor, alpha: 0.2 });
			cardContainer.addChild(badgeBg);

			// Host badge text
			const badgeText = new PIXI.Text({
				text: hostProvider,
				style: {
					fontFamily: 'system-ui, sans-serif',
					fontSize: 10,
					fontWeight: '500',
					fill: hostColor,
				}
			});
			badgeText.x = CARD_WIDTH - 41 - badgeText.width / 2;
			badgeText.y = 12;
			cardContainer.addChild(badgeText);

			// Production URL
			if (project.productionUrl) {
				const urlText = new PIXI.Text({
					text: getDisplayUrl(project.productionUrl),
					style: {
						fontFamily: 'system-ui, sans-serif',
						fontSize: 11,
						fill: 0x60a5fa,
					}
				});
				urlText.x = 16;
				urlText.y = 32;
				urlText.eventMode = 'static';
				urlText.cursor = 'pointer';
				urlText.on('pointerdown', (e) => {
					e.stopPropagation();
					window.open(project.productionUrl, '_blank', 'noopener,noreferrer');
				});
				cardContainer.addChild(urlText);
			}

			// Repo ID
			const idText = new PIXI.Text({
				text: project.id,
				style: {
					fontFamily: 'ui-monospace, monospace',
					fontSize: 10,
					fill: 0x6b7280,
				}
			});
			idText.x = 16;
			idText.y = 50;
			cardContainer.addChild(idText);

			// Services
			project.services.forEach((service, svcIdx) => {
				const svcY = 80 + svcIdx * 28;
				if (svcY + 28 > CARD_HEIGHT - 10) return;

				const svcColor = providerColors[service.provider] || 0x6b7280;

				// Service row background
				const rowBg = new PIXI.Graphics();
				rowBg.roundRect(8, svcY, CARD_WIDTH - 16, 24, 4);
				rowBg.fill({ color: 0x1f2937, alpha: 0.5 });
				cardContainer.addChild(rowBg);

				// Category circle
				const circle = new PIXI.Graphics();
				circle.circle(22, svcY + 12, 10);
				circle.fill({ color: svcColor, alpha: 0.15 });
				cardContainer.addChild(circle);

				// Category label
				const catText = new PIXI.Text({
					text: getCategoryLabel(service.category),
					style: {
						fontFamily: 'system-ui, sans-serif',
						fontSize: 10,
						fill: 0x9ca3af,
					}
				});
				catText.x = 40;
				catText.y = svcY + 6;
				cardContainer.addChild(catText);

				// Provider name
				const providerText = new PIXI.Text({
					text: service.provider,
					style: {
						fontFamily: 'system-ui, sans-serif',
						fontSize: 11,
						fontWeight: '500',
						fill: service.dashboardUrl ? 0xe5e7eb : 0xd1d5db,
					}
				});
				providerText.x = 95;
				providerText.y = svcY + 5;

				if (service.dashboardUrl) {
					providerText.eventMode = 'static';
					providerText.cursor = 'pointer';
					providerText.on('pointerdown', (e) => {
						e.stopPropagation();
						window.open(service.dashboardUrl, '_blank', 'noopener,noreferrer');
					});

					// Arrow indicator
					const arrow = new PIXI.Text({
						text: '↗',
						style: {
							fontFamily: 'system-ui, sans-serif',
							fontSize: 10,
							fill: 0x6b7280,
						}
					});
					arrow.x = CARD_WIDTH - 24;
					arrow.y = svcY + 6;
					cardContainer.addChild(arrow);
				}
				cardContainer.addChild(providerText);
			});

			worldContainer!.addChild(cardContainer);
		});
	}

	function setupInteraction() {
		if (!pixiApp || !worldContainer) return;

		const canvas = pixiApp.canvas;

		// Wheel zoom
		canvas.addEventListener('wheel', (e) => {
			e.preventDefault();
			if (!worldContainer) return;

			const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
			const newScale = Math.max(0.25, Math.min(4, worldContainer.scale.x * zoomFactor));

			// Zoom toward mouse position
			const rect = canvas.getBoundingClientRect();
			const mouseX = e.clientX - rect.left;
			const mouseY = e.clientY - rect.top;

			const worldPos = {
				x: (mouseX - worldContainer.x) / worldContainer.scale.x,
				y: (mouseY - worldContainer.y) / worldContainer.scale.y
			};

			worldContainer.scale.set(newScale);
			worldContainer.x = mouseX - worldPos.x * newScale;
			worldContainer.y = mouseY - worldPos.y * newScale;

			currentZoom = newScale;
		}, { passive: false });

		// Pan with drag
		canvas.addEventListener('pointerdown', (e) => {
			isDragging = true;
			lastPointerPos = { x: e.clientX, y: e.clientY };
			canvas.style.cursor = 'grabbing';
		});

		canvas.addEventListener('pointermove', (e) => {
			if (!isDragging || !worldContainer) return;

			const dx = e.clientX - lastPointerPos.x;
			const dy = e.clientY - lastPointerPos.y;

			worldContainer.x += dx;
			worldContainer.y += dy;

			lastPointerPos = { x: e.clientX, y: e.clientY };
		});

		canvas.addEventListener('pointerup', () => {
			isDragging = false;
			canvas.style.cursor = 'grab';
		});

		canvas.addEventListener('pointerleave', () => {
			isDragging = false;
			canvas.style.cursor = 'grab';
		});

		canvas.style.cursor = 'grab';
	}

	// Zoom controls
	function zoomIn() {
		if (!worldContainer || !pixiApp) return;
		const canvas = pixiApp.canvas;
		const rect = canvas.getBoundingClientRect();
		const centerX = rect.width / 2;
		const centerY = rect.height / 2;

		const newScale = Math.min(4, worldContainer.scale.x * 1.3);

		const worldPos = {
			x: (centerX - worldContainer.x) / worldContainer.scale.x,
			y: (centerY - worldContainer.y) / worldContainer.scale.y
		};

		worldContainer.scale.set(newScale);
		worldContainer.x = centerX - worldPos.x * newScale;
		worldContainer.y = centerY - worldPos.y * newScale;

		currentZoom = newScale;
	}

	function zoomOut() {
		if (!worldContainer || !pixiApp) return;
		const canvas = pixiApp.canvas;
		const rect = canvas.getBoundingClientRect();
		const centerX = rect.width / 2;
		const centerY = rect.height / 2;

		const newScale = Math.max(0.25, worldContainer.scale.x * 0.7);

		const worldPos = {
			x: (centerX - worldContainer.x) / worldContainer.scale.x,
			y: (centerY - worldContainer.y) / worldContainer.scale.y
		};

		worldContainer.scale.set(newScale);
		worldContainer.x = centerX - worldPos.x * newScale;
		worldContainer.y = centerY - worldPos.y * newScale;

		currentZoom = newScale;
	}

	function resetView() {
		if (!worldContainer) return;
		worldContainer.scale.set(1);
		worldContainer.x = 20;
		worldContainer.y = 20;
		currentZoom = 1;
	}

	// Re-render on sort change
	$effect(() => {
		if (pixiApp && worldContainer && sortedProjects) {
			import('pixi.js').then(PIXI => renderCards(PIXI));
		}
	});

	// Cleanup
	onDestroy(() => {
		if (pixiApp) {
			pixiApp.destroy(true, { children: true });
			pixiApp = null;
		}
	});
</script>

<svelte:head>
	<title>Infrastructure Map | Orchon</title>
</svelte:head>

<div class="h-full flex flex-col bg-gray-950 overflow-hidden">
	<!-- Controls -->
	<div class="shrink-0 flex items-center justify-between px-4 py-2 bg-gray-900/80 border-b border-gray-800 backdrop-blur-sm z-10">
		<div class="flex items-center gap-4">
			<h1 class="text-lg font-semibold text-white">Infrastructure Map</h1>
			<span class="text-xs px-1.5 py-0.5 bg-green-900/50 text-green-400 rounded">WebGL</span>
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

	<!-- WebGL Canvas Container -->
	<div
		bind:this={canvasContainer}
		class="flex-1 overflow-hidden relative"
	></div>

	<!-- Legend -->
	<div class="shrink-0 px-4 py-2 bg-gray-900/90 border-t border-gray-800 flex items-center gap-6 flex-wrap">
		<div class="flex items-center gap-3">
			<span class="text-xs text-gray-500">Identity:</span>
			{#each Object.entries(identityColors) as [identity, color] (identity)}
				<div class="flex items-center gap-1.5">
					<div class="w-3 h-3 rounded" style="background-color: #{color.toString(16).padStart(6, '0')};"></div>
					<span class="text-xs text-gray-400">{identity}</span>
				</div>
			{/each}
		</div>
		<div class="flex items-center gap-3">
			<span class="text-xs text-gray-500">Providers:</span>
			{#each Object.entries(providerColors).slice(0, 8) as [provider, color] (provider)}
				<div class="flex items-center gap-1">
					<div class="w-2 h-2 rounded-sm" style="background-color: #{color.toString(16).padStart(6, '0')};"></div>
					<span class="text-[10px] text-gray-500">{provider}</span>
				</div>
			{/each}
		</div>
	</div>
</div>
