<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import {
		ArrowLeft,
		Upload,
		Trash2,
		Image,
		Layers,
		Code,
		Server,
		LogOut,
		Check,
		X
	} from '@lucide/svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let uploadType = $state<'infra' | 'techstack'>('infra');
	let selectedFile = $state<File | null>(null);
	let isUploading = $state(false);

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			selectedFile = input.files[0];
		}
	}
</script>

<div class="min-h-screen bg-gray-900 text-white">
	<!-- Header -->
	<header class="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
		<div class="flex items-center gap-4">
			<a
				href="/"
				class="p-2 -m-2 text-gray-400 hover:text-gray-200 transition-colors"
				title="Back to Dashboard"
			>
				<ArrowLeft class="w-5 h-5" />
			</a>
			<div>
				<h1 class="text-lg font-semibold text-gray-100">Settings</h1>
				<p class="text-xs text-gray-500">Manage logos, appearance, and account</p>
			</div>
		</div>
		<form method="POST" action="/logout">
			<button
				type="submit"
				class="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-red-400 transition-colors"
			>
				<LogOut class="w-4 h-4" />
				<span>Logout</span>
			</button>
		</form>
	</header>

	<!-- Main Content -->
	<main class="max-w-4xl mx-auto p-6 space-y-8">
		<!-- Success/Error Messages -->
		{#if form?.success}
			<div class="p-4 bg-green-900/50 border border-green-700 rounded-lg flex items-center gap-3">
				<Check class="w-5 h-5 text-green-400" />
				<span class="text-green-300">{form.message}</span>
			</div>
		{/if}
		{#if form?.error}
			<div class="p-4 bg-red-900/50 border border-red-700 rounded-lg flex items-center gap-3">
				<X class="w-5 h-5 text-red-400" />
				<span class="text-red-300">{form.error}</span>
			</div>
		{/if}

		<!-- Logo Upload Section -->
		<section class="bg-gray-800 rounded-lg p-6">
			<h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
				<Image class="w-5 h-5 text-blue-400" />
				Upload Logos
			</h2>
			<p class="text-gray-400 text-sm mb-6">
				Upload SVG or PNG logos for services. They'll be automatically categorized based on the
				filename (e.g., "sentry.svg" for monitoring, "tailwind.svg" for tech stack).
			</p>

			<!-- Upload Type Toggle -->
			<div class="flex gap-2 mb-4">
				<button
					type="button"
					onclick={() => (uploadType = 'infra')}
					class="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors {uploadType ===
					'infra'
						? 'bg-blue-600 text-white'
						: 'bg-gray-700 text-gray-300 hover:bg-gray-600'}"
				>
					<Server class="w-4 h-4" />
					Infrastructure Flow
				</button>
				<button
					type="button"
					onclick={() => (uploadType = 'techstack')}
					class="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors {uploadType ===
					'techstack'
						? 'bg-blue-600 text-white'
						: 'bg-gray-700 text-gray-300 hover:bg-gray-600'}"
				>
					<Code class="w-4 h-4" />
					Tech Stack
				</button>
			</div>

			<!-- Upload Form -->
			<form
				method="POST"
				action="?/uploadLogo"
				enctype="multipart/form-data"
				use:enhance={() => {
					isUploading = true;
					return async ({ update }) => {
						await update();
						isUploading = false;
						selectedFile = null;
					};
				}}
			>
				<input type="hidden" name="type" value={uploadType} />

				<div
					class="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors"
				>
					<input
						type="file"
						name="logo"
						accept=".svg,.png"
						onchange={handleFileSelect}
						class="hidden"
						id="logo-upload"
					/>
					<label for="logo-upload" class="cursor-pointer">
						<Upload class="w-12 h-12 mx-auto text-gray-500 mb-4" />
						{#if selectedFile}
							<p class="text-white font-medium">{selectedFile.name}</p>
							<p class="text-gray-500 text-sm mt-1">Click to change or drop a new file</p>
						{:else}
							<p class="text-gray-300">Click to upload or drag and drop</p>
							<p class="text-gray-500 text-sm mt-1">SVG or PNG (max 1MB)</p>
						{/if}
					</label>
				</div>

				{#if selectedFile}
					<div class="mt-4 flex justify-end">
						<button
							type="submit"
							disabled={isUploading}
							class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed rounded-lg transition-colors"
						>
							<Upload class="w-4 h-4" />
							{isUploading ? 'Uploading...' : 'Upload Logo'}
						</button>
					</div>
				{/if}
			</form>
		</section>

		<!-- Existing Logos Section -->
		<section class="bg-gray-800 rounded-lg p-6">
			<h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
				<Layers class="w-5 h-5 text-purple-400" />
				Existing Logos
			</h2>

			{#if data.logos && data.logos.length > 0}
				<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
					{#each data.logos as logo}
						<div class="bg-gray-700 rounded-lg p-4 flex flex-col items-center gap-2 group relative">
							<img src={logo.url} alt={logo.name} class="w-12 h-12 object-contain" />
							<span class="text-sm text-gray-300 truncate max-w-full">{logo.name}</span>
							<span
								class="text-xs px-2 py-0.5 rounded {logo.type === 'infra'
									? 'bg-blue-900 text-blue-300'
									: 'bg-purple-900 text-purple-300'}"
							>
								{logo.type === 'infra' ? 'Infrastructure' : 'Tech Stack'}
							</span>
							<form method="POST" action="?/deleteLogo" class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
								<input type="hidden" name="logoId" value={logo.id} />
								<button
									type="submit"
									class="p-1 bg-red-600 hover:bg-red-700 rounded text-white"
									title="Delete logo"
								>
									<Trash2 class="w-3 h-3" />
								</button>
							</form>
						</div>
					{/each}
				</div>
			{:else}
				<div class="text-center py-8 text-gray-500">
					<Image class="w-12 h-12 mx-auto mb-3 opacity-50" />
					<p>No logos uploaded yet</p>
					<p class="text-sm">Upload logos above to see them here</p>
				</div>
			{/if}
		</section>

		<!-- Account Section -->
		<section class="bg-gray-800 rounded-lg p-6">
			<h2 class="text-lg font-semibold mb-4">Account</h2>
			<p class="text-gray-400 text-sm mb-4">Single-user access. Password can be changed via environment variable.</p>
			<form method="POST" action="/logout">
				<button
					type="submit"
					class="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
				>
					<LogOut class="w-4 h-4" />
					Sign Out
				</button>
			</form>
		</section>
	</main>
</div>
