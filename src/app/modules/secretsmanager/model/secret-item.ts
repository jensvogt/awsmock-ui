export interface SecretItem {
    secretName: string | undefined;
    secretArn: string | undefined;
    secretId: string | undefined;
    created: Date | undefined;
    modified: Date | undefined;
}

export interface ListSecretCountersResponse {
    total: number;
    secretCounters: SecretItem[];
}
