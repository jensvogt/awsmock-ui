export interface UserItem {
    id: string | undefined;
    userName: string | undefined;
    userPoolId: string | undefined;
    enabled: boolean | undefined;
    userStatus: string | undefined;
    created: Date | undefined;
    modified: Date | undefined;
}

export interface UserCountersResponse {
    total: number | undefined;
    users: UserItem[];
}
