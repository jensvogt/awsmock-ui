import {Code} from "../../lambda/model/lambda-item";
import {SortColumn} from "../../../shared/sorting/sorting.component";

export interface ApplicationItem {
    name: string | undefined;
    runtime: string | undefined;
    archive: string | undefined;
    version: string | undefined;
    containerId: string | undefined;
    status: string | undefined;
    enabled: boolean | undefined;
    created: Date | undefined;
    modified: Date | undefined;
}

export interface ListApplicationCountersResponse {
    total: number;
    applicationCounters: ApplicationItem[];
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
