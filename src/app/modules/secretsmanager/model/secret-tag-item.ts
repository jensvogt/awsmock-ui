export interface SecretTagItem {
    name: string | undefined;
    value: string | undefined;
}

export interface SecretTagCountersResponse {
    total: number;
    tagCounters: SecretTagItem[];
}