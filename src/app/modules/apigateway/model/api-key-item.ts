export interface ApiKeyItem {
    region: string;
    user: string;
    id: string;
    name: string;
    enabled: boolean;
    customerId: string;
    created: Date | undefined;
    modified: Date | undefined;
}

export interface ListApiKeyCountersResponse {
    total: number;
    apiKeys: ApiKeyItem[];
}

export interface AddApiKeyRequest {
    name: string;
    value: string;
    description: string;
    enabled: boolean;
}
