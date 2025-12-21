<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import {
		ArrowLeft,
		RefreshCw,
		FileCode,
		Package,
		Check,
		X,
		ExternalLink,
		Loader2
	} from '@lucide/svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let scanning = $state<string | null>(null);

	// Find the selected project from data
	let selectedProjectData = $derived(
		data.selectedProject
			? data.projects.find((p) => p.repo === data.selectedProject)
			: null
	);

	// Use form data if available (after scan), otherwise use loaded data
	let displayStack = $derived(
		form?.success && form.repo === data.selectedProject
			? form.detectedStack
			: selectedProjectData?.detectedStack
	);

	let displayPackageJson = $derived(
		form?.success && form.repo === data.selectedProject
			? form.packageJson
			: selectedProjectData?.packageJson
	);
</script>

<div class="min-h-screen bg-gray-900 text-white">
	<!-- Header -->
	<header class="px-6 py-4 border-b border-gray-800">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-4">
				<a href="/" class="text-gray-400 hover:text-white transition-colors">
					<ArrowLeft class="w-5 h-5" />
				</a>
				<h1 class="text-xl font-semibold">Repository Configuration</h1>
			</div>
			{#if data.selectedProject}
				<a
					href="/?project={data.selectedProject}"
					class="text-sm text-gray-400 hover:text-white flex items-center gap-1"
				>
					Back to {data.selectedProject}
					<ExternalLink class="w-3 h-3" />
				</a>
			{/if}
		</div>
	</header>

	<div class="flex">
		<!-- Sidebar: Project List -->
		<aside class="w-64 border-r border-gray-800 min-h-[calc(100vh-65px)]">
			<div class="p-4">
				<h2 class="text-xs uppercase tracking-wider text-gray-500 mb-3">Projects</h2>
				<nav class="space-y-1">
					{#each data.projects as project}
						<a
							href="/admin/repos?project={project.repo}"
							class="block px-3 py-2 rounded text-sm transition-colors {data.selectedProject === project.repo
								? 'bg-blue-600 text-white'
								: 'text-gray-400 hover:bg-gray-800 hover:text-white'}"
						>
							<div class="flex items-center justify-between">
								<span class="truncate">{project.repo}</span>
								{#if project.infraConfig}
									<Check class="w-3 h-3 text-green-400 shrink-0" />
								{:else}
									<X class="w-3 h-3 text-gray-600 shrink-0" />
								{/if}
							</div>
							<div class="text-xs text-gray-500">{project.owner}</div>
						</a>
					{/each}
				</nav>
			</div>
		</aside>

		<!-- Main Content -->
		<main class="flex-1 p-6">
			{#if data.selectedProject && selectedProjectData}
				<div class="max-w-3xl">
					<div class="flex items-center justify-between mb-6">
						<div>
							<h2 class="text-2xl font-bold">{data.selectedProject}</h2>
							<p class="text-gray-400">{selectedProjectData.owner}/{selectedProjectData.repo}</p>
						</div>

						<!-- Scan Button -->
						<form
							method="POST"
							action="?/scanRepo"
							use:enhance={() => {
								scanning = selectedProjectData?.repo ?? null;
								return async ({ update }) => {
									await update();
									scanning = null;
								};
							}}
						>
							<input type="hidden" name="owner" value={selectedProjectData.owner} />
							<input type="hidden" name="repo" value={selectedProjectData.repo} />
							<button
								type="submit"
								disabled={scanning === selectedProjectData.repo}
								class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded text-sm transition-colors"
							>
								{#if scanning === selectedProjectData.repo}
									<Loader2 class="w-4 h-4 animate-spin" />
									<span>Scanning...</span>
								{:else}
									<RefreshCw class="w-4 h-4" />
									<span>Scan package.json</span>
								{/if}
							</button>
						</form>
					</div>

					{#if form?.error}
						<div class="mb-6 p-4 bg-red-900/30 border border-red-800 rounded text-red-300">
							{form.error}
						</div>
					{/if}

					<div class="grid gap-6">
						<!-- Current Config -->
						<div class="bg-gray-800 rounded-lg p-6">
							<div class="flex items-center gap-2 mb-4">
								<FileCode class="w-5 h-5 text-gray-400" />
								<h3 class="text-lg font-semibold">Current Configuration</h3>
							</div>

							{#if selectedProjectData.infraConfig}
								<div class="space-y-4">
									<div>
										<label class="text-xs text-gray-500 uppercase">Display Name</label>
										<p class="text-white">{selectedProjectData.infraConfig.displayName}</p>
									</div>

									<div>
										<label class="text-xs text-gray-500 uppercase">Tech Stack</label>
										<div class="flex flex-wrap gap-2 mt-1">
											{#if selectedProjectData.infraConfig.stack.framework}
												<span class="px-2 py-1 bg-purple-900/50 text-purple-300 text-xs rounded">
													{selectedProjectData.infraConfig.stack.framework}
												</span>
											{/if}
											{#if selectedProjectData.infraConfig.stack.language}
												<span class="px-2 py-1 bg-blue-900/50 text-blue-300 text-xs rounded">
													{selectedProjectData.infraConfig.stack.language}
												</span>
											{/if}
											{#each selectedProjectData.infraConfig.stack.css || [] as css}
												<span class="px-2 py-1 bg-cyan-900/50 text-cyan-300 text-xs rounded">
													{css}
												</span>
											{/each}
											{#each selectedProjectData.infraConfig.stack.testing || [] as test}
												<span class="px-2 py-1 bg-green-900/50 text-green-300 text-xs rounded">
													{test}
												</span>
											{/each}
											{#if selectedProjectData.infraConfig.stack.buildTool}
												<span class="px-2 py-1 bg-orange-900/50 text-orange-300 text-xs rounded">
													{selectedProjectData.infraConfig.stack.buildTool}
												</span>
											{/if}
										</div>
									</div>

									<div>
										<label class="text-xs text-gray-500 uppercase">Services ({selectedProjectData.infraConfig.services.length})</label>
										<div class="mt-1 space-y-1">
											{#each selectedProjectData.infraConfig.services as service}
												<div class="flex items-center gap-2 text-sm text-gray-300">
													<span class="w-20 text-gray-500">{service.category}</span>
													<span>{service.provider}</span>
													<span class="text-gray-500">-</span>
													<span>{service.serviceName}</span>
												</div>
											{/each}
										</div>
									</div>
								</div>
							{:else}
								<p class="text-gray-500">No configuration found in infrastructure.ts</p>
								<p class="text-sm text-gray-600 mt-2">
									Add this project to <code class="bg-gray-700 px-1 rounded">{data.configFilePath}</code>
								</p>
							{/if}
						</div>

						<!-- Detected from package.json -->
						{#if displayStack}
							<div class="bg-gray-800 rounded-lg p-6">
								<div class="flex items-center gap-2 mb-4">
									<Package class="w-5 h-5 text-gray-400" />
									<h3 class="text-lg font-semibold">Detected from package.json</h3>
								</div>

								<div class="space-y-4">
									<div>
										<label class="text-xs text-gray-500 uppercase">Detected Stack</label>
										<div class="flex flex-wrap gap-2 mt-1">
											{#if displayStack.framework}
												<span class="px-2 py-1 bg-purple-900/50 text-purple-300 text-xs rounded">
													{displayStack.framework}
												</span>
											{/if}
											<span class="px-2 py-1 bg-blue-900/50 text-blue-300 text-xs rounded">
												{displayStack.language}
											</span>
											{#each displayStack.css as css}
												<span class="px-2 py-1 bg-cyan-900/50 text-cyan-300 text-xs rounded">
													{css}
												</span>
											{/each}
											{#each displayStack.testing as test}
												<span class="px-2 py-1 bg-green-900/50 text-green-300 text-xs rounded">
													{test}
												</span>
											{/each}
											{#if displayStack.buildTool}
												<span class="px-2 py-1 bg-orange-900/50 text-orange-300 text-xs rounded">
													{displayStack.buildTool}
												</span>
											{/if}
											{#if displayStack.icons}
												<span class="px-2 py-1 bg-pink-900/50 text-pink-300 text-xs rounded">
													{displayStack.icons}
												</span>
											{/if}
										</div>
									</div>

									{#if displayPackageJson}
										<div>
											<label class="text-xs text-gray-500 uppercase">Dependencies</label>
											<div class="mt-1 text-xs text-gray-400 max-h-48 overflow-auto bg-gray-900 p-2 rounded">
												{#each Object.entries(displayPackageJson.dependencies || {}) as [name, version]}
													<div>{name}: {version}</div>
												{/each}
											</div>
										</div>
									{/if}
								</div>
							</div>
						{:else if !selectedProjectData.infraConfig}
							<div class="bg-gray-800 rounded-lg p-6">
								<div class="flex items-center gap-2 mb-4">
									<Package class="w-5 h-5 text-gray-400" />
									<h3 class="text-lg font-semibold">Auto-detect Tech Stack</h3>
								</div>
								<p class="text-gray-400 text-sm">
									Click "Scan package.json" to automatically detect the tech stack for this project.
								</p>
							</div>
						{/if}

						<!-- Config Files Info -->
						<div class="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
							<h3 class="text-sm font-semibold text-gray-400 mb-3">Configuration Files</h3>
							<div class="space-y-2 text-sm">
								<div class="flex items-center justify-between">
									<span class="text-gray-500">Infrastructure Config:</span>
									<code class="text-gray-300 bg-gray-700 px-2 py-0.5 rounded">{data.configFilePath}</code>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-gray-500">Repos List:</span>
									<code class="text-gray-300 bg-gray-700 px-2 py-0.5 rounded">{data.reposFilePath}</code>
								</div>
							</div>
							<p class="mt-4 text-xs text-gray-500">
								Edit these files directly to update project configuration. Auto-save coming soon.
							</p>
						</div>
					</div>
				</div>
			{:else}
				<div class="flex items-center justify-center h-64 text-gray-500">
					Select a project from the sidebar to view its configuration
				</div>
			{/if}
		</main>
	</div>
</div>
