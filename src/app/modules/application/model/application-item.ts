import {SortColumn} from "../../../shared/sorting/sorting.component";

export interface Environment {
    key: string | undefined;
    value: string | undefined;
}

export interface Tag {
    key: string | undefined;
    value: string | undefined;
}

export interface ApplicationItem {
    region: string;
    user: string;
    name: string;
    runtime: string;
    runType: string;
    privatePort: number;
    publicPort: number;
    archive: string;
    version: string;
    containerId: string;
    containerName: string;
    imageId: string;
    status: string;
    enabled: boolean;
    description: string;
    environment: any;
    tags: any;
    options: any;
    lastStarted: Date | undefined;
    created: Date | undefined;
    modified: Date | undefined;
}

export interface ListApplicationCountersResponse {
    total: number;
    applications: ApplicationItem[];
}

export interface AddApplicationRequest {
    application: ApplicationItem,
    code: string,
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

export interface StartApplicationRequest {
    region?: string;
    user?: string;
    application: ApplicationItem;
    prefix: string,
    pageSize: number,
    pageIndex: number,
    sortColumns: SortColumn[]
}

export interface StopApplicationRequest {
    region?: string;
    user?: string;
    application: ApplicationItem;
    prefix: string,
    pageSize: number,
    pageIndex: number,
    sortColumns: SortColumn[]
}

export interface RebuildApplicationRequest {
    region?: string;
    user?: string;
    application: ApplicationItem;
    prefix: string,
    pageSize: number,
    pageIndex: number,
    sortColumns: SortColumn[]
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
