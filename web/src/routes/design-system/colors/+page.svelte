<script lang="ts">
	import { Copy, Check } from '@lucide/svelte';

	let copiedColor = $state<string | null>(null);

	async function copyColor(colorClass: string) {
		await navigator.clipboard.writeText(colorClass);
		copiedColor = colorClass;
		setTimeout(() => {
			copiedColor = null;
		}, 1500);
	}

	const grayScale = [
		{ name: 'gray-950', hex: '#030712', usage: 'Page background' },
		{ name: 'gray-900', hex: '#111827', usage: 'Surface, cards' },
		{ name: 'gray-800', hex: '#1f2937', usage: 'Borders, elevated surfaces' },
		{ name: 'gray-700', hex: '#374151', usage: 'Hover states, dividers' },
		{ name: 'gray-600', hex: '#4b5563', usage: 'Muted text' },
		{ name: 'gray-500', hex: '#6b7280', usage: 'Secondary text, icons' },
		{ name: 'gray-400', hex: '#9ca3af', usage: 'Body text' },
		{ name: 'gray-300', hex: '#d1d5db', usage: 'Primary text' },
		{ name: 'gray-200', hex: '#e5e7eb', usage: 'Headings' },
		{ name: 'gray-100', hex: '#f3f4f6', usage: 'High emphasis text' }
	];

	const semanticColors = [
		{
			category: 'Success',
			colors: [
				{ name: 'green-400', hex: '#4ade80', usage: 'Success indicators, deployed status' },
				{ name: 'green-500', hex: '#22c55e', usage: 'Success backgrounds' },
				{ name: 'green-900/30', hex: 'rgba(20,83,45,0.3)', usage: 'Success banner bg' }
			]
		},
		{
			category: 'Error',
			colors: [
				{ name: 'red-400', hex: '#f87171', usage: 'Error indicators, failed status' },
				{ name: 'red-500', hex: '#ef4444', usage: 'Error backgrounds' },
				{ name: 'red-900/30', hex: 'rgba(127,29,29,0.3)', usage: 'Error banner bg' }
			]
		},
		{
			category: 'Warning',
			colors: [
				{ name: 'yellow-400', hex: '#facc15', usage: 'Warning indicators' },
				{ name: 'yellow-500', hex: '#eab308', usage: 'Warning accents' }
			]
		},
		{
			category: 'Info',
			colors: [
				{ name: 'cyan-400', hex: '#22d3ee', usage: 'In-progress, deploying status' },
				{ name: 'cyan-900/30', hex: 'rgba(22,78,99,0.3)', usage: 'Info banner bg' }
			]
		}
	];

	const accentColors = [
		{
			category: 'Primary',
			colors: [
				{ name: 'blue-400', hex: '#60a5fa', usage: 'Links, active nav icons' },
				{ name: 'blue-500', hex: '#3b82f6', usage: 'Primary buttons, active borders' },
				{ name: 'blue-600', hex: '#2563eb', usage: 'Primary button hover' }
			]
		},
		{
			category: 'Secondary',
			colors: [
				{ name: 'indigo-400', hex: '#818cf8', usage: 'Repository indicators' },
				{ name: 'indigo-500', hex: '#6366f1', usage: 'Repo borders, badges' },
				{ name: 'indigo-950/50', hex: 'rgba(30,27,75,0.5)', usage: 'Repo header bg' }
			]
		},
		{
			category: 'Tertiary',
			colors: [
				{ name: 'emerald-400', hex: '#34d399', usage: 'Org portal indicators' },
				{ name: 'emerald-500', hex: '#10b981', usage: 'Org portal borders' },
				{ name: 'emerald-950/50', hex: 'rgba(6,78,59,0.5)', usage: 'Org portal header bg' }
			]
		},
		{
			category: 'Highlight',
			colors: [
				{ name: 'purple-400', hex: '#c084fc', usage: 'Special accents' },
				{ name: 'purple-500', hex: '#a855f7', usage: 'Highlight borders' },
				{ name: 'violet-400', hex: '#a78bfa', usage: 'Fly.io provider' }
			]
		}
	];

	const providerColors = [
		{ name: 'Cloudflare', color: 'orange-400', hex: '#fb923c' },
		{ name: 'Supabase', color: 'green-400', hex: '#4ade80' },
		{ name: 'Sentry', color: 'purple-400', hex: '#c084fc' },
		{ name: 'GitHub', color: 'gray-300', hex: '#d1d5db' },
		{ name: 'AWS', color: 'yellow-400', hex: '#facc15' },
		{ name: 'Vercel', color: 'white', hex: '#ffffff' },
		{ name: 'Fly.io', color: 'violet-400', hex: '#a78bfa' },
		{ name: 'GCP', color: 'blue-400', hex: '#60a5fa' }
	];
</script>

<div class="p-6 lg:p-8 max-w-5xl">
	<div class="mb-8">
		<h1 class="text-2xl font-bold text-white mb-2">Colors</h1>
		<p class="text-gray-400">Dark-first color palette optimized for data-heavy interfaces.</p>
	</div>

	<!-- Gray Scale -->
	<section class="mb-12">
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Gray Scale</h2>
		<p class="text-sm text-gray-400 mb-4">
			The foundation of the dark theme. Used for backgrounds, surfaces, borders, and text.
		</p>
		<div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
			{#each grayScale as color}
				<button
					onclick={() => copyColor(`bg-${color.name}`)}
					class="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-800/50 transition-colors text-left cursor-pointer border-b border-gray-800 last:border-b-0"
				>
					<div
						class="w-12 h-12 rounded-lg border border-gray-700 shrink-0"
						style="background-color: {color.hex};"
					></div>
					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-2">
							<code class="text-sm text-gray-200">{color.name}</code>
							<code class="text-xs text-gray-500 font-mono">{color.hex}</code>
						</div>
						<div class="text-xs text-gray-500 mt-0.5">{color.usage}</div>
					</div>
					<div class="shrink-0">
						{#if copiedColor === `bg-${color.name}`}
							<Check class="w-4 h-4 text-green-400" />
						{:else}
							<Copy class="w-4 h-4 text-gray-600" />
						{/if}
					</div>
				</button>
			{/each}
		</div>
	</section>

	<!-- Semantic Colors -->
	<section class="mb-12">
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Semantic Colors</h2>
		<p class="text-sm text-gray-400 mb-4">
			Status and feedback colors. Used consistently across all components.
		</p>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			{#each semanticColors as group}
				<div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
					<div class="px-4 py-2 border-b border-gray-800">
						<h3 class="text-sm font-medium text-gray-300">{group.category}</h3>
					</div>
					<div class="divide-y divide-gray-800">
						{#each group.colors as color}
							<button
								onclick={() => copyColor(color.name)}
								class="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-800/50 transition-colors text-left cursor-pointer"
							>
								<div
									class="w-8 h-8 rounded border border-gray-700 shrink-0"
									style="background-color: {color.hex};"
								></div>
								<div class="flex-1 min-w-0">
									<code class="text-xs text-gray-300">{color.name}</code>
									<div class="text-xs text-gray-500">{color.usage}</div>
								</div>
								{#if copiedColor === color.name}
									<Check class="w-3.5 h-3.5 text-green-400" />
								{:else}
									<Copy class="w-3.5 h-3.5 text-gray-600" />
								{/if}
							</button>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Accent Colors -->
	<section class="mb-12">
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Accent Colors</h2>
		<p class="text-sm text-gray-400 mb-4">
			Brand and feature-specific accents for differentiation.
		</p>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			{#each accentColors as group}
				<div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
					<div class="px-4 py-2 border-b border-gray-800">
						<h3 class="text-sm font-medium text-gray-300">{group.category}</h3>
					</div>
					<div class="divide-y divide-gray-800">
						{#each group.colors as color}
							<button
								onclick={() => copyColor(color.name)}
								class="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-800/50 transition-colors text-left cursor-pointer"
							>
								<div
									class="w-8 h-8 rounded border border-gray-700 shrink-0"
									style="background-color: {color.hex};"
								></div>
								<div class="flex-1 min-w-0">
									<code class="text-xs text-gray-300">{color.name}</code>
									<div class="text-xs text-gray-500">{color.usage}</div>
								</div>
								{#if copiedColor === color.name}
									<Check class="w-3.5 h-3.5 text-green-400" />
								{:else}
									<Copy class="w-3.5 h-3.5 text-gray-600" />
								{/if}
							</button>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Provider Colors -->
	<section class="mb-12">
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Provider Colors</h2>
		<p class="text-sm text-gray-400 mb-4">
			Consistent colors for third-party service providers.
		</p>
		<div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
			<div class="grid grid-cols-2 md:grid-cols-4">
				{#each providerColors as provider, i}
					<div class="p-4 {i < providerColors.length - 4 || i < 4 ? 'border-b' : ''} {i % 4 !== 3 ? 'border-r' : ''} border-gray-800">
						<div class="flex items-center gap-2 mb-2">
							<div
								class="w-4 h-4 rounded"
								style="background-color: {provider.hex};"
							></div>
							<span class="text-sm text-gray-300">{provider.name}</span>
						</div>
						<code class="text-xs text-gray-500">text-{provider.color}</code>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Status Indicators Live Example -->
	<section class="mb-12">
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Status Indicators</h2>
		<p class="text-sm text-gray-400 mb-4">
			Live examples of status dot patterns used throughout the app.
		</p>
		<div class="bg-gray-900 border border-gray-800 rounded-lg p-6">
			<div class="flex flex-wrap gap-6">
				<div class="flex items-center gap-2">
					<div class="w-2.5 h-2.5 rounded-full bg-green-500"></div>
					<span class="text-sm text-gray-300">Success</span>
				</div>
				<div class="flex items-center gap-2">
					<div class="w-2.5 h-2.5 rounded-full bg-red-500"></div>
					<span class="text-sm text-gray-300">Failure</span>
				</div>
				<div class="flex items-center gap-2">
					<div class="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse"></div>
					<span class="text-sm text-gray-300">In Progress</span>
				</div>
				<div class="flex items-center gap-2">
					<svg class="w-2.5 h-2.5 animate-spin" viewBox="0 0 16 16">
						<circle cx="8" cy="8" r="6" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="28" stroke-dashoffset="7" stroke-linecap="round" />
					</svg>
					<span class="text-sm text-gray-300">Deploying</span>
				</div>
				<div class="flex items-center gap-2">
					<div class="w-2.5 h-2.5 rounded-full bg-gray-500"></div>
					<span class="text-sm text-gray-300">Unknown</span>
				</div>
			</div>
		</div>
	</section>

	<!-- Code Example -->
	<section>
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Usage Example</h2>
		<div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
			<div class="px-4 py-2 border-b border-gray-800 bg-gray-800/50">
				<span class="text-xs text-gray-400">Status indicator pattern</span>
			</div>
			<pre class="p-4 text-sm text-gray-300 overflow-x-auto"><code>{`<!-- Success status -->
<div class="w-2.5 h-2.5 rounded-full bg-green-500"></div>

<!-- Deploying spinner -->
<svg class="w-2.5 h-2.5 animate-spin" viewBox="0 0 16 16">
  <circle cx="8" cy="8" r="6" fill="none"
    stroke="#ffffff" stroke-width="2"
    stroke-dasharray="28" stroke-dashoffset="7"
    stroke-linecap="round" />
</svg>

<!-- In-progress pulse -->
<div class="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse"></div>`}</code></pre>
		</div>
	</section>
</div>
