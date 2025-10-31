export interface UserItem {
    Id: string | undefined;
    Username: string | '';
    UserPoolId: string | undefined;
    Enabled: boolean | undefined;
    UserStatus: string | undefined;
    Password: string | '';
    Created: Date;
    Modified: Date;
}

export interface UserCountersResponse {
    total: number | undefined;
    users: UserItem[];
}
