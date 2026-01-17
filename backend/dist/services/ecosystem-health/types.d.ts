export type NodeStatus = 'healthy' | 'degraded' | 'down' | 'unknown';
export type NodeType = 'platform' | 'service' | 'external' | 'app';
export interface EcosystemNode {
    id: string;
    label: string;
    type: NodeType;
    status: NodeStatus;
    url?: string;
    parent?: string;
    meta?: Record<string, string>;
}
export interface EcosystemEdge {
    from: string;
    to: string;
    label?: string;
}
export interface EcosystemResponse {
    nodes: EcosystemNode[];
    edges: EcosystemEdge[];
    lastCheck: string;
}
export interface CheckResult {
    status: NodeStatus;
    responseTime?: number;
    error?: string;
    meta?: Record<string, string>;
}
export interface NodeDefinition {
    id: string;
    label: string;
    type: NodeType;
    parent?: string;
    url?: string;
    check: () => Promise<CheckResult>;
}
//# sourceMappingURL=types.d.ts.map