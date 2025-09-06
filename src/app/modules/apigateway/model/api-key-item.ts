export interface ApiKeyItem {
    region: string;
    user: string;
    id: string;
    name: string;
    enabled: boolean;
    customerId: string;
    description: string;
    value: string;
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

export interface ApiKeyDetailsResponse {
    apiKey: ApiKeyItem;
}

export interface ApiKeyUpdateRequest {
    apiKey: ApiKeyItem;
}
