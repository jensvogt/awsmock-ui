export interface Attribute {

}

export interface ItemItem {
    id: string | undefined;
    attributes: Attribute[] | undefined;
    keys: Attribute[] | undefined;
    size: number;
    created: Date | undefined;
    modified: Date | undefined;
}

export interface ItemCountersResponse {
    total: number | undefined;
    itemCounters: ItemItem[];
}

export interface PutItemRequest {
    TableName: string | undefined;
    Item: Attribute;
    ReturnConsumedCapacity: string;
    ReturnItemCollectionMetrics: string;
}
