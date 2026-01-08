<script lang="ts">
	import type { PageData } from './$types';
	import {
		ArrowLeft,
		Check,
		X,
		Server,
		Building2,
		FlaskConical,
		Wrench,
		Archive,
		ExternalLink,
		Globe,
		RefreshCw,
		Save,
		Trash2
	} from '@lucide/svelte';

	let { data }: { data: PageData } = $props();

	// Local state for toggles (persisted to localStorage)
	let toggleOverrides = $state<Record<string, boolean>>({});
	let hasChanges = $state(false);
	let saveMessage = $state<string | null>(null);

	// Load saved overrides from localStorage on mount
	$effect(() => {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('gcp-project-overrides');
			if (saved) {
				try {
					toggleOverrides = JSON.parse(saved);
				} catch {
					toggleOverrides = {};
				}
			}
		}
	});

	// Get effective enabled state (override or default)
	function isEnabled(projectId: string, defaultEnabled: boolean): boolean {
		if (projectId in toggleOverrides) {
			return toggleOverrides[projectId];
		}
		return defaultEnabled;
	}

	// Toggle a project
	function toggleProject(projectId: string, currentDefault: boolean) {
		const currentEffective = isEnabled(projectId, currentDefault);
		toggleOverrides[projectId] = !currentEffective;
		hasChanges = true;
	}

	// Save changes to localStorage
	function saveChanges() {
		if (typeof window !== 'undefined') {
			localStorage.setItem('gcp-project-overrides', JSON.stringify(toggleOverrides));
			hasChanges = false;
			saveMessage = 'Changes saved! Refresh the Infrastructure Map to see updates.';
			setTimeout(() => saveMessage = null, 5000);
		}
	}

	// Reset all overrides
	function resetToDefaults() {
		toggleOverrides = {};
		if (typeof window !== 'undefined') {
			localStorage.removeItem('gcp-project-overrides');
		}
		hasChanges = false;
		saveMessage = 'Reset to config defaults.';
		setTimeout(() => saveMessage = null, 3000);
	}

	// Count enabled in a group
	function countEnabled(projects: typeof data.projects): number {
		return projects.filter(p => isEnabled(p.projectId, p.enabled)).length;
	}

	// Enable/disable all in a group
	function setGroupEnabled(projects: typeof data.projects, enabled: boolean) {
		for (const p of projects) {
			toggleOverrides[p.projectId] = enabled;
		}
		hasChanges = true;
	}

	// Get icon for type
	function getTypeIcon(type: string) {
		switch (type) {
			case 'campus': return Server;
			case 'org-portal': return Building2;
			case 'testing': return FlaskConical;
			case 'infrastructure': return Wrench;
			default: return Archive;
		}
	}

	// Get color for type
	function getTypeColor(type: string): string {
		switch (type) {
			case 'campus': return 'text-blue-400';
			case 'org-portal': return 'text-emerald-400';
			case 'testing': return 'text-amber-400';
			case 'infrastructure': return 'text-purple-400';
			default: return 'text-gray-500';
		}
	}

	// Open GCP Console for a project
	function openGcpConsole(projectId: string) {
		window.open(`https://console.cloud.google.com/home/dashboard?project=${projectId}`, '_blank');
	}
</script>

<svelte:head>
	<title>Infrastructure Settings | Orchon</title>
</svelte:head>

<div class="min-h-screen bg-gray-950 text-gray-100">
	<!-- Header -->
	<div class="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
		<div class="max-w-6xl mx-auto px-4 py-3">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-4">
					<a href="/infrastructure/map" class="p-2 hover:bg-gray-800 rounded-lg transition-colors">
						<ArrowLeft class="w-5 h-5" />
					</a>
					<div>
						<h1 class="text-lg font-semibold">Infrastructure Settings</h1>
						<p class="text-xs text-gray-500">Manage GCP projects visibility in the infrastructure map</p>
					</div>
				</div>
				<div class="flex items-center gap-3">
					{#if saveMessage}
						<span class="text-sm text-emerald-400">{saveMessage}</span>
					{/if}
					{#if hasChanges}
						<button
							onclick={resetToDefaults}
							class="px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
						>
							<RefreshCw class="w-4 h-4" />
							Reset
						</button>
						<button
							onclick={saveChanges}
							class="px-4 py-1.5 text-sm bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-2 font-medium"
						>
							<Save class="w-4 h-4" />
							Save Changes
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- Stats Bar -->
	<div class="bg-gray-900/50 border-b border-gray-800">
		<div class="max-w-6xl mx-auto px-4 py-3">
			<div class="flex items-center gap-6 text-sm">
				<div class="flex items-center gap-2">
					<span class="text-gray-500">Total:</span>
					<span class="font-medium">{data.stats.total}</span>
				</div>
				<div class="flex items-center gap-2">
					<span class="text-gray-500">Enabled:</span>
					<span class="font-medium text-emerald-400">
						{Object.values(toggleOverrides).filter(v => v).length + data.projects.filter(p => !(p.projectId in toggleOverrides) && p.enabled).length}
					</span>
				</div>
				<div class="w-px h-4 bg-gray-700"></div>
				<div class="flex items-center gap-1.5">
					<Server class="w-3.5 h-3.5 text-blue-400" />
					<span class="text-gray-400">{data.stats.campuses}</span>
				</div>
				<div class="flex items-center gap-1.5">
					<Building2 class="w-3.5 h-3.5 text-emerald-400" />
					<span class="text-gray-400">{data.stats.orgPortals}</span>
				</div>
				<div class="flex items-center gap-1.5">
					<FlaskConical class="w-3.5 h-3.5 text-amber-400" />
					<span class="text-gray-400">{data.stats.testing}</span>
				</div>
				<div class="flex items-center gap-1.5">
					<Wrench class="w-3.5 h-3.5 text-purple-400" />
					<span class="text-gray-400">{data.stats.infrastructure}</span>
				</div>
				<div class="flex items-center gap-1.5">
					<Archive class="w-3.5 h-3.5 text-gray-500" />
					<span class="text-gray-400">{data.stats.other}</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Content -->
	<div class="max-w-6xl mx-auto px-4 py-6 space-y-6">
		{#each data.groupedProjects as group (group.type)}
			{@const TypeIcon = getTypeIcon(group.type)}
			{@const typeColor = getTypeColor(group.type)}
			{@const enabledCount = countEnabled(group.projects)}

			<div class="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
				<!-- Group Header -->
				<div class="px-4 py-3 bg-gray-800/50 border-b border-gray-800 flex items-center justify-between">
					<div class="flex items-center gap-3">
						<TypeIcon class="w-5 h-5 {typeColor}" />
						<span class="font-medium">{group.displayType}</span>
						<span class="text-sm text-gray-500">
							({enabledCount}/{group.projects.length} enabled)
						</span>
					</div>
					<div class="flex items-center gap-2">
						<button
							onclick={() => setGroupEnabled(group.projects, true)}
							class="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
						>
							Enable All
						</button>
						<button
							onclick={() => setGroupEnabled(group.projects, false)}
							class="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
						>
							Disable All
						</button>
					</div>
				</div>

				<!-- Projects Table -->
				<div class="divide-y divide-gray-800">
					{#each group.projects as project (project.projectId)}
						{@const enabled = isEnabled(project.projectId, project.enabled)}
						{@const isOverridden = project.projectId in toggleOverrides}

						<div class="px-4 py-3 flex items-center gap-4 hover:bg-gray-800/30 transition-colors {!enabled ? 'opacity-50' : ''}">
							<!-- Toggle -->
							<button
								onclick={() => toggleProject(project.projectId, project.enabled)}
								class="w-10 h-6 rounded-full transition-colors relative {enabled ? 'bg-emerald-600' : 'bg-gray-700'}"
							>
								<span
									class="absolute top-1 w-4 h-4 rounded-full bg-white transition-all {enabled ? 'left-5' : 'left-1'}"
								></span>
							</button>

							<!-- Project Info -->
							<div class="flex-1 min-w-0">
								<div class="flex items-center gap-2">
									<span class="font-medium text-sm truncate">{project.displayName}</span>
									{#if isOverridden}
										<span class="px-1.5 py-0.5 text-[10px] bg-amber-500/20 text-amber-400 rounded">
											modified
										</span>
									{/if}
								</div>
								<div class="text-xs text-gray-500 font-mono truncate">{project.projectId}</div>
							</div>

							<!-- Custom Domain -->
							<div class="w-64 text-sm">
								{#if project.customDomain}
									<a
										href="https://{project.customDomain}"
										target="_blank"
										rel="noopener noreferrer"
										class="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 truncate group"
									>
										<Globe class="w-3.5 h-3.5 shrink-0" />
										<span class="truncate">{project.customDomain}</span>
										<ExternalLink class="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100" />
									</a>
								{:else}
									<span class="text-gray-600">No custom domain</span>
								{/if}
							</div>

							<!-- Actions -->
							<div class="flex items-center gap-2">
								<button
									onclick={() => openGcpConsole(project.projectId)}
									class="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
									title="Open GCP Console"
								>
									<ExternalLink class="w-4 h-4" />
								</button>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/each}

		<!-- Help Section -->
		<div class="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
			<h3 class="font-medium mb-2">How this works</h3>
			<ul class="text-sm text-gray-400 space-y-1">
				<li>Toggle projects to show/hide them in the Infrastructure Map's Ownership view</li>
				<li>Changes are saved to your browser's localStorage</li>
				<li>Click the external link icon to open the project in GCP Console</li>
				<li>Projects marked "Old / Deprecated" are safe to delete from GCP if unused</li>
			</ul>
		</div>
	</div>
</div>
