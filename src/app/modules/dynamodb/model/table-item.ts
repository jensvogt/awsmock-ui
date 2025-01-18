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
