export interface LambdaFunctionItem {
    id: string | undefined;
    region: string | undefined;
    functionName: string | undefined;
    runtime: string | undefined;
    handler: string | undefined;
    user: string | undefined;
    role: string | undefined;
    size: number | undefined;
    concurrency: number | undefined;
    invocations: number | undefined;
    averageRuntime: number | undefined;
    lastInvocation: Date;
    created: Date;
    modified: Date;
}

export interface LambdaFunctionCountersResponse {
    total: number;
    functionCounters: LambdaFunctionItem[];
}