export interface LambdaEventSourceItem {
    Type: string | undefined;
    EventSourceArn: string | undefined;
    FunctionArn: string | undefined;
    BatchSize: number | undefined;
    MaximumBatchingWindowInSeconds: number | undefined;
    UUID: string | undefined;
}

export interface LambdaEventSourceCountersResponse {
    total: number;
    eventSourceCounters: LambdaEventSourceItem[];
}