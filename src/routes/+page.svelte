<script lang="ts">
	import type { PageData } from './$types';
	import type { WorkflowStatus, RepoStatus } from '$lib/github';

	let { data }: { data: PageData } = $props();

	let showDates = $state(false);
	let sortBy = $state<'name' | 'account' | 'recent'>('name');

	const statusColors: Record<WorkflowStatus, string> = {
		success: 'bg-green-500',
		failure: 'bg-red-500',
		in_progress: 'bg-yellow-500 animate-pulse',
		unknown: 'bg-gray-500'
	};

	function formatTime(isoString: string): string {
		return new Date(isoString).toLocaleTimeString();
	}

	function formatRunDate(isoString: string | null): { date: string; time: string } {
		if (!isoString) return { date: '', time: '' };
		const d = new Date(isoString);
		const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
		const date = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
		const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
		return { date, time };
	}

	function sortedStatuses(statuses: RepoStatus[], sort: 'name' | 'account' | 'recent'): RepoStatus[] {
		const sorted = [...statuses];
		if (sort === 'name') {
			sorted.sort((a, b) => a.repo.localeCompare(b.repo));
		} else if (sort === 'account') {
			sorted.sort((a, b) => a.owner.localeCompare(b.owner) || a.repo.localeCompare(b.repo));
		} else if (sort === 'recent') {
			sorted.sort((a, b) => {
				if (!a.run_date && !b.run_date) return 0;
				if (!a.run_date) return 1;
				if (!b.run_date) return -1;
				return new Date(b.run_date).getTime() - new Date(a.run_date).getTime();
			});
		}
		return sorted;
	}

	let displayStatuses = $derived(sortedStatuses(data.statuses, sortBy));
</script>

<div class="min-h-screen bg-gray-900 text-white p-4">
	<div class="max-w-2xl mx-auto">
		<header class="mb-4 text-center">
			<h1 class="text-2xl font-bold text-gray-100">CI Monitor</h1>
			<p class="text-sm text-gray-500">Last updated: {formatTime(data.lastUpdated)}</p>
		</header>

		<!-- Controls -->
		<div class="flex items-center justify-between mb-4 gap-4 flex-wrap">
			<!-- Show Dates Toggle -->
			<label class="flex items-center gap-2 cursor-pointer">
				<div class="relative">
					<input type="checkbox" bind:checked={showDates} class="sr-only peer" />
					<div class="w-10 h-5 bg-gray-700 rounded-full peer-checked:bg-blue-600 transition-colors"></div>
					<div class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
				</div>
				<span class="text-sm text-gray-400">Show dates</span>
			</label>

			<!-- Sort Options -->
			<div class="flex gap-2">
				<button
					onclick={() => sortBy = 'name'}
					class="px-3 py-1 text-sm rounded {sortBy === 'name' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'} transition-colors"
				>
					A-Z
				</button>
				<button
					onclick={() => sortBy = 'account'}
					class="px-3 py-1 text-sm rounded {sortBy === 'account' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'} transition-colors"
				>
					Account
				</button>
				<button
					onclick={() => sortBy = 'recent'}
					class="px-3 py-1 text-sm rounded {sortBy === 'recent' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'} transition-colors"
				>
					Recent
				</button>
			</div>
		</div>

		{#if data.statuses.length === 0}
			<div class="text-center text-gray-500 py-12">
				<p>No repos configured.</p>
				<p class="text-sm mt-2">Edit src/lib/config/repos.ts to add repos.</p>
			</div>
		{:else}
			<div class="space-y-2">
				{#each displayStatuses as status (`${status.owner}/${status.repo}`)}
					{@const runDate = formatRunDate(status.run_date)}
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
						{#if showDates && status.run_date}
							<div class="text-right shrink-0">
								<div class="text-sm text-gray-300">{runDate.date}</div>
								<div class="text-xs text-gray-500">{runDate.time}</div>
							</div>
						{/if}
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>
