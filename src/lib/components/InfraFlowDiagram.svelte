<script lang="ts">
	import type { InfraNode, InfraEdge, InfraService } from '$lib/types/infrastructure';
	import {
		User,
		Globe,
		Cloud,
		Server,
		Database,
		Shield,
		HardDrive,
		GitBranch,
		AlertTriangle,
		ExternalLink
	} from '@lucide/svelte';

	interface Props {
		services: InfraService[];
		projectName: string;
		domain?: string;
		animated?: boolean;
	}

	let { services, projectName, domain, animated = true }: Props = $props();

	// Build nodes from services - include dashboard URLs
	let nodes = $derived(buildNodes(services, projectName, domain));
	let edges = $derived(buildEdges(nodes));

	const nodeIcons: Record<string, typeof Cloud> = {
		user: User,
		dns: Globe,
		cdn: Cloud,
		site: ExternalLink,
		hosting: Cloud,
		api: Server,
		database: Database,
		auth: Shield,
		storage: HardDrive,
		ci: GitBranch,
		monitoring: AlertTriangle
	};

	const nodeColors: Record<string, string> = {
		user: '#6366f1',
		dns: '#06b6d4',
		cdn: '#f97316',
		site: '#10b981',
		hosting: '#f97316',
		api: '#8b5cf6',
		database: '#22c55e',
		auth: '#eab308',
		storage: '#ec4899',
		ci: '#64748b',
		monitoring: '#ef4444'
	};

	interface DiagramNode extends InfraNode {
		dashboardUrl?: string;
	}

	function buildNodes(services: InfraService[], name: string, siteDomain?: string): DiagramNode[] {
		const nodes: DiagramNode[] = [];

		// Layout positions for larger diagram
		const hasDb = services.some((s) => s.category === 'database');
		const hasAuth = services.some((s) => s.category === 'auth');
		const hasStorage = services.some((s) => s.category === 'storage');
		const hasCi = services.some((s) => s.category === 'ci');
		const hasMonitoring = services.some((s) => s.category === 'monitoring');

		// Count backend services for vertical centering
		const backendCount = [hasDb, hasAuth, hasStorage].filter(Boolean).length;
		const backendStartY = backendCount === 1 ? 140 : backendCount === 2 ? 100 : 60;
		const backendSpacing = 80;

		// User node - left side
		nodes.push({
			id: 'user',
			type: 'user',
			label: 'Users',
			status: 'healthy',
			x: 60,
			y: 140
		});

		// Hosting/Site node - center (represents the deployed app)
		const hostingService = services.find((s) => s.category === 'hosting');
		nodes.push({
			id: 'site',
			type: 'site',
			label: siteDomain || name,
			provider: hostingService?.provider,
			status: hostingService?.status || 'unknown',
			dashboardUrl: hostingService?.dashboardUrl,
			x: 220,
			y: 140
		});

		// Backend services - right column
		let backendY = backendStartY;

		if (hasDb) {
			const dbService = services.find((s) => s.category === 'database')!;
			nodes.push({
				id: 'database',
				type: 'database',
				label: dbService.serviceName.replace('Supabase ', ''),
				provider: dbService.provider,
				status: dbService.status,
				dashboardUrl: dbService.dashboardUrl,
				x: 380,
				y: backendY
			});
			backendY += backendSpacing;
		}

		if (hasAuth) {
			const authService = services.find((s) => s.category === 'auth')!;
			nodes.push({
				id: 'auth',
				type: 'auth',
				label: authService.serviceName.replace('Supabase ', ''),
				provider: authService.provider,
				status: authService.status,
				dashboardUrl: authService.dashboardUrl,
				x: 380,
				y: backendY
			});
			backendY += backendSpacing;
		}

		if (hasStorage) {
			const storageService = services.find((s) => s.category === 'storage')!;
			nodes.push({
				id: 'storage',
				type: 'storage',
				label: storageService.serviceName.replace('Cloudflare ', ''),
				provider: storageService.provider,
				status: storageService.status,
				dashboardUrl: storageService.dashboardUrl,
				x: 380,
				y: backendY
			});
		}

		// CI - top center (deploys to site)
		if (hasCi) {
			const ciService = services.find((s) => s.category === 'ci')!;
			nodes.push({
				id: 'ci',
				type: 'ci',
				label: 'CI/CD',
				provider: ciService.provider,
				status: ciService.status,
				dashboardUrl: ciService.dashboardUrl,
				x: 220,
				y: 30
			});
		}

		// Monitoring - bottom center
		if (hasMonitoring) {
			const monitoringService = services.find((s) => s.category === 'monitoring')!;
			nodes.push({
				id: 'monitoring',
				type: 'monitoring',
				label: monitoringService.serviceName,
				provider: monitoringService.provider,
				status: monitoringService.status,
				dashboardUrl: monitoringService.dashboardUrl,
				x: 220,
				y: 250
			});
		}

		return nodes;
	}

	function buildEdges(nodes: DiagramNode[]): InfraEdge[] {
		const edges: InfraEdge[] = [];
		const nodeIds = new Set(nodes.map((n) => n.id));

		// User -> Site (main flow)
		if (nodeIds.has('site')) {
			edges.push({
				id: 'user-site',
				source: 'user',
				target: 'site',
				status: 'active'
			});
		}

		// Site -> Backend services
		if (nodeIds.has('database')) {
			edges.push({
				id: 'site-database',
				source: 'site',
				target: 'database',
				status: 'active'
			});
		}

		if (nodeIds.has('auth')) {
			edges.push({
				id: 'site-auth',
				source: 'site',
				target: 'auth',
				status: 'active'
			});
		}

		if (nodeIds.has('storage')) {
			edges.push({
				id: 'site-storage',
				source: 'site',
				target: 'storage',
				status: 'active'
			});
		}

		// CI -> Site (deploy)
		if (nodeIds.has('ci')) {
			edges.push({
				id: 'ci-site',
				source: 'ci',
				target: 'site',
				label: 'deploy',
				status: 'idle'
			});
		}

		// Site -> Monitoring
		if (nodeIds.has('monitoring')) {
			edges.push({
				id: 'site-monitoring',
				source: 'site',
				target: 'monitoring',
				label: 'logs',
				status: 'idle'
			});
		}

		return edges;
	}

	function getNodePosition(nodeId: string): { x: number; y: number } {
		const node = nodes.find((n) => n.id === nodeId);
		return node ? { x: node.x || 0, y: node.y || 0 } : { x: 0, y: 0 };
	}

	// Calculate edge path with proper connection points
	function getEdgePath(
		source: { x: number; y: number },
		target: { x: number; y: number }
	): { x1: number; y1: number; x2: number; y2: number } {
		const nodeRadius = 24;
		const dx = target.x - source.x;
		const dy = target.y - source.y;
		const dist = Math.sqrt(dx * dx + dy * dy);

		if (dist === 0) return { x1: source.x, y1: source.y, x2: target.x, y2: target.y };

		// Normalize and offset by radius
		const nx = dx / dist;
		const ny = dy / dist;

		return {
			x1: source.x + nx * nodeRadius,
			y1: source.y + ny * nodeRadius,
			x2: target.x - nx * (nodeRadius + 8),
			y2: target.y - ny * (nodeRadius + 8)
		};
	}

	function handleNodeClick(node: DiagramNode) {
		if (node.dashboardUrl) {
			window.open(node.dashboardUrl, '_blank', 'noopener,noreferrer');
		}
	}
</script>

<div class="w-full h-full min-h-[18rem]">
	<svg viewBox="0 0 460 290" class="w-full h-full" preserveAspectRatio="xMidYMid meet">
		<defs>
			<!-- Arrow markers -->
			<marker
				id="arrowhead-active"
				markerWidth="10"
				markerHeight="8"
				refX="9"
				refY="4"
				orient="auto"
			>
				<polygon points="0 0, 10 4, 0 8" fill="#22c55e" />
			</marker>
			<marker id="arrowhead-idle" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
				<polygon points="0 0, 10 4, 0 8" fill="#4b5563" />
			</marker>

			<!-- Animated dash pattern -->
			{#if animated}
				<style>
					@keyframes flowDash {
						to {
							stroke-dashoffset: -20;
						}
					}
					.flow-animated {
						stroke-dasharray: 6 6;
						animation: flowDash 0.8s linear infinite;
					}
				</style>
			{/if}
		</defs>

		<!-- Edges -->
		{#each edges as edge}
			{@const source = getNodePosition(edge.source)}
			{@const target = getNodePosition(edge.target)}
			{@const path = getEdgePath(source, target)}
			{@const isActive = edge.status === 'active'}
			<g>
				<line
					x1={path.x1}
					y1={path.y1}
					x2={path.x2}
					y2={path.y2}
					stroke={isActive ? '#22c55e' : '#4b5563'}
					stroke-width="2"
					marker-end={isActive ? 'url(#arrowhead-active)' : 'url(#arrowhead-idle)'}
					class={animated && isActive ? 'flow-animated' : ''}
				/>
				{#if edge.label}
					<text
						x={(source.x + target.x) / 2}
						y={(source.y + target.y) / 2 - 6}
						text-anchor="middle"
						class="text-[10px] fill-gray-500"
					>
						{edge.label}
					</text>
				{/if}
			</g>
		{/each}

		<!-- Nodes -->
		{#each nodes as node}
			{@const IconComponent = nodeIcons[node.type] || Server}
			{@const color = nodeColors[node.type] || '#6b7280'}
			{@const nodeX = node.x ?? 0}
			{@const nodeY = node.y ?? 0}
			{@const isClickable = !!node.dashboardUrl}
			<g
				transform="translate({nodeX}, {nodeY})"
				class={isClickable ? 'cursor-pointer' : ''}
				onclick={() => handleNodeClick(node)}
				onkeydown={(e) => e.key === 'Enter' && handleNodeClick(node)}
				role={isClickable ? 'button' : undefined}
				tabindex={isClickable ? 0 : undefined}
			>
				<!-- Node circle -->
				<circle
					cx="0"
					cy="0"
					r="24"
					fill="#1f2937"
					stroke={color}
					stroke-width="2"
					class="transition-all {isClickable ? 'hover:stroke-[3px] hover:fill-gray-800' : ''}"
				/>

				<!-- Icon (positioned in center) -->
				<foreignObject x="-14" y="-14" width="28" height="28">
					<div class="flex items-center justify-center w-full h-full" style="color: {color}">
						<IconComponent class="w-5 h-5" />
					</div>
				</foreignObject>

				<!-- Label -->
				<text x="0" y="40" text-anchor="middle" class="text-[11px] fill-gray-300 font-medium">
					{node.label.length > 12 ? node.label.slice(0, 11) + '..' : node.label}
				</text>

				<!-- Clickable indicator -->
				{#if isClickable}
					<circle cx="18" cy="-18" r="6" fill="#374151" stroke={color} stroke-width="1" />
					<foreignObject x="12" y="-24" width="12" height="12">
						<div class="flex items-center justify-center w-full h-full text-gray-400">
							<ExternalLink class="w-2.5 h-2.5" />
						</div>
					</foreignObject>
				{/if}
			</g>
		{/each}
	</svg>
</div>
