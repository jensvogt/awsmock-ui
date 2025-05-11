export interface TransferServerUser {
    UserName: string;
    Password: string;
    Created: Date;
    Modified: Date;
}

export interface TransferServerUsersResponse {
    userCounters: TransferServerUser[];
    total: number;
}

