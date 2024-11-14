export interface UserPoolItem {
    id: string | undefined;
    region: string | undefined;
    userPoolId: string | undefined;
    userCount: number | undefined;
    created: Date | undefined;
    modified: Date | undefined;
}

export interface UserPoolCountersResponse {
    total: number | undefined;
    userPools: UserPoolItem[];
}
