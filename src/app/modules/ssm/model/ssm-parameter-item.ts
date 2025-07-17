import {SortColumn} from "../../../shared/sorting/sorting.component";

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
    Region: string | undefined;
    Name: string | undefined;
    Value: string | undefined;
    Type: string | undefined;
    Description: string | undefined;
    KeyId: string | undefined;
    MmsKeyArn: string | undefined;
    ARN: string | undefined;
    Created: Date | undefined;
    Modified: Date | undefined;
}

export interface SsmParameterDetailsResponse {
    Parameter: SsmParameterDetails;
}

export interface CreateParameterCounterRequest {
    name: string;
    value: string;
    description: string;
    type: string;
    kmsKeyArn: string;
    prefix: string;
    pageSize: number;
    pageIndex: number;
    sortColumns: SortColumn[];
}

export interface UpdateParameterCounterRequest {
    name: string;
    value: string;
    description: string;
    type: string;
    kmsKeyArn: string;
    prefix: string;
    pageSize: number;
    pageIndex: number;
    sortColumns: SortColumn[];
}

export interface LoadKmsKeyArnsResponse {
    kmsKeyArns: string[];
}