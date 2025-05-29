export interface LambdaEnvironmentItem {
    key: string | undefined;
    value: string | undefined;
}

export interface LambdaEnvironmentCountersResponse {
    total: number;
    environmentCounters: LambdaEnvironmentItem[];
}