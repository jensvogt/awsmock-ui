export interface SecretVersionItem {
    id: string | undefined;
    states: string[] | undefined;
}

export interface SecretVersionCountersResponse {
    total: number;
    versionCounters: SecretVersionItem[];
}