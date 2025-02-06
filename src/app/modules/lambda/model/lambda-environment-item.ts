export interface LambdaEnvironmentItem {
    key: string | undefined;
    value: string | undefined;
}

export interface LambdaEnvironmentCountersResponse {
    Total: number;
    EnvironmentCounters: LambdaEnvironmentItem[];
}