import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { repos, ownerPATEnvVar } from '$lib/config/repos';
import { INFRASTRUCTURE } from '$lib/config/infrastructure';
import { env } from '$env/dynamic/private';

const BACKEND_URL = 'https://observatory-backend.fly.dev';

interface PackageJson {
	name?: string;
	version?: string;
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
	scripts?: Record<string, string>;
}

interface DetectedStack {
	framework: string | null;
	language: string;
	css: string[];
	testing: string[];
	buildTool: string | null;
	packageManager: string;
	icons: string | null;
}

// Detect tech stack from package.json dependencies
function detectTechStack(pkg: PackageJson): DetectedStack {
	const deps = { ...pkg.dependencies, ...pkg.devDependencies };
	const depNames = Object.keys(deps);

	const stack: DetectedStack = {
		framework: null,
		language: 'javascript',
		css: [],
		testing: [],
		buildTool: null,
		packageManager: 'npm',
		icons: null
	};

	// Detect TypeScript
	if (depNames.includes('typescript') || depNames.includes('@types/node')) {
		stack.language = 'typescript';
	}

	// Detect framework
	if (depNames.includes('@sveltejs/kit')) stack.framework = 'sveltekit';
	else if (depNames.includes('svelte')) stack.framework = 'svelte';
	else if (depNames.includes('next')) stack.framework = 'next';
	else if (depNames.includes('nuxt')) stack.framework = 'nuxt';
	else if (depNames.includes('@angular/core')) stack.framework = 'angular';
	else if (depNames.includes('react')) stack.framework = 'react';
	else if (depNames.includes('vue')) stack.framework = 'vue';
	else if (depNames.includes('express')) stack.framework = 'express';
	else if (depNames.includes('hono')) stack.framework = 'hono';
	else if (depNames.includes('fastify')) stack.framework = 'fastify';

	// Detect CSS
	if (depNames.includes('tailwindcss')) stack.css.push('tailwind');
	if (depNames.includes('@skeletonlabs/skeleton')) stack.css.push('skeleton');
	if (depNames.includes('sass') || depNames.includes('node-sass')) stack.css.push('sass');
	if (depNames.includes('styled-components')) stack.css.push('styled-components');

	// Detect testing
	if (depNames.includes('@playwright/test') || depNames.includes('playwright')) stack.testing.push('playwright');
	if (depNames.includes('vitest')) stack.testing.push('vitest');
	if (depNames.includes('jest')) stack.testing.push('jest');
	if (depNames.includes('cypress')) stack.testing.push('cypress');

	// Detect build tool
	if (depNames.includes('vite')) stack.buildTool = 'vite';
	else if (depNames.includes('webpack')) stack.buildTool = 'webpack';
	else if (depNames.includes('esbuild')) stack.buildTool = 'esbuild';
	else if (depNames.includes('rollup')) stack.buildTool = 'rollup';

	// Detect icons
	if (depNames.includes('lucide-svelte') || depNames.includes('@lucide/svelte')) stack.icons = 'lucide';
	else if (depNames.includes('@heroicons/react') || depNames.includes('heroicons')) stack.icons = 'heroicons';
	else if (depNames.includes('@fortawesome/fontawesome-free')) stack.icons = 'fontawesome';

	return stack;
}

// Fetch package.json from GitHub repo
async function fetchPackageJson(owner: string, repo: string, pat: string): Promise<PackageJson | null> {
	try {
		const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/package.json`, {
			headers: {
				'Authorization': `Bearer ${pat}`,
				'Accept': 'application/vnd.github.v3.raw',
				'User-Agent': 'ci-monitor'
			}
		});

		if (!response.ok) {
			console.warn(`Failed to fetch package.json for ${owner}/${repo}: ${response.status}`);
			return null;
		}

		return await response.json();
	} catch (err) {
		console.warn(`Error fetching package.json for ${owner}/${repo}:`, err);
		return null;
	}
}

export const load: PageServerLoad = async ({ url }) => {
	const selectedProject = url.searchParams.get('project');

	// Get all repos with their infrastructure config
	const projects: Array<{
		owner: string;
		repo: string;
		infraConfig: typeof INFRASTRUCTURE[string] | null;
		detectedStack: DetectedStack | null;
		packageJson: PackageJson | null;
	}> = [];

	for (const [owner, repoList] of Object.entries(repos)) {
		const patEnvVar = ownerPATEnvVar[owner];
		const pat = env[patEnvVar];

		for (const repo of repoList) {
			const infraConfig = INFRASTRUCTURE[repo] || null;
			let packageJson: PackageJson | null = null;
			let detectedStack: DetectedStack | null = null;

			// Only fetch package.json for the selected project to avoid rate limits
			if (pat && (selectedProject === repo || !selectedProject)) {
				// For now, only fetch for selected project to keep things fast
				if (selectedProject === repo) {
					packageJson = await fetchPackageJson(owner, repo, pat);
					if (packageJson) {
						detectedStack = detectTechStack(packageJson);
					}
				}
			}

			projects.push({
				owner,
				repo,
				infraConfig,
				detectedStack,
				packageJson
			});
		}
	}

	return {
		projects,
		selectedProject,
		configFilePath: 'src/lib/config/infrastructure.ts',
		reposFilePath: 'src/lib/config/repos.ts'
	};
};

export const actions: Actions = {
	// Scan a specific repo's package.json
	scanRepo: async ({ request }) => {
		const formData = await request.formData();
		const owner = formData.get('owner') as string;
		const repo = formData.get('repo') as string;

		if (!owner || !repo) {
			return fail(400, { error: 'Missing owner or repo' });
		}

		const patEnvVar = ownerPATEnvVar[owner];
		const pat = env[patEnvVar];

		if (!pat) {
			return fail(400, { error: `No PAT configured for ${owner}` });
		}

		const packageJson = await fetchPackageJson(owner, repo, pat);
		if (!packageJson) {
			return fail(404, { error: `Could not fetch package.json for ${owner}/${repo}` });
		}

		const detectedStack = detectTechStack(packageJson);

		return {
			success: true,
			repo,
			detectedStack,
			packageJson
		};
	}
};
