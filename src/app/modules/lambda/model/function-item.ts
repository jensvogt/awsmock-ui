export interface LambdaFunctionItem {
    id: string | undefined;
    region: string | undefined;
    functionName: string | undefined;
    runtime: string | undefined;
    handler: string | undefined;
    invocations: number | undefined;
    averageRuntime: number | undefined;
}

export interface LambdaFunctionCountersResponse {
    total: number;
    functionCounters: LambdaFunctionItem[];
}