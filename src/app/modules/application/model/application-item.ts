import {Code} from "../../lambda/model/lambda-item";
import {SortColumn} from "../../../shared/sorting/sorting.component";

export interface Environment {
    key: string | undefined;
    value: string | undefined;
}

export interface Tags {
    key: string | undefined;
    value: string | undefined;
}

export interface Options {
    key: string | undefined;
    value: string | undefined;
}

export interface ApplicationItem {
    name: string | undefined;
    runtime: string | undefined;
    archive: string | undefined;
    version: string | undefined;
    containerId: string | undefined;
    status: string | undefined;
    enabled: boolean | undefined;
    environment: Environment[] | undefined;
    tags: Tags[] | undefined;
    options: Options[] | undefined;
    created: Date | undefined;
    modified: Date | undefined;
}

export interface ListApplicationCountersResponse {
    total: number;
    applications: ApplicationItem[];
}

export interface AddApplicationRequest {
    name: string;
    runtime: string;
    archive: string;
    code: Code;
    version: string;
    status: number;
    prefix: string,
    pageSize: number,
    pageIndex: number,
    sortColumns: SortColumn[]
}

export interface DeleteApplicationRequest {
    name: string | undefined,
    prefix: string | undefined,
    pageSize: number | undefined,
    pageIndex: number | undefined,
    sortColumns: SortColumn[] | undefined
}
