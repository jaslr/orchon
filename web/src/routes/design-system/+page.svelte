<script lang="ts">
	import {
		Palette,
		Type,
		Component,
		Table,
		Layout,
		ArrowRight,
		Code,
		Moon,
		Gauge
	} from '@lucide/svelte';

	const sections = [
		{
			href: '/design-system/colors',
			title: 'Colors',
			description: 'Gray scale, semantic colors, and accent palette',
			icon: Palette
		},
		{
			href: '/design-system/typography',
			title: 'Typography',
			description: 'Text sizes, weights, and hierarchy',
			icon: Type
		},
		{
			href: '/design-system/components',
			title: 'Components',
			description: 'Buttons, inputs, cards, chips, and badges',
			icon: Component
		},
		{
			href: '/design-system/data-display',
			title: 'Data Display',
			description: 'Tables, lists, and high-density patterns',
			icon: Table
		},
		{
			href: '/design-system/layout',
			title: 'Layout',
			description: 'Spacing, grid, and responsive patterns',
			icon: Layout
		}
	];

	const principles = [
		{
			icon: Moon,
			title: 'Dark First',
			description: 'Built for dark environments with careful contrast ratios'
		},
		{
			icon: Gauge,
			title: 'High Density',
			description: 'Maximum information in minimum space'
		},
		{
			icon: Code,
			title: 'Linear Design',
			description: 'Clean lines, minimal decoration, functional aesthetics'
		}
	];
</script>

<div class="p-6 lg:p-8 max-w-5xl">
	<!-- Hero -->
	<div class="mb-12">
		<h1 class="text-3xl font-bold text-white mb-3">ORCHON Design System</h1>
		<p class="text-lg text-gray-400 max-w-2xl">
			A linear, high-density design system for infrastructure monitoring. Built for dark
			environments where data clarity is paramount.
		</p>
	</div>

	<!-- Principles -->
	<section class="mb-12">
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Design Principles</h2>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			{#each principles as principle}
				<div class="bg-gray-900 border border-gray-800 rounded-lg p-4">
					<div class="flex items-center gap-3 mb-2">
						<div class="w-8 h-8 rounded bg-gray-800 flex items-center justify-center">
							<principle.icon class="w-4 h-4 text-blue-400" />
						</div>
						<h3 class="font-medium text-white">{principle.title}</h3>
					</div>
					<p class="text-sm text-gray-400">{principle.description}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- Quick Reference -->
	<section class="mb-12">
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Quick Reference</h2>
		<div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
			<div class="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-800">
				<div class="p-4">
					<div class="text-xs text-gray-500 mb-1">Background</div>
					<div class="flex items-center gap-2">
						<div class="w-6 h-6 rounded bg-gray-950 border border-gray-700"></div>
						<code class="text-xs text-gray-300">gray-950</code>
					</div>
				</div>
				<div class="p-4">
					<div class="text-xs text-gray-500 mb-1">Surface</div>
					<div class="flex items-center gap-2">
						<div class="w-6 h-6 rounded bg-gray-900 border border-gray-700"></div>
						<code class="text-xs text-gray-300">gray-900</code>
					</div>
				</div>
				<div class="p-4">
					<div class="text-xs text-gray-500 mb-1">Border</div>
					<div class="flex items-center gap-2">
						<div class="w-6 h-6 rounded bg-gray-800 border border-gray-700"></div>
						<code class="text-xs text-gray-300">gray-800</code>
					</div>
				</div>
				<div class="p-4">
					<div class="text-xs text-gray-500 mb-1">Primary</div>
					<div class="flex items-center gap-2">
						<div class="w-6 h-6 rounded bg-blue-500"></div>
						<code class="text-xs text-gray-300">blue-500</code>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Sections Grid -->
	<section>
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Documentation</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			{#each sections as section}
				<a
					href={section.href}
					class="group bg-gray-900 border border-gray-800 rounded-lg p-5 hover:border-gray-700 hover:bg-gray-900/80 transition-colors"
				>
					<div class="flex items-start justify-between mb-3">
						<div class="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-gray-700 transition-colors">
							<section.icon class="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
						</div>
						<ArrowRight class="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
					</div>
					<h3 class="font-medium text-white mb-1">{section.title}</h3>
					<p class="text-sm text-gray-500">{section.description}</p>
				</a>
			{/each}
		</div>
	</section>

	<!-- Tech Stack Note -->
	<section class="mt-12 p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
		<div class="text-xs text-gray-500 uppercase tracking-wider mb-2">Tech Stack</div>
		<div class="flex flex-wrap gap-2">
			<span class="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">SvelteKit 2.x</span>
			<span class="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">Svelte 5 Runes</span>
			<span class="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">Tailwind CSS 4</span>
			<span class="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">Lucide Icons</span>
		</div>
	</section>
</div>
