export interface SnsAttributeItem {
    name: string | undefined;
    value: string | undefined;
}

export interface SnsAttributeCountersResponse {
    Total: number;
    AttributeCounters: SnsAttributeItem[];
}