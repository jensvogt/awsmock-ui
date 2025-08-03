export interface Attribute {
    AttributeName: string;
    AttributeType: string;
}

export interface KeySchema {
    AttributeName: string;
    KeyType: string;
}

export interface TableItem {
    id: string | undefined;
    region: string | undefined;
    tableName: string | undefined;
    status: string | undefined;
    items: number;
    size: number;
    created: Date | undefined;
    modified: Date | undefined;
}

export interface TableCountersResponse {
    total: number | undefined;
    tableCounters: TableItem[];
}

export interface ProvisionedThroughput {
    ReadCapacityUnits: number;
    WriteCapacityUnits: number;
}

export interface CreateTableRequest {
    Region: string;
    TableName: string;
    AttributeDefinitions: Attribute[];
    KeySchema: KeySchema[];
    ProvisionedThroughput: ProvisionedThroughput;
}

export interface GetTableRequest {
    region: string;
    tableName: string;
}

export interface GetTableResponse {
    tableCounters: TableItem;
}

export interface UpdateTableRequest {
    region: string;
    tableName: string;
}

export interface UpdateTableResponse {
    region: string;
    tableName: string;
}