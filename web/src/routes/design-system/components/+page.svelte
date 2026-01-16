<script lang="ts">
	import {
		Settings,
		ExternalLink,
		ZoomIn,
		ZoomOut,
		Focus,
		ArrowUpAZ,
		Filter,
		ChevronDown,
		X,
		Radio,
		Cloud,
		Server,
		GitBranch,
		Check
	} from '@lucide/svelte';

	let selectedTab = $state<'primary' | 'secondary'>('primary');
	let dropdownOpen = $state(false);
	let inputValue = $state('');
</script>

<div class="p-6 lg:p-8 max-w-5xl">
	<div class="mb-8">
		<h1 class="text-2xl font-bold text-white mb-2">Components</h1>
		<p class="text-gray-400">Reusable UI components for consistent interfaces.</p>
	</div>

	<!-- Buttons -->
	<section class="mb-12">
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Buttons</h2>

		<!-- Primary Buttons -->
		<div class="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-4">
			<h3 class="text-xs text-gray-500 mb-4">Primary Actions</h3>
			<div class="flex flex-wrap items-center gap-4 mb-6">
				<button class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded transition-colors">
					Primary
				</button>
				<button class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded transition-colors">
					<Focus class="w-4 h-4" />
					With Icon
				</button>
				<button class="px-4 py-2 bg-blue-600/50 text-blue-300 text-sm font-medium rounded cursor-not-allowed">
					Disabled
				</button>
			</div>
			<pre class="text-xs text-gray-400 bg-gray-800 p-3 rounded overflow-x-auto"><code>{`<button class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded transition-colors">
  Primary
</button>`}</code></pre>
		</div>

		<!-- Secondary Buttons -->
		<div class="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-4">
			<h3 class="text-xs text-gray-500 mb-4">Secondary Actions</h3>
			<div class="flex flex-wrap items-center gap-4 mb-6">
				<button class="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded transition-colors">
					Secondary
				</button>
				<button class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded transition-colors">
					<Settings class="w-3.5 h-3.5" />
					Settings
				</button>
				<button class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded transition-colors">
					View logs
					<ExternalLink class="w-3 h-3" />
				</button>
			</div>
			<pre class="text-xs text-gray-400 bg-gray-800 p-3 rounded overflow-x-auto"><code>{`<button class="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded transition-colors">
  Secondary
</button>`}</code></pre>
		</div>

		<!-- Icon Buttons -->
		<div class="bg-gray-900 border border-gray-800 rounded-lg p-6">
			<h3 class="text-xs text-gray-500 mb-4">Icon Buttons</h3>
			<div class="flex flex-wrap items-center gap-4 mb-6">
				<button class="p-1.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-300 transition-colors">
					<ZoomIn class="w-4 h-4" />
				</button>
				<button class="p-1.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-300 transition-colors">
					<ZoomOut class="w-4 h-4" />
				</button>
				<button class="p-2 -m-2 text-gray-400 hover:text-gray-200 transition-colors">
					<Settings class="w-5 h-5" />
				</button>
			</div>
			<pre class="text-xs text-gray-400 bg-gray-800 p-3 rounded overflow-x-auto"><code>{`<button class="p-1.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-300 transition-colors">
  <ZoomIn class="w-4 h-4" />
</button>`}</code></pre>
		</div>
	</section>

	<!-- Toggle Buttons / Tabs -->
	<section class="mb-12">
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Toggle Groups</h2>
		<div class="bg-gray-900 border border-gray-800 rounded-lg p-6">
			<h3 class="text-xs text-gray-500 mb-4">Segmented Control</h3>
			<div class="flex items-center gap-1 bg-gray-800 rounded-lg p-0.5 w-fit mb-6">
				<button
					onclick={() => selectedTab = 'primary'}
					class="px-3 py-1 text-xs rounded-md transition-colors {selectedTab === 'primary' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'}"
				>
					Primary
				</button>
				<button
					onclick={() => selectedTab = 'secondary'}
					class="px-3 py-1 text-xs rounded-md transition-colors {selectedTab === 'secondary' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}"
				>
					Secondary
				</button>
			</div>
			<pre class="text-xs text-gray-400 bg-gray-800 p-3 rounded overflow-x-auto"><code>{`<div class="flex items-center gap-1 bg-gray-800 rounded-lg p-0.5">
  <button class="px-3 py-1 text-xs rounded-md {active ? 'bg-emerald-600 text-white' : 'text-gray-400'}">
    Option
  </button>
</div>`}</code></pre>
		</div>
	</section>

	<!-- Inputs -->
	<section class="mb-12">
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Inputs</h2>
		<div class="bg-gray-900 border border-gray-800 rounded-lg p-6">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
				<div>
					<h3 class="text-xs text-gray-500 mb-3">Text Input</h3>
					<input
						type="text"
						bind:value={inputValue}
						placeholder="Enter text..."
						class="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
					/>
				</div>
				<div>
					<h3 class="text-xs text-gray-500 mb-3">Select</h3>
					<select class="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-blue-500">
						<option value="">Select option...</option>
						<option value="1">Option 1</option>
						<option value="2">Option 2</option>
					</select>
				</div>
			</div>
			<pre class="text-xs text-gray-400 bg-gray-800 p-3 rounded overflow-x-auto"><code>{`<input
  type="text"
  class="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
  placeholder="Enter text..."
/>`}</code></pre>
		</div>
	</section>

	<!-- Dropdowns -->
	<section class="mb-12">
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Dropdowns</h2>
		<div class="bg-gray-900 border border-gray-800 rounded-lg p-6">
			<h3 class="text-xs text-gray-500 mb-4">Sort Dropdown</h3>
			<div class="relative inline-block mb-6">
				<button
					onclick={() => dropdownOpen = !dropdownOpen}
					class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-sm text-gray-300 transition-colors"
				>
					<ArrowUpAZ class="w-4 h-4" />
					Sort
					<ChevronDown class="w-3 h-3" />
				</button>
				{#if dropdownOpen}
					<div class="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded shadow-lg z-10 min-w-[120px]">
						<button class="w-full flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-gray-700 text-white">
							<ArrowUpAZ class="w-4 h-4" />
							A-Z
						</button>
						<button class="w-full flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-gray-700 text-gray-400">
							Recent
						</button>
					</div>
				{/if}
			</div>
			<pre class="text-xs text-gray-400 bg-gray-800 p-3 rounded overflow-x-auto"><code>{`<div class="relative">
  <button class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-sm text-gray-300">
    <ArrowUpAZ class="w-4 h-4" />
    Sort
    <ChevronDown class="w-3 h-3" />
  </button>
  {#if open}
    <div class="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded shadow-lg z-10">
      <!-- Options -->
    </div>
  {/if}
</div>`}</code></pre>
		</div>
	</section>

	<!-- Badges & Chips -->
	<section class="mb-12">
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Badges and Chips</h2>
		<div class="bg-gray-900 border border-gray-800 rounded-lg p-6">
			<h3 class="text-xs text-gray-500 mb-4">Status Badges</h3>
			<div class="flex flex-wrap items-center gap-3 mb-6">
				<span class="px-2 py-0.5 rounded text-xs bg-green-900/50 text-green-400">Success</span>
				<span class="px-2 py-0.5 rounded text-xs bg-red-900/50 text-red-400">Failed</span>
				<span class="px-2 py-0.5 rounded text-xs bg-cyan-900/50 text-cyan-400">Deploying</span>
				<span class="px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-400">Unknown</span>
			</div>

			<h3 class="text-xs text-gray-500 mb-4">Filter Chips</h3>
			<div class="flex flex-wrap items-center gap-2 mb-6">
				<button class="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-500">
					Project Name
					<X class="w-3 h-3" />
				</button>
				<button class="px-2 py-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded">
					Add filter
				</button>
			</div>

			<h3 class="text-xs text-gray-500 mb-4">Tech Stack Chips</h3>
			<div class="flex flex-wrap gap-2 mb-6">
				<span class="px-3 py-1.5 bg-gray-700 text-sm text-blue-400 rounded">SvelteKit</span>
				<span class="px-3 py-1.5 bg-gray-700 text-sm text-cyan-400 rounded">Tailwind</span>
				<span class="px-3 py-1.5 bg-gray-700 text-sm text-yellow-400 rounded">Vite</span>
			</div>

			<pre class="text-xs text-gray-400 bg-gray-800 p-3 rounded overflow-x-auto"><code>{`<!-- Status badge -->
<span class="px-2 py-0.5 rounded text-xs bg-green-900/50 text-green-400">Success</span>

<!-- Filter chip with close -->
<button class="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded">
  Project Name
  <X class="w-3 h-3" />
</button>`}</code></pre>
		</div>
	</section>

	<!-- Cards -->
	<section class="mb-12">
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Cards</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
			<!-- Basic Card -->
			<div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
				<div class="px-4 py-3 border-b border-gray-800">
					<h3 class="text-sm font-medium text-white">Basic Card</h3>
				</div>
				<div class="p-4">
					<p class="text-sm text-gray-400">Card content goes here.</p>
				</div>
			</div>

			<!-- Status Card -->
			<div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
				<div class="px-4 py-3 border-b border-gray-800 flex items-center gap-2">
					<div class="w-2.5 h-2.5 rounded-full bg-green-500"></div>
					<h3 class="text-sm font-medium text-white">With Status</h3>
				</div>
				<div class="p-4">
					<p class="text-sm text-gray-400">Card with status indicator.</p>
				</div>
			</div>
		</div>

		<!-- Project Card Example -->
		<div class="bg-gray-900 border border-gray-800 rounded-lg p-6">
			<h3 class="text-xs text-gray-500 mb-4">Project Card Pattern</h3>
			<div class="max-w-sm">
				<button class="w-full flex items-center gap-3 px-4 py-3 text-left bg-gray-800 border-l-2 border-blue-500 rounded-r-lg">
					<div class="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0"></div>
					<div class="flex-1 min-w-0">
						<div class="font-medium text-sm text-white truncate">Project Name</div>
						<div class="text-xs text-gray-500 truncate">owner/repo</div>
					</div>
					<div class="flex items-center gap-1.5 text-gray-500">
						<GitBranch class="w-3.5 h-3.5" />
						<span class="text-xs">v1.2.3</span>
					</div>
				</button>
			</div>
		</div>
	</section>

	<!-- Status Indicators -->
	<section class="mb-12">
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Status Indicators</h2>
		<div class="bg-gray-900 border border-gray-800 rounded-lg p-6">
			<h3 class="text-xs text-gray-500 mb-4">Connection Status</h3>
			<div class="flex flex-wrap gap-6 mb-6">
				<div class="flex items-center gap-2 text-xs px-2 py-1 rounded hover:bg-gray-800">
					<Radio class="w-3 h-3 text-green-400" />
					<span class="text-green-400">Live</span>
				</div>
				<div class="flex items-center gap-2 text-xs px-2 py-1 rounded hover:bg-gray-800">
					<Radio class="w-3 h-3 text-gray-500" />
					<span class="text-gray-500">Offline</span>
				</div>
			</div>

			<h3 class="text-xs text-gray-500 mb-4">Service Health</h3>
			<div class="flex flex-wrap gap-6 mb-6">
				<div class="flex items-center gap-2">
					<Cloud class="w-4 h-4 text-green-400" />
					<span class="text-sm text-gray-300">Healthy</span>
				</div>
				<div class="flex items-center gap-2">
					<Server class="w-4 h-4 text-yellow-400" />
					<span class="text-sm text-gray-300">Degraded</span>
				</div>
				<div class="flex items-center gap-2">
					<Server class="w-4 h-4 text-red-400" />
					<span class="text-sm text-gray-300">Down</span>
				</div>
			</div>

			<pre class="text-xs text-gray-400 bg-gray-800 p-3 rounded overflow-x-auto"><code>{`<!-- SSE Connection Status -->
<div class="flex items-center gap-2 text-xs">
  <Radio class="w-3 h-3 {connected ? 'text-green-400' : 'text-gray-500'}" />
  <span class="{connected ? 'text-green-400' : 'text-gray-500'}">
    {connected ? 'Live' : 'Offline'}
  </span>
</div>`}</code></pre>
		</div>
	</section>

	<!-- Alert Banners -->
	<section class="mb-12">
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Alert Banners</h2>
		<div class="space-y-4">
			<!-- Success -->
			<div class="flex items-center gap-3 p-3 bg-green-900/30 border border-green-800 rounded">
				<div class="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
					<Check class="w-3 h-3 text-white" />
				</div>
				<div class="flex-1">
					<div class="text-green-400 font-medium">Deployed Successfully</div>
					<div class="text-sm text-green-300/70">Last deployment succeeded</div>
				</div>
			</div>

			<!-- Error -->
			<div class="flex items-center gap-3 p-3 bg-red-900/30 border border-red-800 rounded">
				<X class="w-5 h-5 text-red-400 shrink-0" />
				<div class="flex-1">
					<div class="text-red-400 font-medium">Deployment Failed</div>
					<div class="text-sm text-red-300/70">Build error in workflow</div>
				</div>
				<button class="px-3 py-1.5 bg-red-800 hover:bg-red-700 rounded text-sm text-red-100">
					View Logs
				</button>
			</div>

			<!-- Info -->
			<div class="flex items-center gap-3 p-3 bg-cyan-900/30 border border-cyan-800 rounded">
				<svg class="w-5 h-5 animate-spin text-cyan-400 shrink-0" viewBox="0 0 16 16">
					<circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="28" stroke-dashoffset="7" stroke-linecap="round" />
				</svg>
				<div class="flex-1">
					<div class="text-cyan-400 font-medium">Deploying...</div>
					<div class="text-sm text-cyan-300/70">Deployment in progress</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Controls Bar Pattern -->
	<section>
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Controls Bar</h2>
		<p class="text-sm text-gray-400 mb-4">
			Pattern from the Infrastructure Map page for toolbars.
		</p>
		<div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
			<div class="flex items-center justify-between px-4 py-2 bg-gray-900/80 border-b border-gray-800">
				<div class="flex items-center gap-4">
					<h1 class="text-lg font-semibold text-white">Page Title</h1>
					<div class="flex items-center gap-1 bg-gray-800 rounded-lg p-0.5">
						<button class="px-3 py-1 text-xs rounded-md bg-emerald-600 text-white">Active</button>
						<button class="px-3 py-1 text-xs rounded-md text-gray-400 hover:text-white">Inactive</button>
					</div>
					<span class="text-xs text-gray-500">3 items</span>
				</div>
				<div class="flex items-center gap-2">
					<button class="flex items-center gap-1.5 px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300">
						<Filter class="w-3.5 h-3.5" />
						Filter
					</button>
					<div class="flex items-center gap-1 ml-2">
						<button class="p-1.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-300">
							<ZoomOut class="w-4 h-4" />
						</button>
						<span class="text-xs text-gray-400 w-14 text-center">100%</span>
						<button class="p-1.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-300">
							<ZoomIn class="w-4 h-4" />
						</button>
						<button class="flex items-center gap-1.5 px-2 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-xs text-white font-medium ml-2">
							<Focus class="w-3.5 h-3.5" />
							Fit
						</button>
					</div>
				</div>
			</div>
			<div class="px-4 py-1 text-xs text-gray-500 bg-gray-900/50">
				Scroll to zoom | Drag to pan
			</div>
		</div>
	</section>
</div>
