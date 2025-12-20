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
    runUrl?: string;
    startedAt?: Date;
    completedAt?: Date;
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
export declare function getUptimeHistory(projectId: string, hours: number): Promise<UptimeCheck[]>;
export declare function getStatusHistory(projectId: string, hours: number): Promise<ProjectStatus[]>;
export declare function insertDeployment(deployment: Deployment): Promise<void>;
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
//# sourceMappingURL=queries.d.ts.map