export interface SnsAttributeItem {
    attributeKey: string | undefined;
    attributeValue: string | undefined;
}

export interface SnsAttributeCountersResponse {
    total: number;
    attributeCounters: SnsAttributeItem[];
}