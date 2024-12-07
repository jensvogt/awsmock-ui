export interface Tag {
    key: string | undefined;
    value: string | undefined;
}

export interface Environment {
    key: string | undefined;
    value: string | undefined;
}

export interface LambdaFunctionItem {
    id: string | undefined;
    region: string | undefined;
    functionName: string | undefined;
    runtime: string | undefined;
    handler: string | undefined;
    tags: any;
    environment: Environment[];
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