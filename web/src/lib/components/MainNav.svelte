<script lang="ts">
	import { page } from '$app/state';
	import { Activity, Layers, Cloud, Server, Map, Droplets, FolderGit2, Settings, Image } from '@lucide/svelte';

	// Determine active route
	let currentPath = $derived(page.url.pathname);

	// Check if we're on a specific infrastructure sub-route (not just the parent)
	let isOnInfraMap = $derived(currentPath === '/infrastructure/map');
	let isOnAdminProjects = $derived(currentPath.startsWith('/admin/projects'));
	let isOnAdminRepos = $derived(currentPath.startsWith('/admin/repos'));

	// Infrastructure parent should NOT be highlighted - only sub-items
	let isConfigActive = $derived(currentPath.startsWith('/admin/media'));
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

	<!-- Infrastructure Section - label only, not a link -->
	<div class="flex items-center gap-3 px-4 py-2 mt-2">
		<Server class="w-4 h-4 text-gray-500 shrink-0" />
		<div class="flex-1 min-w-0">
			<div class="font-medium text-xs text-gray-500 uppercase tracking-wide">Infrastructure</div>
		</div>
	</div>

	<!-- Infrastructure sub-items -->
	<a
		href="/infrastructure/map"
		class="flex items-center gap-3 pl-8 pr-4 py-2 text-left transition-colors {isOnInfraMap
			? 'bg-gray-800/50 border-l-2 border-blue-400'
			: 'hover:bg-gray-800/30 border-l-2 border-transparent'}"
	>
		<Map class="w-3.5 h-3.5 {isOnInfraMap ? 'text-blue-400' : 'text-gray-500'} shrink-0" />
		<div class="flex-1 min-w-0">
			<div class="text-sm {isOnInfraMap ? 'text-white' : 'text-gray-400'} truncate">Map</div>
		</div>
	</a>

	<a
		href="/admin/projects"
		class="flex items-center gap-3 pl-8 pr-4 py-2 text-left transition-colors {isOnAdminProjects
			? 'bg-gray-800/50 border-l-2 border-blue-400'
			: 'hover:bg-gray-800/30 border-l-2 border-transparent'}"
	>
		<Layers class="w-3.5 h-3.5 {isOnAdminProjects ? 'text-blue-400' : 'text-gray-500'} shrink-0" />
		<div class="flex-1 min-w-0">
			<div class="text-sm {isOnAdminProjects ? 'text-white' : 'text-gray-400'} truncate">Projects</div>
		</div>
	</a>

	<a
		href="/admin/repos"
		class="flex items-center gap-3 pl-8 pr-4 py-2 text-left transition-colors {isOnAdminRepos
			? 'bg-gray-800/50 border-l-2 border-blue-400'
			: 'hover:bg-gray-800/30 border-l-2 border-transparent'}"
	>
		<Settings class="w-3.5 h-3.5 {isOnAdminRepos ? 'text-blue-400' : 'text-gray-500'} shrink-0" />
		<div class="flex-1 min-w-0">
			<div class="text-sm {isOnAdminRepos ? 'text-white' : 'text-gray-400'} truncate">Config</div>
		</div>
	</a>

	<!-- Config Section (Media) -->
	<a
		href="/admin/media"
		class="flex items-center gap-3 px-4 py-2.5 text-left transition-colors {isConfigActive
			? 'bg-gray-800 border-l-2 border-amber-500'
			: 'hover:bg-gray-800/50 border-l-2 border-transparent'}"
	>
		<Image class="w-4 h-4 {isConfigActive ? 'text-amber-400' : 'text-gray-500'} shrink-0" />
		<div class="flex-1 min-w-0">
			<div class="font-medium text-sm {isConfigActive ? 'text-white' : 'text-gray-300'} truncate">Media</div>
		</div>
	</a>
</nav>
