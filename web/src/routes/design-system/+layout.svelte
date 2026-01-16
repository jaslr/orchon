<script lang="ts">
	import { page } from '$app/state';
	import {
		Palette,
		Type,
		Component,
		Table,
		Layout,
		BookOpen,
		ChevronLeft
	} from '@lucide/svelte';

	let { children } = $props();

	let currentPath = $derived(page.url.pathname);

	const navItems = [
		{ href: '/design-system', label: 'Overview', icon: BookOpen, exact: true },
		{ href: '/design-system/colors', label: 'Colors', icon: Palette },
		{ href: '/design-system/typography', label: 'Typography', icon: Type },
		{ href: '/design-system/components', label: 'Components', icon: Component },
		{ href: '/design-system/data-display', label: 'Data Display', icon: Table },
		{ href: '/design-system/layout', label: 'Layout', icon: Layout }
	];

	function isActive(href: string, exact: boolean = false): boolean {
		if (exact) {
			return currentPath === href;
		}
		return currentPath === href || currentPath.startsWith(href + '/');
	}
</script>

<svelte:head>
	<title>Design System | Orchon</title>
</svelte:head>

<div class="flex-1 flex flex-col lg:flex-row min-h-0 h-full overflow-hidden">
	<!-- Sidebar Navigation -->
	<aside class="shrink-0 w-full lg:w-56 border-b lg:border-b-0 lg:border-r border-gray-800 bg-gray-900">
		<!-- Header -->
		<div class="px-4 py-3 border-b border-gray-800">
			<a href="/" class="flex items-center gap-2 text-gray-400 hover:text-gray-200 text-sm transition-colors">
				<ChevronLeft class="w-4 h-4" />
				<span>Back to App</span>
			</a>
		</div>

		<!-- Title -->
		<div class="px-4 py-4 border-b border-gray-800">
			<h1 class="text-lg font-semibold text-white">Design System</h1>
			<p class="text-xs text-gray-500 mt-1">ORCHON UI Reference</p>
		</div>

		<!-- Nav Links -->
		<nav class="flex lg:flex-col overflow-x-auto lg:overflow-x-visible">
			{#each navItems as item}
				{@const active = isActive(item.href, item.exact)}
				<a
					href={item.href}
					class="flex items-center gap-3 px-4 py-2.5 text-sm whitespace-nowrap transition-colors
						{active
							? 'bg-gray-800 text-white border-b-2 lg:border-b-0 lg:border-l-2 border-blue-500'
							: 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 border-b-2 lg:border-b-0 lg:border-l-2 border-transparent'}"
				>
					<item.icon class="w-4 h-4 {active ? 'text-blue-400' : 'text-gray-500'}" />
					<span>{item.label}</span>
				</a>
			{/each}
		</nav>
	</aside>

	<!-- Content Area -->
	<main class="flex-1 overflow-y-auto bg-gray-950">
		{@render children()}
	</main>
</div>
