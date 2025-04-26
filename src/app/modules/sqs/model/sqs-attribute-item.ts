export interface SqsAttributeItem {
    Name: string | undefined;
    Value: string | undefined;
    DataType: string | undefined;
}

export interface SqsAttributeCountersResponse {
    total: number;
    attributeCounters: SqsAttributeItem[];
}