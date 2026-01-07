import { env } from '../../config/env.js';

interface GitHubWorkflowConfig {
  owner: string;
  repo: string;
  workflow: string;
  ref?: string;
  inputs?: Record<string, string>;
}

export async function executeGitHubWorkflow(config: Record<string, unknown>): Promise<string> {
  const { owner, repo, workflow, ref = 'main', inputs = {} } = config as unknown as GitHubWorkflowConfig;

  if (!owner || !repo || !workflow) {
    throw new Error('Missing required config: owner, repo, workflow');
  }

  // Determine which PAT to use based on owner
  const token = owner === 'jvp-ux' ? env.githubPatJvpUx : env.githubPatJaslr;

  if (!token) {
    throw new Error(`GitHub PAT not configured for owner: ${owner}`);
  }

  console.log(`[GitHub] Triggering workflow ${workflow} on ${owner}/${repo}@${ref}`);

  // Trigger the workflow
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow}/dispatches`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'ORCHON-Executor',
      },
      body: JSON.stringify({
        ref,
        inputs,
      }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to trigger workflow: ${response.status} ${text}`);
  }

  // GitHub returns 204 No Content on success
  // We need to poll for the workflow run to confirm it started

  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Get the latest workflow run
  const runsResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow}/runs?per_page=1`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'ORCHON-Executor',
      },
    }
  );

  if (runsResponse.ok) {
    const runsData = await runsResponse.json() as { workflow_runs?: Array<{ id: number; status: string; html_url: string }> };
    if (runsData.workflow_runs && runsData.workflow_runs.length > 0) {
      const run = runsData.workflow_runs[0];
      return `Workflow triggered successfully.\nRun ID: ${run.id}\nStatus: ${run.status}\nURL: ${run.html_url}`;
    }
  }

  return `Workflow dispatch sent to ${owner}/${repo}/${workflow}@${ref}. Check GitHub Actions for status.`;
}
