<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { Eye, EyeOff, Lock } from '@lucide/svelte';

	let { form }: { form: ActionData } = $props();

	let showPassword = $state(false);
	let isLoading = $state(false);
</script>

<div class="min-h-screen bg-gray-900 flex items-center justify-center p-4">
	<div class="w-full max-w-sm">
		<!-- Logo/Title -->
		<div class="text-center mb-8">
			<div class="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full mb-4">
				<Lock class="w-8 h-8 text-blue-400" />
			</div>
			<h1 class="text-2xl font-bold text-white">Infrastructure Observatory</h1>
			<p class="text-gray-500 text-sm mt-1">Enter password to continue</p>
		</div>

		<!-- Login Form -->
		<form
			method="POST"
			use:enhance={() => {
				isLoading = true;
				return async ({ update }) => {
					await update();
					isLoading = false;
				};
			}}
			class="bg-gray-800 rounded-lg p-6 shadow-xl"
		>
			{#if form?.error}
				<div class="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-300 text-sm">
					{form.error}
				</div>
			{/if}

			<div class="mb-4">
				<label for="password" class="block text-sm font-medium text-gray-300 mb-2">
					Password
				</label>
				<div class="relative">
					<input
						type={showPassword ? 'text' : 'password'}
						name="password"
						id="password"
						required
						autocomplete="current-password"
						class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
						placeholder="Enter password"
					/>
					<button
						type="button"
						onclick={() => (showPassword = !showPassword)}
						class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
					>
						{#if showPassword}
							<EyeOff class="w-5 h-5" />
						{:else}
							<Eye class="w-5 h-5" />
						{/if}
					</button>
				</div>
			</div>

			<button
				type="submit"
				disabled={isLoading}
				class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
			>
				{isLoading ? 'Signing in...' : 'Sign In'}
			</button>
		</form>

		<p class="text-center text-gray-600 text-xs mt-6">
			Single-user access only
		</p>
	</div>
</div>
