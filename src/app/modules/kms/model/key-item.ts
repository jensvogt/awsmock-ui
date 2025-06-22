export interface KmsKeyItem {
    keyId: string | undefined;
    keyArn: string | undefined;
    keyUsage: number | undefined;
    keySpec: number | undefined;
    created: Date | undefined;
    modified: Date | undefined;
}

export interface ListKeyCountersResponse {
    total: number;
    keyCounters: KmsKeyItem[];
}