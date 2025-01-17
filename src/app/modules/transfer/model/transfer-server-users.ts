export interface TransferServerUser {
    Name: string;
    Password: string;
    Created: Date;
    Modified: Date;
}

export interface TransferServerUsersResponse {
    users: TransferServerUser[];
    total: number;
}
