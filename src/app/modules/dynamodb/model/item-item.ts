export interface Attribute {

}

export interface ItemItem {
    oid: string | undefined;
    attributes: Attribute[] | undefined;
    keys: Attribute[] | undefined
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
