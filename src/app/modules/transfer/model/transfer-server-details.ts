export interface TransferServerDetails {
    Region: string;
    ServerId: string;
    Arn: string;
    Concurrency: number;
    Port: number;
    State: string;
    Created: Date;
    Modified: Date;
}

export interface TransferServerDetailsResponse {
    server: TransferServerDetails;
}
