export interface LambdaInstanceItem {
    instanceId: string | undefined;
    containerId: string | undefined;
    status: string | undefined;
    hostname: string | undefined;
    publicPort: number | undefined;
    lastStart: Date | undefined;
    lastInvocation: Date | undefined;
    lastStop: Date | undefined;
}

export interface LambdaInstanceCountersResponse {
    total: number;
    instanceCounters: LambdaInstanceItem[];
}