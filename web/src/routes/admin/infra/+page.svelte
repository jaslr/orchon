<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import {
		Database,
		CheckCircle,
		XCircle,
		AlertTriangle,
		Play,
		Trash2,
		Plus,
		RefreshCw,
		Clock,
		Terminal,
		Cloud,
		Github
	} from '@lucide/svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let showAddForm = $state(false);
	let newAction = $state({
		serviceId: '',
		name: '',
		actionType: 'fly-api',
		config: '{}'
	});

	// Get status color
	function getStatusColor(status: string): string {
		switch (status) {
			case 'healthy':
			case 'success':
				return 'text-green-400';
			case 'degraded':
			case 'running':
				return 'text-yellow-400';
			case 'down':
			case 'failure':
				return 'text-red-400';
			default:
				return 'text-gray-400';
		}
	}

	// Get action type icon
	function getActionIcon(type: string) {
		switch (type) {
			case 'fly-api':
				return Cloud;
			case 'github-workflow':
				return Github;
			case 'ssh-command':
				return Terminal;
			default:
				return Play;
		}
	}

	// Format relative time
	function formatRelativeTime(isoString: string | null): string {
		if (!isoString) return 'Never';
		const date = new Date(isoString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);

		if (diffMins < 1) return 'Just now';
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		return date.toLocaleDateString();
	}

	// Group actions by service
	let actionsByService = $derived.by(() => {
		const grouped = new Map<string, typeof data.actions>();
		for (const action of data.actions) {
			const list = grouped.get(action.serviceId) || [];
			list.push(action);
			grouped.set(action.serviceId, list);
		}
		return grouped;
	});

	// Unique service IDs for the form dropdown
	let serviceIds = $derived.by(() => {
		const ids = new Set<string>();
		for (const svc of data.health.services) {
			ids.add(svc.id);
		}
		return Array.from(ids).sort();
	});
</script>

<svelte:head>
	<title>Infrastructure | Orchon Admin</title>
</svelte:head>

<div class="p-6 space-y-8">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-white">Infrastructure Control</h1>
			<p class="text-gray-400 text-sm mt-1">Monitor health and trigger recovery actions</p>
		</div>
		<button
			onclick={() => invalidateAll()}
			class="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors"
		>
			<RefreshCw class="w-4 h-4" />
			Refresh
		</button>
	</div>

	<!-- Flash messages -->
	{#if form?.success}
		<div class="p-4 bg-green-900/30 border border-green-700 rounded-lg text-green-400">
			{form.message || 'Action completed successfully'}
		</div>
	{/if}
	{#if form?.error}
		<div class="p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-400">
			{form.error}
		</div>
	{/if}

	<!-- Database Status -->
	<section class="bg-gray-800/50 rounded-xl p-6">
		<div class="flex items-center gap-3 mb-4">
			<Database class="w-5 h-5 text-gray-400" />
			<h2 class="text-lg font-semibold text-white">Database</h2>
		</div>
		<div class="flex items-center gap-3">
			{#if data.health.database.connected}
				<CheckCircle class="w-6 h-6 text-green-400" />
				<span class="text-green-400 font-medium">Connected</span>
			{:else}
				<XCircle class="w-6 h-6 text-red-400" />
				<span class="text-red-400 font-medium">Disconnected</span>
				{#if data.health.database.message}
					<span class="text-gray-500 text-sm">({data.health.database.message})</span>
				{/if}
			{/if}
		</div>
	</section>

	<!-- Services Health -->
	<section class="bg-gray-800/50 rounded-xl p-6">
		<h2 class="text-lg font-semibold text-white mb-4">Service Health</h2>
		{#if data.health.services.length === 0}
			<p class="text-gray-500">No services to display</p>
		{:else}
			<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.health.services as service}
					<div class="bg-gray-900/50 rounded-lg p-4">
						<div class="flex items-start justify-between">
							<div class="min-w-0">
								<p class="font-medium text-white truncate">{service.id}</p>
								<p class="text-sm text-gray-500 truncate">{service.projectName}</p>
							</div>
							<div class="shrink-0 ml-2">
								{#if service.status === 'healthy'}
									<CheckCircle class="w-5 h-5 text-green-400" />
								{:else if service.status === 'degraded'}
									<AlertTriangle class="w-5 h-5 text-yellow-400" />
								{:else if service.status === 'down'}
									<XCircle class="w-5 h-5 text-red-400" />
								{:else}
									<Clock class="w-5 h-5 text-gray-500" />
								{/if}
							</div>
						</div>
						<div class="mt-2 flex items-center gap-2 text-xs text-gray-500">
							<span class="px-1.5 py-0.5 bg-gray-800 rounded">{service.provider}</span>
							<span>{formatRelativeTime(service.lastChecked)}</span>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>

	<!-- Recovery Actions -->
	<section class="bg-gray-800/50 rounded-xl p-6">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-lg font-semibold text-white">Recovery Actions</h2>
			<button
				onclick={() => (showAddForm = !showAddForm)}
				class="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm text-white transition-colors"
			>
				<Plus class="w-4 h-4" />
				Add Action
			</button>
		</div>

		<!-- Add Action Form -->
		{#if showAddForm}
			<form
				method="POST"
				action="?/createAction"
				use:enhance={() => {
					return async ({ update }) => {
						await update();
						showAddForm = false;
						newAction = { serviceId: '', name: '', actionType: 'fly-api', config: '{}' };
					};
				}}
				class="bg-gray-900/50 rounded-lg p-4 mb-4 space-y-4"
			>
				<div class="grid gap-4 sm:grid-cols-2">
					<div>
						<label class="block text-sm text-gray-400 mb-1">Service ID</label>
						<select
							name="serviceId"
							bind:value={newAction.serviceId}
							required
							class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
						>
							<option value="">Select service...</option>
							{#each serviceIds as id}
								<option value={id}>{id}</option>
							{/each}
						</select>
					</div>
					<div>
						<label class="block text-sm text-gray-400 mb-1">Action Name</label>
						<input
							type="text"
							name="name"
							bind:value={newAction.name}
							required
							placeholder="e.g., Restart Backend"
							class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
						/>
					</div>
				</div>
				<div class="grid gap-4 sm:grid-cols-2">
					<div>
						<label class="block text-sm text-gray-400 mb-1">Action Type</label>
						<select
							name="actionType"
							bind:value={newAction.actionType}
							required
							class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
						>
							<option value="fly-api">Fly.io API</option>
							<option value="github-workflow">GitHub Workflow</option>
							<option value="gcp-api">GCP API</option>
							<option value="ssh-command">SSH Command</option>
						</select>
					</div>
					<div>
						<label class="block text-sm text-gray-400 mb-1">Config (JSON)</label>
						<input
							type="text"
							name="config"
							bind:value={newAction.config}
							required
							placeholder={`{"app": "my-app", "action": "restart"}`}
							class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white font-mono text-sm"
						/>
					</div>
				</div>
				<div class="flex justify-end gap-2">
					<button
						type="button"
						onclick={() => (showAddForm = false)}
						class="px-4 py-2 text-gray-400 hover:text-white transition-colors"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors"
					>
						Create Action
					</button>
				</div>
			</form>
		{/if}

		<!-- Actions List -->
		{#if data.actions.length === 0}
			<p class="text-gray-500">No recovery actions configured</p>
		{:else}
			<div class="space-y-3">
				{#each data.actions as action}
					{@const Icon = getActionIcon(action.actionType)}
					<div class="bg-gray-900/50 rounded-lg p-4 flex items-center justify-between">
						<div class="flex items-center gap-3 min-w-0">
							<div class="p-2 bg-gray-800 rounded-lg">
								<Icon class="w-5 h-5 text-gray-400" />
							</div>
							<div class="min-w-0">
								<p class="font-medium text-white">{action.name}</p>
								<p class="text-sm text-gray-500 truncate">{action.serviceId}</p>
							</div>
						</div>
						<div class="flex items-center gap-2 shrink-0">
							<form method="POST" action="?/execute" use:enhance>
								<input type="hidden" name="actionId" value={action.id} />
								<button
									type="submit"
									class="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-500 rounded-lg text-sm text-white transition-colors"
								>
									<Play class="w-4 h-4" />
									Execute
								</button>
							</form>
							<form method="POST" action="?/deleteAction" use:enhance>
								<input type="hidden" name="actionId" value={action.id} />
								<button
									type="submit"
									class="p-2 text-gray-500 hover:text-red-400 transition-colors"
									title="Delete action"
								>
									<Trash2 class="w-4 h-4" />
								</button>
							</form>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>

	<!-- Execution Log -->
	<section class="bg-gray-800/50 rounded-xl p-6">
		<h2 class="text-lg font-semibold text-white mb-4">Execution Log</h2>
		{#if data.executions.length === 0}
			<p class="text-gray-500">No executions yet</p>
		{:else}
			<div class="space-y-2">
				{#each data.executions as exec}
					<div class="flex items-center gap-4 p-3 bg-gray-900/50 rounded-lg">
						<div class={getStatusColor(exec.status)}>
							{#if exec.status === 'success'}
								<CheckCircle class="w-5 h-5" />
							{:else if exec.status === 'failure'}
								<XCircle class="w-5 h-5" />
							{:else if exec.status === 'running'}
								<RefreshCw class="w-5 h-5 animate-spin" />
							{:else}
								<Clock class="w-5 h-5" />
							{/if}
						</div>
						<div class="flex-1 min-w-0">
							<p class="text-white font-medium truncate">{exec.actionName}</p>
							<p class="text-sm text-gray-500">{exec.serviceId}</p>
						</div>
						<div class="text-right text-sm shrink-0">
							<p class={getStatusColor(exec.status)}>{exec.status}</p>
							<p class="text-gray-500">{formatRelativeTime(exec.startedAt)}</p>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>
</div>
