import { RecoveryAction, updateActionExecution } from '../../db/queries.js';
import { executeFlyAction } from './fly.js';
import { executeGitHubWorkflow } from './github.js';
import { executeGCPAction } from './gcp.js';
import { executeSSHCommand } from './ssh.js';

export async function executeAction(action: RecoveryAction, executionId: string): Promise<void> {
  console.log(`[Executor] Starting action: ${action.name} (${action.actionType})`);

  try {
    let output: string;

    switch (action.actionType) {
      case 'fly-api':
        output = await executeFlyAction(action.config);
        break;
      case 'github-workflow':
        output = await executeGitHubWorkflow(action.config);
        break;
      case 'gcp-api':
        output = await executeGCPAction(action.config);
        break;
      case 'ssh-command':
        output = await executeSSHCommand(action.config);
        break;
      default:
        throw new Error(`Unknown action type: ${action.actionType}`);
    }

    await updateActionExecution(executionId, {
      status: 'success',
      output,
    });

    console.log(`[Executor] Action completed: ${action.name}`);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(`[Executor] Action failed: ${action.name}`, errorMessage);

    await updateActionExecution(executionId, {
      status: 'failure',
      output: errorMessage,
    });
  }
}
