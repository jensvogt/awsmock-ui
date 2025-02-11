export interface LambdaTagItem {
    key: string | undefined;
    value: string | undefined;
}

export interface LambdaTagCountersResponse {
    Total: number;
    TagCounters: LambdaTagItem[];
}