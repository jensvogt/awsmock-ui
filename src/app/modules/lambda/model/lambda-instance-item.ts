export interface LambdaInstanceItem {
    instanceId: string | undefined;
    containerId: string | undefined;
    status: string | undefined;
}

export interface LambdaInstanceCountersResponse {
    total: number;
    instanceCounters: LambdaInstanceItem[];
}