export interface UserItem {
    id: string | undefined;
    userName: string | undefined;
    userPoolId: string | undefined;
    enabled: boolean | undefined;
    status: string | undefined;
}

export interface UserCountersResponse {
    total: number | undefined;
    users: UserItem[];
}
