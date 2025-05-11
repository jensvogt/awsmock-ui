import {createAction, props} from '@ngrx/store';
import {TransferServerDetailsResponse} from "../../model/transfer-server-details";
import {TransferServerUsersResponse} from "../../model/transfer-server-users";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {TransferServerProtocolsResponse} from "../../model/transfer-server-protocols";
import {TransferServerTagsResponse} from "../../model/transfer-server-tags";

export const transferServerDetailActions = {
    initialize: createAction('[transfer-server-details] initialize'),

    // Load server list
    loadTransferServerDetails: createAction('[transfer-server-details] Load transfer server details', props<{ serverId: string }>()),
    loadTransferServerDetailsSuccess: createAction('[transfer-server-details] Load transfer server details success', props<{ transferServerDetailsResponse: TransferServerDetailsResponse }>()),
    loadTransferServerDetailsFailure: createAction('[transfer-server-details] Load transfer server details error', props<{ error: string }>()),

    // Add queue
    //addQueue: createAction('[transfer-server-list] Add Queue', props<{ name: string }>()),
    //addQueueSuccess: createAction('[transfer-server-list] Add Queue Success'),
    //addQueueFailure: createAction('[transfer-server-list] Add Queue Error', props<{ error: string }>()),

    // Load users
    loadUsers: createAction('[transfer-server-details] Load transfer server users', props<{ serverId: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    loadUsersSuccess: createAction('[transfer-server-details] Load transfer server users success', props<{ users: TransferServerUsersResponse }>()),
    loadUsersFailure: createAction('[transfer-server-details] Load transfer server users error', props<{ error: string }>()),

    // Load protocols
    loadProtocols: createAction('[transfer-server-details] Load transfer server protocols', props<{ serverId: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    loadProtocolsSuccess: createAction('[transfer-server-details] Load transfer server protocols success', props<{ protocols: TransferServerProtocolsResponse }>()),
    loadProtocolsFailure: createAction('[transfer-server-details] Load transfer server protocols error', props<{ error: string }>()),

    // Load tags
    loadTags: createAction('[transfer-server-details] Load transfer server tags', props<{ serverId: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    loadTagsSuccess: createAction('[transfer-server-details] Load transfer server tags success', props<{ tags: TransferServerTagsResponse }>()),
    loadTagsFailure: createAction('[transfer-server-details] Load transfer server tags error', props<{ error: string }>()),

    // Delete transfer server
    // deleteTransferServer: createAction('[transfer-server-list] Delete transfer server', props<{ serverId: string }>()),
    // deleteTransferServerSuccess: createAction('[transfer-server-list] Delete transfer server success'),
    // deleteTransferServerFailure: createAction('[transfer-server-list] Delete transfer server error', props<{ error: string }>()),
}