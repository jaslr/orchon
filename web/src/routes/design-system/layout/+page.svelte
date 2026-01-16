<script lang="ts">
	import { Activity, Layers, Settings, Menu } from '@lucide/svelte';

	const spacingScale = [
		{ class: 'p-0.5 / gap-0.5', value: '2px', usage: 'Toggle button groups' },
		{ class: 'p-1 / gap-1', value: '4px', usage: 'Tight button groups' },
		{ class: 'p-1.5 / gap-1.5', value: '6px', usage: 'Icon button padding' },
		{ class: 'p-2 / gap-2', value: '8px', usage: 'Standard small gap' },
		{ class: 'p-3 / gap-3', value: '12px', usage: 'List item padding, card body' },
		{ class: 'p-4 / gap-4', value: '16px', usage: 'Card padding, standard gap' },
		{ class: 'p-6 / gap-6', value: '24px', usage: 'Section padding, large gap' },
		{ class: 'p-8 / gap-8', value: '32px', usage: 'Page padding' }
	];

	const borderRadii = [
		{ class: 'rounded', value: '4px', usage: 'Buttons, inputs, badges' },
		{ class: 'rounded-lg', value: '8px', usage: 'Cards, panels, dropdowns' },
		{ class: 'rounded-full', value: '9999px', usage: 'Status dots, avatars' }
	];
</script>

<div class="p-6 lg:p-8 max-w-5xl">
	<div class="mb-8">
		<h1 class="text-2xl font-bold text-white mb-2">Layout</h1>
		<p class="text-gray-400">Spacing, grid patterns, and responsive design principles.</p>
	</div>

	<!-- Page Structure -->
	<section class="mb-12">
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Page Structure</h2>
		<p class="text-sm text-gray-400 mb-4">
			Standard page layout with header, sidebar navigation, and main content area.
		</p>
		<div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
			<!-- Mini layout diagram -->
			<div class="h-64 flex flex-col">
				<!-- Header -->
				<div class="shrink-0 h-12 border-b border-gray-700 bg-gray-800/50 flex items-center justify-between px-4">
					<div class="flex items-center gap-2">
						<div class="w-6 h-6 bg-gray-700 rounded"></div>
						<div class="w-16 h-3 bg-gray-700 rounded"></div>
					</div>
					<div class="flex items-center gap-2">
						<div class="w-12 h-3 bg-gray-700 rounded"></div>
						<div class="w-6 h-6 bg-gray-700 rounded"></div>
					</div>
				</div>
				<!-- Body -->
				<div class="flex-1 flex min-h-0">
					<!-- Sidebar -->
					<div class="w-32 shrink-0 border-r border-gray-700 bg-gray-800/30 p-2 space-y-1">
						<div class="h-6 bg-gray-700 rounded"></div>
						<div class="h-6 bg-gray-600 rounded"></div>
						<div class="h-6 bg-gray-700 rounded"></div>
					</div>
					<!-- Content -->
					<div class="flex-1 p-4 bg-gray-950">
						<div class="h-4 w-32 bg-gray-700 rounded mb-4"></div>
						<div class="grid grid-cols-2 gap-2">
							<div class="h-16 bg-gray-800 rounded"></div>
							<div class="h-16 bg-gray-800 rounded"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="mt-4 grid grid-cols-3 gap-4 text-xs">
			<div class="bg-gray-900 border border-gray-800 rounded p-3">
				<div class="text-gray-500 mb-1">Header</div>
				<code class="text-gray-400">shrink-0 px-4 py-3 border-b</code>
			</div>
			<div class="bg-gray-900 border border-gray-800 rounded p-3">
				<div class="text-gray-500 mb-1">Sidebar</div>
				<code class="text-gray-400">w-[12rem] shrink-0 border-r</code>
			</div>
			<div class="bg-gray-900 border border-gray-800 rounded p-3">
				<div class="text-gray-500 mb-1">Content</div>
				<code class="text-gray-400">flex-1 overflow-y-auto</code>
			</div>
		</div>
	</section>

	<!-- Split Panel Layout -->
	<section class="mb-12">
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Split Panel Layout</h2>
		<p class="text-sm text-gray-400 mb-4">
			Master-detail pattern used on Projects page. List on left, details on right.
		</p>
		<div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
			<div class="h-48 flex">
				<!-- Master (list) -->
				<div class="w-48 shrink-0 border-r border-gray-700 bg-gray-800/30">
					<div class="px-3 py-2 border-b border-gray-700 text-xs text-gray-500">Projects</div>
					<div class="p-2 space-y-1">
						<div class="h-8 bg-gray-700 border-l-2 border-blue-500 rounded-r"></div>
						<div class="h-8 bg-gray-800 rounded"></div>
						<div class="h-8 bg-gray-800 rounded"></div>
					</div>
				</div>
				<!-- Detail -->
				<div class="flex-1 p-4 bg-gray-950">
					<div class="h-4 w-24 bg-gray-700 rounded mb-3"></div>
					<div class="h-3 w-full bg-gray-800 rounded mb-2"></div>
					<div class="h-3 w-3/4 bg-gray-800 rounded"></div>
				</div>
			</div>
		</div>
		<pre class="mt-4 text-xs text-gray-400 bg-gray-900 border border-gray-800 p-4 rounded overflow-x-auto"><code>{`<div class="flex-1 flex flex-col lg:flex-row min-h-0 h-full">
  <!-- Master List -->
  <aside class="hidden lg:flex lg:flex-col w-[18rem] shrink-0 border-r border-gray-800">
    <!-- List content -->
  </aside>

  <!-- Detail Panel -->
  <div class="flex-1 flex flex-col overflow-y-auto">
    <!-- Detail content -->
  </div>
</div>`}</code></pre>
	</section>

	<!-- Two Column Layout -->
	<section class="mb-12">
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Two Column Layout</h2>
		<p class="text-sm text-gray-400 mb-4">
			Equal columns for side-by-side content (Console page pattern).
		</p>
		<div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
			<div class="h-32 flex gap-4 p-4 bg-gray-950">
				<div class="flex-1 bg-gray-800 rounded-lg p-3">
					<div class="h-3 w-24 bg-gray-700 rounded mb-2"></div>
					<div class="h-12 bg-gray-700/50 rounded"></div>
				</div>
				<div class="flex-1 bg-gray-800 rounded-lg p-3">
					<div class="h-3 w-24 bg-gray-700 rounded mb-2"></div>
					<div class="h-12 bg-gray-700/50 rounded"></div>
				</div>
			</div>
		</div>
		<pre class="mt-4 text-xs text-gray-400 bg-gray-900 border border-gray-800 p-4 rounded overflow-x-auto"><code>{`<div class="flex-1 flex flex-col lg:flex-row min-h-0 gap-4 lg:gap-6 p-4">
  <div class="flex-1 flex flex-col border border-gray-800 rounded-lg">
    <!-- Left panel -->
  </div>
  <div class="flex-1 flex flex-col border border-gray-800 rounded-lg">
    <!-- Right panel -->
  </div>
</div>`}</code></pre>
	</section>

	<!-- Spacing Scale -->
	<section class="mb-12">
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Spacing Scale</h2>
		<p class="text-sm text-gray-400 mb-4">
			Consistent spacing values used throughout the application.
		</p>
		<div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden divide-y divide-gray-800">
			{#each spacingScale as spacing}
				<div class="flex items-center px-4 py-3">
					<div class="w-32 shrink-0">
						<code class="text-xs text-blue-400">{spacing.class}</code>
					</div>
					<div class="w-16 shrink-0 text-xs text-gray-500">
						{spacing.value}
					</div>
					<div class="flex-1">
						<div class="flex items-center gap-2">
							<div class="bg-blue-500/30 border border-blue-500" style="width: {spacing.value}; height: {spacing.value};"></div>
							<span class="text-xs text-gray-400">{spacing.usage}</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Border Radius -->
	<section class="mb-12">
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Border Radius</h2>
		<div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden divide-y divide-gray-800">
			{#each borderRadii as radius}
				<div class="flex items-center px-4 py-3">
					<div class="w-32 shrink-0">
						<code class="text-xs text-blue-400">{radius.class}</code>
					</div>
					<div class="w-16 shrink-0 text-xs text-gray-500">
						{radius.value}
					</div>
					<div class="flex-1 flex items-center gap-4">
						<div class="w-12 h-12 bg-gray-700 {radius.class}"></div>
						<span class="text-xs text-gray-400">{radius.usage}</span>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Card Patterns -->
	<section class="mb-12">
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Card Patterns</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<!-- Bordered Card -->
			<div>
				<div class="text-xs text-gray-500 mb-2">Bordered Card</div>
				<div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
					<div class="px-4 py-3 border-b border-gray-800">
						<span class="text-sm font-medium text-white">Header</span>
					</div>
					<div class="p-4">
						<p class="text-sm text-gray-400">Card content</p>
					</div>
				</div>
				<code class="text-xs text-gray-500 mt-2 block">border border-gray-800 rounded-lg</code>
			</div>

			<!-- Filled Card -->
			<div>
				<div class="text-xs text-gray-500 mb-2">Filled Card</div>
				<div class="bg-gray-800 rounded-lg p-4">
					<div class="text-xs text-gray-500 uppercase tracking-wider mb-2">Label</div>
					<p class="text-sm text-gray-300">Card content</p>
				</div>
				<code class="text-xs text-gray-500 mt-2 block">bg-gray-800 rounded-lg p-4</code>
			</div>
		</div>
	</section>

	<!-- Responsive Patterns -->
	<section class="mb-12">
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Responsive Patterns</h2>
		<p class="text-sm text-gray-400 mb-4">
			Key breakpoint patterns for mobile and desktop.
		</p>
		<div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-gray-800">
						<th class="px-4 py-2 text-left text-xs text-gray-500 font-medium">Pattern</th>
						<th class="px-4 py-2 text-left text-xs text-gray-500 font-medium">Mobile</th>
						<th class="px-4 py-2 text-left text-xs text-gray-500 font-medium">Desktop (lg+)</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-800">
					<tr>
						<td class="px-4 py-3 text-gray-300">Navigation</td>
						<td class="px-4 py-3">
							<code class="text-xs text-gray-400">Horizontal tabs (border-b)</code>
						</td>
						<td class="px-4 py-3">
							<code class="text-xs text-gray-400">Vertical sidebar (border-r)</code>
						</td>
					</tr>
					<tr>
						<td class="px-4 py-3 text-gray-300">Sidebar</td>
						<td class="px-4 py-3">
							<code class="text-xs text-gray-400">hidden</code>
						</td>
						<td class="px-4 py-3">
							<code class="text-xs text-gray-400">lg:flex lg:flex-col</code>
						</td>
					</tr>
					<tr>
						<td class="px-4 py-3 text-gray-300">Split Panel</td>
						<td class="px-4 py-3">
							<code class="text-xs text-gray-400">Accordion (expandable)</code>
						</td>
						<td class="px-4 py-3">
							<code class="text-xs text-gray-400">Side-by-side panels</code>
						</td>
					</tr>
					<tr>
						<td class="px-4 py-3 text-gray-300">Content Layout</td>
						<td class="px-4 py-3">
							<code class="text-xs text-gray-400">flex-col</code>
						</td>
						<td class="px-4 py-3">
							<code class="text-xs text-gray-400">lg:flex-row</code>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>

	<!-- Navigation Patterns -->
	<section class="mb-12">
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Navigation Patterns</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<!-- Desktop Nav -->
			<div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
				<div class="px-4 py-2 border-b border-gray-800 text-xs text-gray-500">Desktop Sidebar</div>
				<div class="p-2">
					<div class="flex items-center gap-3 px-4 py-2.5 bg-gray-800 border-l-2 border-blue-500">
						<Activity class="w-4 h-4 text-blue-400" />
						<span class="text-sm text-white">Active</span>
					</div>
					<div class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-800/50 border-l-2 border-transparent">
						<Layers class="w-4 h-4 text-gray-500" />
						<span class="text-sm text-gray-300">Inactive</span>
					</div>
					<div class="flex items-center gap-3 pl-8 pr-4 py-2 hover:bg-gray-800/30 border-l-2 border-transparent">
						<Settings class="w-3.5 h-3.5 text-gray-500" />
						<span class="text-sm text-gray-400">Sub-item</span>
					</div>
				</div>
			</div>

			<!-- Mobile Nav -->
			<div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
				<div class="px-4 py-2 border-b border-gray-800 text-xs text-gray-500">Mobile Tabs</div>
				<div class="flex border-b border-gray-700">
					<div class="flex-1 py-2 text-center text-sm text-white border-b-2 border-blue-500">Console</div>
					<div class="flex-1 py-2 text-center text-sm text-gray-400">Projects</div>
					<div class="flex-1 py-2 text-center text-sm text-gray-400">Deploys</div>
				</div>
				<div class="p-4 text-center text-xs text-gray-500">Content area</div>
			</div>
		</div>
	</section>

	<!-- Overflow Handling -->
	<section class="mb-12">
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Overflow Handling</h2>
		<p class="text-sm text-gray-400 mb-4">
			Critical patterns for preventing layout breaks with long content.
		</p>
		<div class="bg-gray-900 border border-gray-800 rounded-lg p-4 space-y-4">
			<div>
				<div class="text-xs text-gray-500 mb-2">Flex with truncate</div>
				<div class="flex items-center gap-3 bg-gray-800 p-3 rounded max-w-sm">
					<div class="w-6 h-6 bg-gray-600 rounded shrink-0"></div>
					<div class="flex-1 min-w-0">
						<div class="text-sm text-white truncate">This is a very long project name that should truncate</div>
						<div class="text-xs text-gray-500 truncate">owner/repository-with-a-very-long-name</div>
					</div>
					<div class="shrink-0 text-xs text-gray-500">2m ago</div>
				</div>
				<code class="text-xs text-gray-500 mt-2 block">flex-1 min-w-0 + truncate</code>
			</div>

			<div>
				<div class="text-xs text-gray-500 mb-2">Scrollable container</div>
				<div class="bg-gray-800 rounded h-20 overflow-y-auto p-2">
					{#each Array(10) as _, i}
						<div class="text-xs text-gray-400 py-1">Item {i + 1}</div>
					{/each}
				</div>
				<code class="text-xs text-gray-500 mt-2 block">overflow-y-auto</code>
			</div>
		</div>
	</section>

	<!-- Z-Index Layers -->
	<section>
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Z-Index Layers</h2>
		<div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-gray-800">
						<th class="px-4 py-2 text-left text-xs text-gray-500 font-medium">Layer</th>
						<th class="px-4 py-2 text-left text-xs text-gray-500 font-medium">Z-Index</th>
						<th class="px-4 py-2 text-left text-xs text-gray-500 font-medium">Usage</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-800">
					<tr>
						<td class="px-4 py-3 text-gray-300">Base content</td>
						<td class="px-4 py-3"><code class="text-xs text-gray-400">z-0</code></td>
						<td class="px-4 py-3 text-xs text-gray-500">Page content, cards</td>
					</tr>
					<tr>
						<td class="px-4 py-3 text-gray-300">Sticky headers</td>
						<td class="px-4 py-3"><code class="text-xs text-gray-400">z-10</code></td>
						<td class="px-4 py-3 text-xs text-gray-500">Controls bar, table headers</td>
					</tr>
					<tr>
						<td class="px-4 py-3 text-gray-300">Dropdowns</td>
						<td class="px-4 py-3"><code class="text-xs text-gray-400">z-10</code></td>
						<td class="px-4 py-3 text-xs text-gray-500">Sort menus, select options</td>
					</tr>
					<tr>
						<td class="px-4 py-3 text-gray-300">Modals</td>
						<td class="px-4 py-3"><code class="text-xs text-gray-400">z-50</code></td>
						<td class="px-4 py-3 text-xs text-gray-500">Dialogs, overlays</td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>
</div>
