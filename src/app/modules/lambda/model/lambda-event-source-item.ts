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

export interface AddEventSourceRequest {
    Type: string;
    EventSourceArn: string;
    FunctionArn: string;
    Events: string[];
    FilterRuleType: string;
    FilterRuleValue: string;
    BatchSize: number;
    MaximumBatchingWindowInSeconds: number;
    UUID: string;
    Enabled: boolean;
}

export interface UpdateEventSourceRequest {
    FunctionArn: string;
    Events: string;
    FilterRuleType: string;
    FilterRuleValue: string;
    BatchSize: number;
    MaximumBatchingWindowInSeconds: number;
    Enabled: boolean;
}