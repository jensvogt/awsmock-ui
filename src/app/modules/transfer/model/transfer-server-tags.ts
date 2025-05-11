export interface TransferServerTag {
    key: string;
    value: string;
}

export interface TransferServerTagsResponse {
    tagCounters: TransferServerTag[];
    total: number;
}

