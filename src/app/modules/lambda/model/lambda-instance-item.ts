export interface LambdaInstanceItem {
    instanceId: string | undefined;
    containerId: string | undefined;
    status: string | undefined;
    lastInvocation: Date | undefined;
}

export interface LambdaInstanceCountersResponse {
    total: number;
    instanceCounters: LambdaInstanceItem[];
}