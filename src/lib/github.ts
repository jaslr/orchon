export type WorkflowStatus = 'success' | 'failure' | 'in_progress' | 'unknown';

export interface RepoStatus {
	owner: string;
	repo: string;
	status: WorkflowStatus;
	conclusion: string | null;
	html_url: string | null;
	workflow_name: string | null;
}

interface WorkflowRun {
	status: string;
	conclusion: string | null;
	html_url: string;
	name: string;
}

interface WorkflowRunsResponse {
	workflow_runs: WorkflowRun[];
}

export async function getLatestWorkflowRun(
	owner: string,
	repo: string,
	pat: string
): Promise<RepoStatus> {
	const url = `https://api.github.com/repos/${owner}/${repo}/actions/runs?per_page=1`;

	try {
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${pat}`,
				Accept: 'application/vnd.github.v3+json',
				'User-Agent': 'ci-monitor'
			}
		});

		if (!response.ok) {
			console.error(`GitHub API error for ${owner}/${repo}: ${response.status}`);
			return {
				owner,
				repo,
				status: 'unknown',
				conclusion: null,
				html_url: `https://github.com/${owner}/${repo}/actions`,
				workflow_name: null
			};
		}

		const data: WorkflowRunsResponse = await response.json();

		if (!data.workflow_runs || data.workflow_runs.length === 0) {
			return {
				owner,
				repo,
				status: 'unknown',
				conclusion: null,
				html_url: `https://github.com/${owner}/${repo}/actions`,
				workflow_name: null
			};
		}

		const latestRun = data.workflow_runs[0];
		let status: WorkflowStatus;

		if (latestRun.status === 'in_progress' || latestRun.status === 'queued') {
			status = 'in_progress';
		} else if (latestRun.conclusion === 'success') {
			status = 'success';
		} else if (latestRun.conclusion === 'failure' || latestRun.conclusion === 'cancelled') {
			status = 'failure';
		} else {
			status = 'unknown';
		}

		return {
			owner,
			repo,
			status,
			conclusion: latestRun.conclusion,
			html_url: latestRun.html_url,
			workflow_name: latestRun.name
		};
	} catch (error) {
		console.error(`Error fetching workflow for ${owner}/${repo}:`, error);
		return {
			owner,
			repo,
			status: 'unknown',
			conclusion: null,
			html_url: `https://github.com/${owner}/${repo}/actions`,
			workflow_name: null
		};
	}
}
