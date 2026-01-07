<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import {
		forceSimulation,
		forceLink,
		forceManyBody,
		forceCenter,
		forceCollide,
		forceX,
		forceY
	} from 'd3-force';
	import type { Simulation, SimulationNodeDatum, SimulationLinkDatum } from 'd3-force';
	import { RefreshCw, ExternalLink, Activity } from '@lucide/svelte';

	// Types matching backend
	type NodeStatus = 'healthy' | 'degraded' | 'down' | 'unknown';
	type NodeType = 'platform' | 'service' | 'external' | 'app';

	interface EcosystemNode {
		id: string;
		label: string;
		type: NodeType;
		status: NodeStatus;
		url?: string;
		parent?: string;
		meta?: Record<string, string>;
	}

	interface EcosystemEdge {
		from: string;
		to: string;
		label?: string;
	}

	interface EcosystemResponse {
		nodes: EcosystemNode[];
		edges: EcosystemEdge[];
		lastCheck: string;
	}

	// D3 node type
	interface D3Node extends SimulationNodeDatum {
		id: string;
		label: string;
		type: NodeType;
		status: NodeStatus;
		url?: string;
		parent?: string;
		meta?: Record<string, string>;
		x?: number;
		y?: number;
		fx?: number | null;
		fy?: number | null;
	}

	interface D3Link extends SimulationLinkDatum<D3Node> {
		source: string | D3Node;
		target: string | D3Node;
		label?: string;
	}

	// Props
	interface Props {
		apiSecret: string;
		apiUrl: string;
	}

	let { apiSecret, apiUrl }: Props = $props();

	// State
	let nodes = $state<D3Node[]>([]);
	let links = $state<D3Link[]>([]);
	let lastCheck = $state<string>('');
	let loading = $state(true);
	let error = $state<string | null>(null);
	let selectedNode = $state<D3Node | null>(null);
	let simulation: Simulation<D3Node, D3Link> | null = null;
	let svgElement: SVGSVGElement;
	let width = $state(800);
	let height = $state(600);

	// Zoom/pan state
	let transform = $state({ x: 0, y: 0, k: 1 });
	let isDragging = $state(false);
	let dragNode = $state<D3Node | null>(null);

	// Status colors
	const statusColors: Record<NodeStatus, { border: string; bg: string; glow: string }> = {
		healthy: { border: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)', glow: '#22c55e' },
		degraded: { border: '#eab308', bg: 'rgba(234, 179, 8, 0.1)', glow: '#eab308' },
		down: { border: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', glow: '#ef4444' },
		unknown: { border: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)', glow: '#6b7280' }
	};

	// Node sizes by type
	const nodeSizes: Record<NodeType, number> = {
		platform: 45,
		service: 30,
		external: 35,
		app: 28
	};

	// Fetch ecosystem data
	async function fetchData(forceRefresh = false) {
		loading = true;
		error = null;

		try {
			const url = `${apiUrl}/health/ecosystem${forceRefresh ? '?refresh=true' : ''}`;
			const response = await fetch(url, {
				headers: {
					Authorization: `Bearer ${apiSecret}`,
					Accept: 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}`);
			}

			const data: EcosystemResponse = await response.json();

			// Convert to D3 format
			const newNodes: D3Node[] = data.nodes.map((n) => ({
				...n,
				x: undefined,
				y: undefined
			}));

			const newLinks: D3Link[] = data.edges.map((e) => ({
				source: e.from,
				target: e.to,
				label: e.label
			}));

			// Preserve positions if updating
			if (nodes.length > 0) {
				const oldPositions = new Map(nodes.map((n) => [n.id, { x: n.x, y: n.y }]));
				newNodes.forEach((n) => {
					const old = oldPositions.get(n.id);
					if (old) {
						n.x = old.x;
						n.y = old.y;
					}
				});
			}

			nodes = newNodes;
			links = newLinks;
			lastCheck = data.lastCheck;

			// Initialize or restart simulation
			initSimulation();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to fetch';
		} finally {
			loading = false;
		}
	}

	// Initialize D3 force simulation
	function initSimulation() {
		if (simulation) {
			simulation.stop();
		}

		simulation = forceSimulation<D3Node>(nodes)
			.force(
				'link',
				forceLink<D3Node, D3Link>(links)
					.id((d) => d.id)
					.distance(120)
					.strength(0.5)
			)
			.force('charge', forceManyBody().strength(-300))
			.force('center', forceCenter(width / 2, height / 2))
			.force('collision', forceCollide<D3Node>().radius((d) => nodeSizes[d.type] + 10))
			.force(
				'x',
				forceX<D3Node>()
					.x((d) => {
						// Position by type
						if (d.type === 'platform') return width * 0.5;
						if (d.type === 'service') return width * 0.5;
						if (d.type === 'external') return width * 0.8;
						if (d.type === 'app') return width * 0.2;
						return width / 2;
					})
					.strength(0.1)
			)
			.force(
				'y',
				forceY<D3Node>()
					.y((d) => {
						if (d.parent) return height * 0.6;
						return height * 0.4;
					})
					.strength(0.05)
			)
			.on('tick', () => {
				// Force reactivity update
				nodes = [...nodes];
				links = [...links];
			});

		// Run for a bit then stop for performance
		simulation.alpha(1).restart();
		setTimeout(() => simulation?.stop(), 3000);
	}

	// Handle node drag
	function handleDragStart(event: MouseEvent, node: D3Node) {
		if (!simulation) return;
		isDragging = true;
		dragNode = node;
		simulation.alphaTarget(0.3).restart();
		node.fx = node.x;
		node.fy = node.y;
	}

	function handleDrag(event: MouseEvent) {
		if (!isDragging || !dragNode) return;
		const svgRect = svgElement.getBoundingClientRect();
		dragNode.fx = (event.clientX - svgRect.left - transform.x) / transform.k;
		dragNode.fy = (event.clientY - svgRect.top - transform.y) / transform.k;
		nodes = [...nodes];
	}

	function handleDragEnd() {
		if (!simulation || !dragNode) return;
		isDragging = false;
		simulation.alphaTarget(0);
		dragNode.fx = null;
		dragNode.fy = null;
		dragNode = null;
	}

	// Handle zoom
	function handleWheel(event: WheelEvent) {
		event.preventDefault();
		const delta = event.deltaY > 0 ? 0.9 : 1.1;
		const newK = Math.max(0.3, Math.min(3, transform.k * delta));

		// Zoom toward mouse position
		const svgRect = svgElement.getBoundingClientRect();
		const mouseX = event.clientX - svgRect.left;
		const mouseY = event.clientY - svgRect.top;

		transform = {
			k: newK,
			x: mouseX - ((mouseX - transform.x) * newK) / transform.k,
			y: mouseY - ((mouseY - transform.y) * newK) / transform.k
		};
	}

	// Handle pan
	let isPanning = $state(false);
	let panStart = $state({ x: 0, y: 0 });

	function handlePanStart(event: MouseEvent) {
		if (isDragging) return;
		isPanning = true;
		panStart = { x: event.clientX - transform.x, y: event.clientY - transform.y };
	}

	function handlePanMove(event: MouseEvent) {
		if (!isPanning) return;
		transform = {
			...transform,
			x: event.clientX - panStart.x,
			y: event.clientY - panStart.y
		};
	}

	function handlePanEnd() {
		isPanning = false;
	}

	// Node click handler
	function handleNodeClick(node: D3Node) {
		selectedNode = selectedNode?.id === node.id ? null : node;
	}

	// Get link coordinates
	function getLinkPath(link: D3Link): string {
		const source = typeof link.source === 'string' ? nodes.find((n) => n.id === link.source) : link.source;
		const target = typeof link.target === 'string' ? nodes.find((n) => n.id === link.target) : link.target;

		if (!source?.x || !source?.y || !target?.x || !target?.y) return '';

		const dx = target.x - source.x;
		const dy = target.y - source.y;
		const dr = Math.sqrt(dx * dx + dy * dy) * 0.8;

		return `M${source.x},${source.y}A${dr},${dr} 0 0,1 ${target.x},${target.y}`;
	}

	// Resize handler
	function updateSize() {
		if (svgElement) {
			const rect = svgElement.parentElement?.getBoundingClientRect();
			if (rect) {
				width = rect.width;
				height = rect.height;
			}
		}
	}

	// Polling interval
	let pollInterval: ReturnType<typeof setInterval>;

	onMount(() => {
		updateSize();
		fetchData();

		// Poll every 30 seconds
		pollInterval = setInterval(() => fetchData(), 30000);

		// Handle resize
		window.addEventListener('resize', updateSize);
	});

	onDestroy(() => {
		if (pollInterval) clearInterval(pollInterval);
		if (simulation) simulation.stop();
		if (browser) window.removeEventListener('resize', updateSize);
	});
</script>

<div class="relative w-full h-full min-h-[400px] bg-gray-900 rounded-lg overflow-hidden">
	<!-- Loading overlay -->
	{#if loading && nodes.length === 0}
		<div class="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-10">
			<div class="flex items-center gap-2 text-gray-400">
				<RefreshCw class="w-5 h-5 animate-spin" />
				<span>Loading infrastructure status...</span>
			</div>
		</div>
	{/if}

	<!-- Error message -->
	{#if error}
		<div class="absolute top-4 left-4 right-4 bg-red-900/50 border border-red-700 rounded px-3 py-2 text-sm text-red-300 z-10">
			Failed to load: {error}
		</div>
	{/if}

	<!-- Controls -->
	<div class="absolute top-4 right-4 flex items-center gap-2 z-10">
		<button
			onclick={() => fetchData(true)}
			disabled={loading}
			class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 transition-colors disabled:opacity-50 cursor-pointer"
		>
			<RefreshCw class="w-3.5 h-3.5 {loading ? 'animate-spin' : ''}" />
			Refresh
		</button>
		{#if lastCheck}
			<span class="text-xs text-gray-500">
				Last: {new Date(lastCheck).toLocaleTimeString()}
			</span>
		{/if}
	</div>

	<!-- SVG Graph -->
	<svg
		bind:this={svgElement}
		role="img"
		aria-label="Infrastructure map visualization"
		class="w-full h-full cursor-grab {isPanning ? 'cursor-grabbing' : ''}"
		onmousedown={handlePanStart}
		onmousemove={(e) => {
			handlePanMove(e);
			handleDrag(e);
		}}
		onmouseup={() => {
			handlePanEnd();
			handleDragEnd();
		}}
		onmouseleave={() => {
			handlePanEnd();
			handleDragEnd();
		}}
		onwheel={handleWheel}
	>
		<g transform="translate({transform.x}, {transform.y}) scale({transform.k})">
			<!-- Links -->
			{#each links as link}
				{@const path = getLinkPath(link)}
				{#if path}
					<path
						d={path}
						fill="none"
						stroke="#374151"
						stroke-width="1.5"
						stroke-opacity="0.5"
						marker-end="url(#arrowhead)"
					/>
				{/if}
			{/each}

			<!-- Nodes -->
			{#each nodes as node}
				{@const size = nodeSizes[node.type]}
				{@const colors = statusColors[node.status]}
				{@const isSelected = selectedNode?.id === node.id}
				{#if node.x !== undefined && node.y !== undefined}
					<g
						transform="translate({node.x}, {node.y})"
						class="cursor-pointer"
						role="button"
						tabindex="0"
						aria-label="{node.label} - {node.status}"
						onmousedown={(e) => {
							e.stopPropagation();
							handleDragStart(e, node);
						}}
						onclick={() => handleNodeClick(node)}
						onkeydown={(e) => e.key === 'Enter' && handleNodeClick(node)}
					>
						<!-- Glow effect for healthy nodes -->
						{#if node.status === 'healthy'}
							<circle r={size + 4} fill={colors.glow} opacity="0.15" />
						{/if}

						<!-- Main node circle -->
						<circle
							r={size}
							fill={colors.bg}
							stroke={colors.border}
							stroke-width={isSelected ? 3 : 2}
							class="transition-all duration-150"
						/>

						<!-- Status indicator dot -->
						<circle
							cx={size - 5}
							cy={-size + 5}
							r="5"
							fill={colors.border}
						/>

						<!-- Label -->
						<text
							y={size + 14}
							text-anchor="middle"
							class="text-[11px] fill-gray-300 font-medium pointer-events-none"
						>
							{node.label}
						</text>

						<!-- Type badge -->
						<text
							y={size + 26}
							text-anchor="middle"
							class="text-[9px] fill-gray-500 uppercase pointer-events-none"
						>
							{node.type}
						</text>
					</g>
				{/if}
			{/each}
		</g>

		<!-- Arrow marker -->
		<defs>
			<marker
				id="arrowhead"
				markerWidth="10"
				markerHeight="7"
				refX="9"
				refY="3.5"
				orient="auto"
			>
				<polygon points="0 0, 10 3.5, 0 7" fill="#374151" />
			</marker>
		</defs>
	</svg>

	<!-- Detail Panel -->
	{#if selectedNode}
		<div class="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20">
			<div class="p-4">
				<div class="flex items-center justify-between mb-3">
					<h3 class="font-medium text-white">{selectedNode.label}</h3>
					<button
						onclick={() => (selectedNode = null)}
						class="text-gray-400 hover:text-gray-200 cursor-pointer"
					>
						&times;
					</button>
				</div>

				<div class="space-y-2 text-sm">
					<div class="flex justify-between">
						<span class="text-gray-400">Status</span>
						<span
							class="px-2 py-0.5 rounded text-xs font-medium"
							style="background-color: {statusColors[selectedNode.status].bg}; color: {statusColors[selectedNode.status].border};"
						>
							{selectedNode.status}
						</span>
					</div>

					<div class="flex justify-between">
						<span class="text-gray-400">Type</span>
						<span class="text-gray-200 capitalize">{selectedNode.type}</span>
					</div>

					{#if selectedNode.parent}
						<div class="flex justify-between">
							<span class="text-gray-400">Parent</span>
							<span class="text-gray-200">{selectedNode.parent}</span>
						</div>
					{/if}

					{#if selectedNode.meta}
						{#each Object.entries(selectedNode.meta) as [key, value]}
							<div class="flex justify-between">
								<span class="text-gray-400">{key}</span>
								<span class="text-gray-200">{value}</span>
							</div>
						{/each}
					{/if}

					{#if selectedNode.url}
						<a
							href={selectedNode.url}
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-1 text-blue-400 hover:text-blue-300 mt-3"
						>
							<ExternalLink class="w-3.5 h-3.5" />
							Open
						</a>
					{/if}
				</div>
			</div>
		</div>
	{/if}

	<!-- Legend -->
	<div class="absolute bottom-4 left-4 bg-gray-800/90 border border-gray-700 rounded px-3 py-2 text-xs {selectedNode ? 'hidden md:block' : ''}">
		<div class="flex items-center gap-4">
			{#each (['healthy', 'degraded', 'down', 'unknown'] as const) as status}
				<div class="flex items-center gap-1.5">
					<div
						class="w-3 h-3 rounded-full"
						style="background-color: {statusColors[status].border}"
					></div>
					<span class="text-gray-400 capitalize">{status}</span>
				</div>
			{/each}
		</div>
	</div>
</div>
