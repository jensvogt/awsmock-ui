export interface SqsDefaultMessageAttributeItem {
    name: string | undefined;
    value: string | undefined;
}

export interface SqsDefaultMessageAttributeResponse {
    total: number;
    attributeCounters: SqsDefaultMessageAttributeItem[];
}