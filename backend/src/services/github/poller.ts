// GitHub Actions poller - polls for workflow runs instead of relying on webhooks
import { env } from '../../config/env.js';
import { projects } from '../../config/projects.js';
import * as db from '../../db/queries.js';
import { broadcast } from '../../sse/broadcaster.js';
import { dispatchAlert } from '../alerts/dispatcher.js';

// Track previous status to detect changes
const previousStatus = new Map<string, string>();

interface WorkflowRun {
  id: number;
  name: string;
  status: 'queued' | 'in_progress' | 'completed' | 'waiting';
  conclusion: 'success' | 'failure' | 'cancelled' | 'skipped' | 'timed_out' | 'action_required' | null;
  html_url: string;
  head_sha: string;
  head_branch: string;
  created_at: string;
  updated_at: string;
}

interface WorkflowRunsResponse {
  workflow_runs: WorkflowRun[];
}

function getTokenForOwner(owner: string): string | null {
  const ownerLower = owner.toLowerCase();
  if (ownerLower === 'jaslr') return env.githubPatJaslr || null;
  if (ownerLower === 'jvp-ux') return env.githubPatJvpUx || null;
  // Default to jaslr token for unknown owners
  return env.githubPatJaslr || null;
}

async function fetchLatestWorkflowRun(owner: string, repo: string): Promise<WorkflowRun | null> {
  const token = getTokenForOwner(owner);
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/runs?per_page=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'orchon-backend',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        // Repo doesn't exist or no access
        return null;
      }
      const text = await response.text();
      throw new Error(`GitHub API error: ${response.status} - ${text}`);
    }

    const data = (await response.json()) as WorkflowRunsResponse;
    return data.workflow_runs[0] || null;
  } catch (err) {
    console.error(`Failed to fetch workflow runs for ${owner}/${repo}:`, err);
    return null;
  }
}

function mapGitHubStatusToDeployment(run: WorkflowRun): 'queued' | 'in_progress' | 'success' | 'failure' {
  if (run.status === 'completed') {
    return run.conclusion === 'success' ? 'success' : 'failure';
  }
  if (run.status === 'in_progress') {
    return 'in_progress';
  }
  return 'queued';
}

function mapGitHubStatusToHealth(run: WorkflowRun | null): 'healthy' | 'degraded' | 'down' | 'unknown' {
  if (!run) return 'unknown';

  if (run.status === 'completed') {
    return run.conclusion === 'success' ? 'healthy' : 'down';
  }
  if (run.status === 'in_progress' || run.status === 'queued' || run.status === 'waiting') {
    return 'degraded'; // Building
  }
  return 'unknown';
}

export async function pollGitHubActions(): Promise<void> {
  console.log('Polling GitHub Actions...');

  // Find projects that use GitHub Actions
  const githubProjects = projects.filter((p) =>
    p.services.some((s) => s.provider === 'github' && s.category === 'ci')
  );

  if (githubProjects.length === 0) {
    console.log('No GitHub Actions projects configured');
    return;
  }

  let checkedCount = 0;

  for (const project of githubProjects) {
    const ghService = project.services.find(
      (s) => s.provider === 'github' && s.category === 'ci'
    );
    if (!ghService) continue;

    const run = await fetchLatestWorkflowRun(project.owner, project.name);
    if (!run) {
      continue;
    }

    checkedCount++;
    const status = mapGitHubStatusToHealth(run);
    const prevStatus = previousStatus.get(project.id);
    const deploymentStatus = mapGitHubStatusToDeployment(run);

    // Store status check
    try {
      await db.insertStatusCheck(
        ghService.id,
        status,
        `${run.name}: ${run.status}${run.conclusion ? ` (${run.conclusion})` : ''}`
      );
    } catch (err) {
      console.error(`Failed to store GitHub status for ${project.id}:`, err);
    }

    // Store deployment
    try {
      await db.insertDeployment({
        id: `gh-${run.id}`,
        serviceId: ghService.id,
        provider: 'github',
        status: deploymentStatus,
        commitSha: run.head_sha,
        branch: run.head_branch,
        runUrl: run.html_url,
        startedAt: new Date(run.created_at),
        completedAt: run.status === 'completed' ? new Date(run.updated_at) : undefined,
        pushedAt: new Date(run.created_at),
        ciStartedAt: run.status !== 'queued' ? new Date(run.created_at) : undefined,
        ciCompletedAt: run.status === 'completed' ? new Date(run.updated_at) : undefined,
      });
    } catch (err) {
      // Might be a duplicate, that's OK
    }

    // Broadcast if status changed
    if (status !== prevStatus) {
      previousStatus.set(project.id, status);

      broadcast({
        type: 'status',
        project: project.id,
        data: {
          serviceId: ghService.id,
          provider: 'github',
          status,
          run: {
            id: run.id,
            name: run.name,
            status: run.status,
            conclusion: run.conclusion,
            url: run.html_url,
          },
          timestamp: new Date().toISOString(),
        },
      });

      // Alert on failures
      if (status === 'down' && prevStatus !== 'down') {
        await dispatchAlert(
          project.id,
          ghService.id,
          'deploy_failure',
          `GitHub Actions failed for ${project.displayName}: ${run.name} - ${run.conclusion}`
        );
      }
    }
  }

  console.log(`GitHub Actions poll complete: ${checkedCount} projects checked`);
}
