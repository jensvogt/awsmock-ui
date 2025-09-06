export interface RestApiItem {
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

export interface ListRestApiCountersResponse {
    total: number;
    restApis: RestApiItem[];
}

export interface AddRestApiRequest {
    name: string;
    value: string;
    description: string;
    enabled: boolean;
}

export interface RestApiDetailsResponse {
    restApi: RestApiItem;
}

export interface RestApiUpdateRequest {
    restApi: RestApiItem;
}
