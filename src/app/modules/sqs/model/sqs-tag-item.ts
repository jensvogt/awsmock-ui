export interface SqsTagItem {
    name: string | undefined;
    value: string | undefined;
}

export interface SqsTagCountersResponse {
    Total: number;
    TagCounters: SqsTagItem[];
}