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
    region: string;
    user: string;
    name: string;
    runtime: string;
    runType: string;
    archive: string;
    version: string;
    containerId: string;
    status: string;
    enabled: boolean;
    environment: any;
    tags: any;
    options: any;
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


export interface UpdateApplicationRequest {
    application: ApplicationItem;
}

export interface UpdateApplicationResponse {
    application: ApplicationItem;
}

export interface GetApplicationRequest {
    name: string;
}

export interface GetApplicationResponse {
    application: ApplicationItem;
}

export interface DeleteApplicationRequest {
    name: string | undefined,
    prefix: string | undefined,
    pageSize: number | undefined,
    pageIndex: number | undefined,
    sortColumns: SortColumn[] | undefined
}
