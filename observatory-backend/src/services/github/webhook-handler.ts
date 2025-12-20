import { getProjectByOwnerRepo } from '../../config/projects.js';
import * as db from '../../db/queries.js';

export interface WorkflowRunPayload {
  action: 'requested' | 'in_progress' | 'completed';
  workflow_run: {
    id: number;
    name: string;
    status: 'queued' | 'in_progress' | 'completed';
    conclusion: 'success' | 'failure' | 'cancelled' | 'skipped' | 'timed_out' | null;
    html_url: string;
    head_sha: string;
    head_branch: string;
    created_at: string;
    updated_at: string;
  };
  repository: {
    name: string;
    full_name: string;
    owner: {
      login: string;
    };
  };
}

export interface ProcessedDeployment {
  id: string;
  projectId: string;
  serviceId: string;
  provider: 'github';
  status: 'queued' | 'in_progress' | 'success' | 'failure';
  workflowName: string;
  commitSha: string;
  branch: string;
  runUrl: string;
  startedAt: string;
  completedAt?: string;
}

export async function handleWorkflowRun(
  payload: WorkflowRunPayload
): Promise<ProcessedDeployment | null> {
  const { action, workflow_run, repository } = payload;
  const owner = repository.owner.login;
  const repo = repository.name;

  // Find the project
  const project = getProjectByOwnerRepo(owner, repo);
  if (!project) {
    console.log(`Unknown repo: ${owner}/${repo}, skipping`);
    return null;
  }

  // Find the CI service for this project
  const ciService = project.services.find((s) => s.category === 'ci' && s.provider === 'github');
  if (!ciService) {
    console.log(`No GitHub CI service configured for ${project.id}`);
    return null;
  }

  // Map status
  let status: 'queued' | 'in_progress' | 'success' | 'failure';
  if (action === 'completed') {
    status = workflow_run.conclusion === 'success' ? 'success' : 'failure';
  } else if (action === 'in_progress') {
    status = 'in_progress';
  } else {
    status = 'queued';
  }

  const deployment: ProcessedDeployment = {
    id: `gh-${workflow_run.id}`,
    projectId: project.id,
    serviceId: ciService.id,
    provider: 'github',
    status,
    workflowName: workflow_run.name,
    commitSha: workflow_run.head_sha,
    branch: workflow_run.head_branch,
    runUrl: workflow_run.html_url,
    startedAt: workflow_run.created_at,
    completedAt: action === 'completed' ? workflow_run.updated_at : undefined,
  };

  // Store in database
  try {
    await db.insertDeployment({
      id: deployment.id,
      serviceId: deployment.serviceId,
      provider: deployment.provider,
      status: deployment.status,
      commitSha: deployment.commitSha,
      runUrl: deployment.runUrl,
      startedAt: new Date(deployment.startedAt),
      completedAt: deployment.completedAt ? new Date(deployment.completedAt) : undefined,
    });
  } catch (err) {
    console.error('Failed to store deployment:', err);
    // Continue - still return the deployment for SSE broadcast
  }

  return deployment;
}
