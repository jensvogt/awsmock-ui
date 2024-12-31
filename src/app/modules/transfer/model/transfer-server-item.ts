export interface TransferServerItem {
    ServerId: string | undefined;
    Arn: string | undefined;
    Created: Date | undefined
    Modified: Date | undefined
}

export interface ListTransferServerCountersResponse {
    Total: number;
    TransferServerCounters: TransferServerItem[];
}