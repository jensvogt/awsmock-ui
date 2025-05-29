export interface LambdaTagItem {
    key: string | undefined;
    value: string | undefined;
}

export interface LambdaTagCountersResponse {
    total: number;
    tagCounters: LambdaTagItem[];
}