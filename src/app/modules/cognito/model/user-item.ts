export interface UserItem {
    Id: string | undefined;
    Username: string | undefined;
    UserPoolId: string | undefined;
    Enabled: boolean | undefined;
    UserStatus: string | undefined;
    Password: string | undefined;
    Created: Date | undefined;
    Modified: Date | undefined;
}

export interface UserCountersResponse {
    total: number | undefined;
    users: UserItem[];
}
