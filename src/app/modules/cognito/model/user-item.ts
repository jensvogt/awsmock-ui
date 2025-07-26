export interface UserItem {
    Id: string | undefined;
    UserName: string | undefined;
    UserPoolId: string | undefined;
    Enabled: boolean | undefined;
    UserStatus: string | undefined;
    Password: string | undefined;
    Created: Date;
    Modified: Date;
}

export interface UserCountersResponse {
    total: number | undefined;
    users: UserItem[];
}
