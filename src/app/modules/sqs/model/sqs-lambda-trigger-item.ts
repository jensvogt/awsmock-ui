export interface SqsLambdaTriggerItem {
    uuid: string | undefined;
    arn: string | undefined;
    enabled: boolean;
}

export interface SqsLambdaTriggerCountersResponse {
    Total: number;
    LambdaTriggerCounters: SqsLambdaTriggerItem[];
}