export interface KmsKeyItem {
    region: string | undefined;
    user: string | undefined;
    requestId: string | undefined;
    keyId: string | undefined;
    keyArn: string | undefined;
    keyUsage: string | undefined;
    keySpec: string | undefined;
    keyState: string | undefined;
    created: Date | undefined;
    modified: Date | undefined;
}

export interface ListKeyCountersResponse {
    total: number;
    keyCounters: KmsKeyItem[];
}