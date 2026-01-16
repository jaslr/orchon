import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Read package.json at build time for injection
const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'));
const packageInfo = {
	name: pkg.name,
	version: pkg.version,
	description: pkg.description || '',
	dependencyCount: Object.keys(pkg.dependencies || {}).length,
	devDependencyCount: Object.keys(pkg.devDependencies || {}).length,
	keyPackages: ['svelte', '@sveltejs/kit', 'tailwindcss', 'd3-force', 'pixi.js', 'vite', 'typescript', '@lucide/svelte']
		.filter(p => pkg.dependencies?.[p] || pkg.devDependencies?.[p])
};

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],
	define: {
		__PACKAGE_INFO__: JSON.stringify(packageInfo)
	}
});
