export interface SqsAttributeItem {
    name: string | undefined;
    value: string | undefined;
}

export interface SqsAttributeCountersResponse {
    Total: number;
    AttributeCounters: SqsAttributeItem[];
}