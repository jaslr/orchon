// Curated list of repos to monitor
// Format: { owner: [repo1, repo2, ...] }
export const repos: Record<string, string[]> = {
	jaslr: [
		// Add your jaslr repos here
		// Example: 'ci-monitor'
	],
	'jvp-ux': [
		// Add your jvp-ux repos here
		// Example: 'vastpuddle.com.au'
	]
};

// Map owners to their environment variable names for PATs
export const ownerPATEnvVar: Record<string, string> = {
	jaslr: 'GITHUB_PAT_JASLR',
	'jvp-ux': 'GITHUB_PAT_JVP_UX'
};
