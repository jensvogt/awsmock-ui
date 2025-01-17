export interface TransferServerUser {
    UserName: string;
    Password: string;
    Created: Date;
    Modified: Date;
}

export interface TransferServerUsersResponse {
    UserCounters: TransferServerUser[];
    Total: number;
}
