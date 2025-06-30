export interface SsmParameterItem {
    name: string | undefined;
    created: Date | undefined;
    modified: Date | undefined;
}

export interface ListParameterCountersResponse {
    total: number;
    parameterCounters: SsmParameterItem[];
}

export interface SsmParameterDetails {
    region: string | undefined;
    name: string | undefined;
    value: string | undefined;
    type: string | undefined;
    description: string | undefined;
    keyId: string | undefined;
    arn: string | undefined;
    created: Date | undefined;
    modified: Date | undefined;
}

export interface SsmParameterDetailsResponse {
    Parameter: SsmParameterDetails;
}
