<script lang="ts">
	import { page } from '$app/state';
	import { Activity, Layers, Cloud, Server, Map, Droplets, FolderGit2 } from '@lucide/svelte';

	// Determine active route
	let currentPath = $derived(page.url.pathname);
</script>

<nav class="flex flex-col gap-1 py-2">
	<a
		href="/"
		class="flex items-center gap-3 px-4 py-2.5 text-left transition-colors {currentPath === '/'
			? 'bg-gray-800 border-l-2 border-blue-500'
			: 'hover:bg-gray-800/50 border-l-2 border-transparent'}"
	>
		<Activity class="w-4 h-4 {currentPath === '/' ? 'text-blue-400' : 'text-gray-500'} shrink-0" />
		<div class="flex-1 min-w-0">
			<div class="font-medium text-sm {currentPath === '/' ? 'text-white' : 'text-gray-300'} truncate">Console</div>
		</div>
	</a>

	<a
		href="/projects"
		class="flex items-center gap-3 px-4 py-2.5 text-left transition-colors {currentPath === '/projects' || currentPath.startsWith('/projects')
			? 'bg-gray-800 border-l-2 border-blue-500'
			: 'hover:bg-gray-800/50 border-l-2 border-transparent'}"
	>
		<Layers class="w-4 h-4 {currentPath === '/projects' || currentPath.startsWith('/projects') ? 'text-blue-400' : 'text-gray-500'} shrink-0" />
		<div class="flex-1 min-w-0">
			<div class="font-medium text-sm {currentPath === '/projects' || currentPath.startsWith('/projects') ? 'text-white' : 'text-gray-300'} truncate">Projects</div>
		</div>
	</a>

	<!-- Deployments sub-menu under Projects -->
	<a
		href="/deployments"
		class="flex items-center gap-3 pl-8 pr-4 py-2 text-left transition-colors {currentPath === '/deployments' || currentPath.startsWith('/deployments')
			? 'bg-gray-800/50 border-l-2 border-blue-400'
			: 'hover:bg-gray-800/30 border-l-2 border-transparent'}"
	>
		<Cloud class="w-3.5 h-3.5 {currentPath === '/deployments' || currentPath.startsWith('/deployments') ? 'text-blue-400' : 'text-gray-500'} shrink-0" />
		<div class="flex-1 min-w-0">
			<div class="text-sm {currentPath === '/deployments' || currentPath.startsWith('/deployments') ? 'text-white' : 'text-gray-400'} truncate">Deployments</div>
		</div>
	</a>

	<!-- Vast Puddle (Junipa Infrastructure) -->
	<a
		href="/vastpuddle"
		class="flex items-center gap-3 px-4 py-2.5 text-left transition-colors {currentPath.startsWith('/vastpuddle')
			? 'bg-gray-800 border-l-2 border-emerald-500'
			: 'hover:bg-gray-800/50 border-l-2 border-transparent'}"
	>
		<Droplets class="w-4 h-4 {currentPath.startsWith('/vastpuddle') ? 'text-emerald-400' : 'text-gray-500'} shrink-0" />
		<div class="flex-1 min-w-0">
			<div class="font-medium text-sm {currentPath.startsWith('/vastpuddle') ? 'text-white' : 'text-gray-300'} truncate">Vast Puddle</div>
		</div>
	</a>

	<!-- Personal Projects Infrastructure -->
	<a
		href="/projects-infra"
		class="flex items-center gap-3 px-4 py-2.5 text-left transition-colors {currentPath.startsWith('/projects-infra')
			? 'bg-gray-800 border-l-2 border-violet-500'
			: 'hover:bg-gray-800/50 border-l-2 border-transparent'}"
	>
		<FolderGit2 class="w-4 h-4 {currentPath.startsWith('/projects-infra') ? 'text-violet-400' : 'text-gray-500'} shrink-0" />
		<div class="flex-1 min-w-0">
			<div class="font-medium text-sm {currentPath.startsWith('/projects-infra') ? 'text-white' : 'text-gray-300'} truncate">My Projects</div>
		</div>
	</a>

	<!-- Legacy Infrastructure (Admin) -->
	<a
		href="/admin/infra"
		class="flex items-center gap-3 px-4 py-2.5 text-left transition-colors {currentPath.startsWith('/admin/infra') || currentPath.startsWith('/infrastructure')
			? 'bg-gray-800 border-l-2 border-blue-500'
			: 'hover:bg-gray-800/50 border-l-2 border-transparent'}"
	>
		<Server class="w-4 h-4 {currentPath.startsWith('/admin/infra') || currentPath.startsWith('/infrastructure') ? 'text-blue-400' : 'text-gray-500'} shrink-0" />
		<div class="flex-1 min-w-0">
			<div class="font-medium text-sm {currentPath.startsWith('/admin/infra') || currentPath.startsWith('/infrastructure') ? 'text-white' : 'text-gray-300'} truncate">Infrastructure</div>
		</div>
	</a>

	<!-- Infrastructure Map sub-menu -->
	<a
		href="/infrastructure/map"
		class="flex items-center gap-3 pl-8 pr-4 py-2 text-left transition-colors {currentPath === '/infrastructure/map'
			? 'bg-gray-800/50 border-l-2 border-blue-400'
			: 'hover:bg-gray-800/30 border-l-2 border-transparent'}"
	>
		<Map class="w-3.5 h-3.5 {currentPath === '/infrastructure/map' ? 'text-blue-400' : 'text-gray-500'} shrink-0" />
		<div class="flex-1 min-w-0">
			<div class="text-sm {currentPath === '/infrastructure/map' ? 'text-white' : 'text-gray-400'} truncate">Map</div>
		</div>
	</a>
</nav>
