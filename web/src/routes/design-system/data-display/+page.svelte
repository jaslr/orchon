<script lang="ts">
	import {
		Cloud,
		CheckCircle,
		XCircle,
		Loader,
		ExternalLink,
		GitBranch,
		Clock,
		ArrowRight,
		GitCommit,
		Layers,
		Server,
		Database,
		Shield
	} from '@lucide/svelte';

	// Sample data
	const deployments = [
		{ id: 1, project: 'orchon-web', status: 'success', time: '2m ago', branch: 'main', provider: 'Cloudflare' },
		{ id: 2, project: 'livna', status: 'in_progress', time: '1m ago', branch: 'feature/auth', provider: 'GCP' },
		{ id: 3, project: 'littlelistoflights', status: 'failure', time: '15m ago', branch: 'main', provider: 'Vercel' }
	];

	const projects = [
		{ name: 'orchon', owner: 'jaslr', version: 'v1.3.16', status: 'success', services: 4 },
		{ name: 'livna', owner: 'jvp-ux', version: 'v2.1.0', status: 'deploying', services: 6 },
		{ name: 'junipa', owner: 'jvp-ux', version: 'v3.0.0', status: 'failure', services: 8 }
	];

	const commits = [
		{ repo: 'orchon', sha: 'bc115a5', message: 'Add API secret to build', time: '5m ago' },
		{ repo: 'livna', sha: 'f4a2c3d', message: 'Fix quote conversion bug', time: '1h ago' },
		{ repo: 'junipa', sha: 'e8b1d2c', message: 'Update dependencies', time: '2h ago' }
	];

	const services = [
		{ category: 'hosting', provider: 'Cloudflare', name: 'Pages', icon: Cloud },
		{ category: 'database', provider: 'Supabase', name: 'Postgres', icon: Database },
		{ category: 'auth', provider: 'Supabase', name: 'Auth', icon: Shield },
		{ category: 'ci', provider: 'GitHub', name: 'Actions', icon: GitBranch }
	];
</script>

<div class="p-6 lg:p-8 max-w-5xl">
	<div class="mb-8">
		<h1 class="text-2xl font-bold text-white mb-2">Data Display</h1>
		<p class="text-gray-400">High-density patterns for displaying infrastructure data.</p>
	</div>

	<!-- Dense List Pattern -->
	<section class="mb-12">
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Dense List</h2>
		<p class="text-sm text-gray-400 mb-4">
			Primary pattern for displaying deployments and activity logs.
		</p>
		<div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
			<div class="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
				<div class="flex items-center gap-2 text-gray-400">
					<Cloud class="w-4 h-4" />
					<span class="text-sm font-medium">Recent Deployments</span>
				</div>
				<a href="#" class="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1">
					View all <ArrowRight class="w-3 h-3" />
				</a>
			</div>

			<div class="divide-y divide-gray-800">
				{#each deployments as deployment}
					<a href="#" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-800/50 transition-colors">
						<div class="shrink-0">
							{#if deployment.status === 'in_progress'}
								<Loader class="w-5 h-5 text-cyan-400 animate-spin" />
							{:else if deployment.status === 'success'}
								<CheckCircle class="w-5 h-5 text-green-400" />
							{:else}
								<XCircle class="w-5 h-5 text-red-400" />
							{/if}
						</div>
						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-2">
								<span class="font-medium text-white truncate">{deployment.project}</span>
								<span class="text-xs px-1.5 py-0.5 rounded {deployment.status === 'success' ? 'text-green-400 bg-gray-800' : deployment.status === 'in_progress' ? 'text-cyan-400 bg-gray-800' : 'text-red-400 bg-gray-800'}">
									{deployment.status === 'in_progress' ? 'Deploying' : deployment.status === 'success' ? 'Success' : 'Failed'}
								</span>
							</div>
							<div class="text-xs text-gray-500 truncate">
								{deployment.provider} | {deployment.branch}
							</div>
						</div>
						<div class="shrink-0 text-xs text-gray-500">
							{deployment.time}
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<!-- Selectable List Pattern -->
	<section class="mb-12">
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Selectable List</h2>
		<p class="text-sm text-gray-400 mb-4">
			List items that can be selected, with active border indicator.
		</p>
		<div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden max-w-sm">
			{#each projects as project, i}
				{@const isSelected = i === 0}
				<button class="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors {isSelected ? 'bg-gray-800 border-l-2 border-blue-500' : 'hover:bg-gray-800/50 border-l-2 border-transparent'}">
					<div class="w-2.5 h-2.5 rounded-full {project.status === 'success' ? 'bg-green-500' : project.status === 'deploying' ? 'bg-transparent' : 'bg-red-500'} shrink-0">
						{#if project.status === 'deploying'}
							<svg class="w-2.5 h-2.5 animate-spin" viewBox="0 0 16 16">
								<circle cx="8" cy="8" r="6" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="28" stroke-dashoffset="7" stroke-linecap="round" />
							</svg>
						{/if}
					</div>
					<div class="flex-1 min-w-0">
						<div class="font-medium text-sm {isSelected ? 'text-white' : 'text-gray-300'} truncate">
							{project.name}
						</div>
						<div class="text-xs text-gray-500 truncate">{project.owner}</div>
					</div>
					<div class="flex items-center gap-1.5 text-gray-500 shrink-0">
						<GitBranch class="w-3.5 h-3.5" />
						<span class="text-xs">{project.version}</span>
					</div>
					<div class="flex items-center gap-1 text-xs text-gray-500 shrink-0">
						<Layers class="w-3 h-3" />
						<span>{project.services}</span>
					</div>
				</button>
			{/each}
		</div>
	</section>

	<!-- Commit Activity Pattern -->
	<section class="mb-12">
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Activity Feed</h2>
		<p class="text-sm text-gray-400 mb-4">
			Compact commit and activity display.
		</p>
		<div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
			<div class="px-4 py-3 border-b border-gray-800 flex items-center gap-2 text-gray-400">
				<GitCommit class="w-4 h-4" />
				<span class="text-sm font-medium">Recent Commits</span>
			</div>
			<div class="divide-y divide-gray-800">
				{#each commits as commit}
					<a href="#" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-800/50 transition-colors">
						<GitCommit class="w-5 h-5 text-gray-400 shrink-0" />
						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-2">
								<span class="font-medium text-white truncate">{commit.repo}</span>
								<code class="text-xs text-gray-500 font-mono">{commit.sha}</code>
							</div>
							<div class="text-xs text-gray-500 truncate">{commit.message}</div>
						</div>
						<div class="shrink-0 flex items-center gap-2 text-xs text-gray-500">
							<span>{commit.time}</span>
							<ExternalLink class="w-3 h-3" />
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<!-- Service Grid Pattern -->
	<section class="mb-12">
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Service Grid</h2>
		<p class="text-sm text-gray-400 mb-4">
			Compact grid for displaying infrastructure services.
		</p>
		<div class="bg-gray-900 border border-gray-800 rounded-lg p-4">
			<div class="grid grid-cols-2 gap-3 text-xs">
				{#each services as service}
					{@const IconComponent = service.icon}
					<div class="bg-gray-800 p-2">
						<div class="flex items-center gap-1 text-gray-500 uppercase tracking-wider mb-1">
							<IconComponent class="w-3 h-3" />
							<span>{service.category}</span>
						</div>
						<a href="#" class="flex items-center gap-1 py-0.5 text-gray-300 hover:underline">
							<span class="truncate">{service.name}</span>
							<ExternalLink class="w-2.5 h-2.5 opacity-50 shrink-0" />
						</a>
						<div class="text-gray-500">{service.provider}</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Data Table Pattern -->
	<section class="mb-12">
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Data Table</h2>
		<p class="text-sm text-gray-400 mb-4">
			Minimal table for structured data. Headers are compact and muted.
		</p>
		<div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
			<table class="w-full">
				<thead>
					<tr class="border-b border-gray-800">
						<th class="px-4 py-2 text-left text-xs text-gray-500 uppercase tracking-wider font-medium">Project</th>
						<th class="px-4 py-2 text-left text-xs text-gray-500 uppercase tracking-wider font-medium">Status</th>
						<th class="px-4 py-2 text-left text-xs text-gray-500 uppercase tracking-wider font-medium">Version</th>
						<th class="px-4 py-2 text-left text-xs text-gray-500 uppercase tracking-wider font-medium">Services</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-800">
					{#each projects as project}
						<tr class="hover:bg-gray-800/50">
							<td class="px-4 py-3">
								<div class="text-sm text-white">{project.name}</div>
								<div class="text-xs text-gray-500">{project.owner}</div>
							</td>
							<td class="px-4 py-3">
								<div class="flex items-center gap-2">
									<div class="w-2 h-2 rounded-full {project.status === 'success' ? 'bg-green-500' : project.status === 'deploying' ? 'bg-cyan-400 animate-pulse' : 'bg-red-500'}"></div>
									<span class="text-xs text-gray-400 capitalize">{project.status}</span>
								</div>
							</td>
							<td class="px-4 py-3">
								<code class="text-xs text-gray-400 font-mono">{project.version}</code>
							</td>
							<td class="px-4 py-3">
								<span class="text-sm text-gray-400">{project.services}</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	<!-- Key-Value Display -->
	<section class="mb-12">
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Key-Value Display</h2>
		<p class="text-sm text-gray-400 mb-4">
			Two-column layout for displaying metadata.
		</p>
		<div class="bg-gray-900 border border-gray-800 rounded-lg p-4">
			<div class="grid grid-cols-2 gap-4 text-sm">
				<div>
					<div class="text-gray-500 text-xs uppercase mb-1">Platform</div>
					<div class="text-gray-300 capitalize">Cloudflare</div>
				</div>
				<div>
					<div class="text-gray-500 text-xs uppercase mb-1">Last Updated</div>
					<div class="text-gray-300">
						2m ago
						<span class="text-gray-500 text-xs ml-1">(Jan 17, 2026, 10:30 AM)</span>
					</div>
				</div>
				<div>
					<div class="text-gray-500 text-xs uppercase mb-1">Commit</div>
					<a href="#" class="text-blue-400 hover:text-blue-300 font-mono text-xs flex items-center gap-1">
						bc115a5 <ExternalLink class="w-3 h-3" />
					</a>
				</div>
				<div>
					<div class="text-gray-500 text-xs uppercase mb-1">CI Run</div>
					<a href="#" class="text-blue-400 hover:text-blue-300 flex items-center gap-1">
						deploy.yml <ExternalLink class="w-3 h-3" />
					</a>
				</div>
			</div>
		</div>
	</section>

	<!-- Empty State -->
	<section class="mb-12">
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Empty State</h2>
		<p class="text-sm text-gray-400 mb-4">
			Consistent empty state pattern for when no data is available.
		</p>
		<div class="bg-gray-900 border border-gray-800 rounded-lg">
			<div class="p-8 text-center text-gray-500">
				<Cloud class="w-12 h-12 mx-auto mb-3 opacity-50" />
				<p class="text-lg">No deployments found</p>
				<p class="text-sm mt-1">Try selecting a different project or clear the filter</p>
			</div>
		</div>
	</section>

	<!-- Code Examples -->
	<section>
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Code Pattern</h2>
		<div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
			<div class="px-4 py-2 border-b border-gray-800 bg-gray-800/50">
				<span class="text-xs text-gray-400">Dense list item</span>
			</div>
			<pre class="p-4 text-sm text-gray-300 overflow-x-auto"><code>{`<a class="flex items-center gap-3 px-4 py-3 hover:bg-gray-800/50 transition-colors">
  <!-- Status Icon -->
  <div class="shrink-0">
    {#if status === 'success'}
      <CheckCircle class="w-5 h-5 text-green-400" />
    {:else if status === 'in_progress'}
      <Loader class="w-5 h-5 text-cyan-400 animate-spin" />
    {:else}
      <XCircle class="w-5 h-5 text-red-400" />
    {/if}
  </div>

  <!-- Content -->
  <div class="flex-1 min-w-0">
    <div class="flex items-center gap-2">
      <span class="font-medium text-white truncate">{project}</span>
      <span class="text-xs px-1.5 py-0.5 rounded text-green-400 bg-gray-800">
        {status}
      </span>
    </div>
    <div class="text-xs text-gray-500 truncate">
      {provider} | {branch}
    </div>
  </div>

  <!-- Time -->
  <div class="shrink-0 text-xs text-gray-500">
    {time}
  </div>
</a>`}</code></pre>
		</div>
	</section>
</div>
