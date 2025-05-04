export interface SnsTagItem {
    tagKey: string | undefined;
    tagValue: string | undefined;
}

export interface SnsTagCountersResponse {
    total: number;
    tagCounters: SnsTagItem[];
}