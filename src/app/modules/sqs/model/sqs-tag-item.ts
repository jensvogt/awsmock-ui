export interface SqsTagItem {
    name: string | undefined;
    value: string | undefined;
}

export interface SqsTagCountersResponse {
    total: number;
    tagCounters: SqsTagItem[];
}