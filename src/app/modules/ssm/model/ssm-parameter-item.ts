export interface SsmParameterItem {
    name: string | undefined;
    created: Date | undefined;
    modified: Date | undefined;
}

export interface ListParameterCountersResponse {
    total: number;
    parameterCounters: SsmParameterItem[];
}