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

// {
//     "TableName" : "pim_local_feature_state",
//     "Item" : {
//     "featureName" : {
//         "S" : "ONIX_SPLITTING"
//     },
//     "featureState" : {
//         "S" : "{\"enabled\":true,\"strategyId\":null,\"parameters\":{}}"
//     }
// },
//     "ReturnConsumedCapacity" : "TOTAL",
//     "ReturnItemCollectionMetrics" : "SIZE"
// }