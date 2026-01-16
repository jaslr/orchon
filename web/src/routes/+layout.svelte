<script lang="ts">
	import '../app.css';
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { Settings } from '@lucide/svelte';
	import MainNav from '$lib/components/MainNav.svelte';

	let { children, data } = $props();

	// User menu dropdown state
	let showUserMenu = $state(false);

	// Register service worker for PWA
	$effect(() => {
		if (browser && 'serviceWorker' in navigator) {
			navigator.serviceWorker
				.register('/sw.js')
				.then((reg) => console.log('[SW] Registered:', reg.scope))
				.catch((err) => console.error('[SW] Registration failed:', err));
		}
	});

	// Close user menu when clicking outside
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as Element;
		if (showUserMenu && !target.closest('.user-menu')) {
			showUserMenu = false;
		}
	}

	$effect(() => {
		if (!browser) return;
		if (showUserMenu) {
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		}
	});

	// Check if we're on login route (it has its own layout)
	let isLoginRoute = $derived(page.url.pathname === '/login');
</script>

<svelte:head>
	<title>Orchon</title>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
	<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
</svelte:head>

{#if isLoginRoute}
	<!-- Login page uses its own layout -->
	{@render children()}
{:else}
	<!-- Main app layout with shared header and nav -->
	<div class="min-h-screen bg-gray-900 text-white flex flex-col">
		<!-- Header -->
		<header class="shrink-0 px-4 py-3 border-b border-gray-800">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<a href="/" class="flex items-center gap-3">
						<img src="/logo.svg" alt="Orchon logo" class="w-8 h-8 text-gray-200" />
						<h1 class="text-lg font-semibold text-gray-100" style="font-family: 'Roboto', sans-serif;">Orchon</h1>
					</a>
				</div>
				<!-- Right side: User menu -->
				<div class="relative user-menu">
					<button
						onclick={() => showUserMenu = !showUserMenu}
						class="p-2 -m-2 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
						title="Menu"
					>
						<Settings class="w-5 h-5" />
					</button>
					{#if showUserMenu}
						<div class="absolute right-0 top-full mt-2 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden z-50">
							<div class="px-3 py-2 border-b border-gray-700 text-xs text-gray-400">
								Logged in
							</div>
							<a
								href="/admin"
								class="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
								onclick={() => showUserMenu = false}
							>
								Settings
							</a>
							<button
								class="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors cursor-pointer"
								onclick={() => showUserMenu = false}
							>
								Logout
							</button>
						</div>
					{/if}
				</div>
			</div>
		</header>

		<!-- Main Content -->
		<div class="flex-1 flex flex-col lg:flex-row min-h-0">
			<!-- Left Sidebar - Navigation (hidden on small, shown on lg+) -->
			<aside class="hidden lg:flex lg:flex-col w-[12rem] shrink-0 border-r border-gray-800 bg-gray-900">
				<MainNav />
			</aside>

			<!-- Mobile Navigation (shown on small, hidden on lg+) -->
			<div class="lg:hidden border-b border-gray-800 bg-gray-900">
				<div class="flex">
					<a
						href="/"
						class="flex-1 py-2 text-center text-sm {page.url.pathname === '/' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}"
					>Console</a>
					<a
						href="/projects"
						class="flex-1 py-2 text-center text-sm {page.url.pathname.startsWith('/projects') ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}"
					>Projects</a>
					<a
						href="/deployments"
						class="flex-1 py-2 text-center text-sm {page.url.pathname.startsWith('/deployments') ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}"
					>Deploys</a>
					<a
						href="/admin/infra"
						class="flex-1 py-2 text-center text-sm {page.url.pathname.startsWith('/admin/infra') ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}"
					>Infra</a>
				</div>
			</div>

			<!-- Page Content -->
			<main class="flex-1 flex flex-col overflow-hidden min-w-0">
				{@render children()}
			</main>
		</div>
	</div>
{/if}
