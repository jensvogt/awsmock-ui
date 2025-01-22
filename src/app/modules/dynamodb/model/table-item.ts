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
    tableName: string | undefined;
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