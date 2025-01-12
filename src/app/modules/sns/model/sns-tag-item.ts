export interface SnsTagItem {
    name: string | undefined;
    value: string | undefined;
}

export interface SnsTagCountersResponse {
    Total: number;
    TagCounters: SnsTagItem[];
}