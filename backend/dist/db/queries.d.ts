export interface ProjectStatus {
    projectId: string;
    status: 'healthy' | 'degraded' | 'down' | 'unknown';
    message?: string;
    checkedAt: Date;
}
export interface Deployment {
    id: string;
    serviceId: string;
    provider: string;
    status: 'queued' | 'in_progress' | 'success' | 'failure';
    commitSha?: string;
    branch?: string;
    runUrl?: string;
    startedAt?: Date;
    completedAt?: Date;
    pushedAt?: Date;
    ciStartedAt?: Date;
    ciCompletedAt?: Date;
    deployStartedAt?: Date;
    deployCompletedAt?: Date;
}
export interface UptimeCheck {
    serviceId: string;
    responseTimeMs?: number;
    statusCode?: number;
    isUp: boolean;
    checkedAt: Date;
}
export interface CostEntry {
    projectId: string;
    month: string;
    amountCents: number;
    provider: string;
    notes?: string;
}
export declare function getLatestStatusForAllProjects(): Promise<ProjectStatus[]>;
export declare function getLatestStatus(projectId: string): Promise<ProjectStatus | null>;
export declare function getRecentDeployments(projectId: string, limit: number): Promise<Deployment[]>;
export interface GlobalDeployment extends Deployment {
    projectId: string;
    projectName: string;
    projectDisplayName: string;
    owner: string;
    repoName?: string;
    deployMechanism?: string;
    version?: string;
}
export declare function getGlobalRecentDeployments(limit: number): Promise<GlobalDeployment[]>;
export declare function getUptimeHistory(projectId: string, hours: number): Promise<UptimeCheck[]>;
export declare function getStatusHistory(projectId: string, hours: number): Promise<ProjectStatus[]>;
export declare function insertDeployment(deployment: Deployment): Promise<void>;
export declare function updateDeploymentByCommit(commitSha: string, updates: Partial<Pick<Deployment, 'deployStartedAt' | 'deployCompletedAt' | 'status'>>): Promise<Deployment | null>;
export declare function insertStatusCheck(serviceId: string, status: string, message?: string): Promise<void>;
export declare function insertUptimeCheck(check: {
    serviceId: string;
    url: string;
    responseTimeMs?: number;
    statusCode?: number;
    isUp: boolean;
    errorMessage?: string;
}): Promise<void>;
export declare function getAllCosts(): Promise<CostEntry[]>;
export declare function insertCost(cost: CostEntry): Promise<CostEntry>;
export declare function getProject(projectId: string): Promise<{
    alertLevel: string;
    alertEmail?: string;
} | null>;
export declare function insertAlert(alert: {
    projectId: string;
    serviceId?: string;
    alertType: string;
    message: string;
    channel: string;
}): Promise<void>;
export interface ProjectRow {
    id: string;
    name: string;
    displayName: string;
    owner: string;
    alertLevel: 'hobby' | 'business';
    alertEmail?: string;
    uptimeUrl?: string;
    productionUrl?: string;
    repoName?: string;
    deployMechanism?: 'github-actions' | 'local-wrangler' | 'local-fly' | 'gcp-cloudbuild';
    createdAt: Date;
    updatedAt: Date;
}
export interface ServiceRow {
    id: string;
    projectId: string;
    category: string;
    provider: string;
    serviceName: string;
    checkUrl?: string;
    dashboardUrl?: string;
    config: Record<string, unknown>;
}
export declare function getAllProjects(): Promise<ProjectRow[]>;
export declare function getProjectById(projectId: string): Promise<ProjectRow | null>;
export declare function getProjectByRepoName(owner: string, repoName: string): Promise<ProjectRow | null>;
export declare function createProject(project: {
    id: string;
    name: string;
    displayName: string;
    owner: string;
    alertLevel?: 'hobby' | 'business';
    alertEmail?: string;
    uptimeUrl?: string;
    productionUrl?: string;
    repoName?: string;
    deployMechanism?: 'github-actions' | 'local-wrangler' | 'local-fly' | 'gcp-cloudbuild';
}): Promise<ProjectRow>;
export declare function updateProject(projectId: string, updates: Partial<{
    name: string;
    displayName: string;
    owner: string;
    alertLevel: 'hobby' | 'business';
    alertEmail: string;
    uptimeUrl: string;
    productionUrl: string;
    repoName: string;
    deployMechanism: 'github-actions' | 'local-wrangler' | 'local-fly' | 'gcp-cloudbuild';
}>): Promise<ProjectRow | null>;
export declare function deleteProject(projectId: string): Promise<boolean>;
export declare function getServicesByProject(projectId: string): Promise<ServiceRow[]>;
export declare function createService(service: {
    id: string;
    projectId: string;
    category: string;
    provider: string;
    serviceName: string;
    checkUrl?: string;
    dashboardUrl?: string;
    config?: Record<string, unknown>;
}): Promise<ServiceRow>;
export declare function updateService(serviceId: string, updates: Partial<{
    category: string;
    provider: string;
    serviceName: string;
    checkUrl: string;
    dashboardUrl: string;
    config: Record<string, unknown>;
}>): Promise<ServiceRow | null>;
export declare function deleteService(serviceId: string): Promise<boolean>;
export declare function getFailedDeployments(limit: number): Promise<GlobalDeployment[]>;
export interface ProjectStatusSummary {
    healthy: number;
    degraded: number;
    down: number;
    unknown: number;
}
export declare function getProjectStatusSummary(): Promise<ProjectStatusSummary>;
export interface RecoveryAction {
    id: string;
    serviceId: string;
    name: string;
    actionType: 'fly-api' | 'github-workflow' | 'gcp-api' | 'ssh-command';
    config: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}
export interface ActionExecution {
    id: string;
    actionId: string;
    triggeredBy: 'manual' | 'auto-heal';
    status: 'pending' | 'running' | 'success' | 'failure';
    output?: string;
    startedAt: Date;
    completedAt?: Date;
}
export declare function getAllRecoveryActions(): Promise<RecoveryAction[]>;
export declare function getRecoveryActionsByService(serviceId: string): Promise<RecoveryAction[]>;
export declare function getRecoveryActionById(id: string): Promise<RecoveryAction | null>;
export declare function createRecoveryAction(action: {
    serviceId: string;
    name: string;
    actionType: RecoveryAction['actionType'];
    config: Record<string, unknown>;
}): Promise<RecoveryAction>;
export declare function updateRecoveryAction(id: string, updates: Partial<{
    name: string;
    actionType: RecoveryAction['actionType'];
    config: Record<string, unknown>;
}>): Promise<RecoveryAction | null>;
export declare function deleteRecoveryAction(id: string): Promise<boolean>;
export declare function createActionExecution(execution: {
    actionId: string;
    triggeredBy: 'manual' | 'auto-heal';
}): Promise<ActionExecution>;
export declare function updateActionExecution(id: string, updates: {
    status: ActionExecution['status'];
    output?: string;
}): Promise<ActionExecution | null>;
export declare function getRecentExecutions(limit: number): Promise<(ActionExecution & {
    actionName: string;
    serviceId: string;
})[]>;
//# sourceMappingURL=queries.d.ts.map