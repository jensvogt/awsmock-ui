export interface TableItem {
    Id: string | undefined;
    Name: string | undefined;
    Created: Date | undefined;
    Modified: Date | undefined;
}

export interface TableCountersResponse {
    total: number | undefined;
    tables: TableItem[];
}
