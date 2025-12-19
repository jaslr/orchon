<script lang="ts">
	import type { PageData } from './$types';
	import type { WorkflowStatus } from '$lib/github';

	let { data }: { data: PageData } = $props();

	const statusColors: Record<WorkflowStatus, string> = {
		success: 'bg-green-500',
		failure: 'bg-red-500',
		in_progress: 'bg-yellow-500 animate-pulse',
		unknown: 'bg-gray-500'
	};

	function formatTime(isoString: string): string {
		return new Date(isoString).toLocaleTimeString();
	}
</script>

<div class="min-h-screen bg-gray-900 text-white p-4">
	<div class="max-w-2xl mx-auto">
		<header class="mb-6 text-center">
			<h1 class="text-2xl font-bold text-gray-100">CI Monitor</h1>
			<p class="text-sm text-gray-500">Last updated: {formatTime(data.lastUpdated)}</p>
		</header>

		{#if data.statuses.length === 0}
			<div class="text-center text-gray-500 py-12">
				<p>No repos configured.</p>
				<p class="text-sm mt-2">Edit src/lib/config/repos.ts to add repos.</p>
			</div>
		{:else}
			<div class="space-y-2">
				{#each data.statuses as status (`${status.owner}/${status.repo}`)}
					<a
						href={status.html_url}
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
					>
						<div class="w-4 h-4 rounded-full {statusColors[status.status]} shrink-0"></div>
						<div class="flex-1 min-w-0">
							<div class="font-medium truncate">{status.repo}</div>
							<div class="text-xs text-gray-500 truncate">{status.owner}</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>
