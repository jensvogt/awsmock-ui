import {createAction, props} from '@ngrx/store';
import {TransferServerDetailsResponse} from "../../model/transfer-server-details";
import {TransferServerUsersResponse} from "../../model/transfer-server-users";
import {SortColumn} from "../../../../shared/sorting/sorting.component";

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

    // Load tags
    loadUsers: createAction('[sns-topic-details] Load transfer server users', props<{ serverId: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    loadUsersSuccess: createAction('[sns-topic-details] Load transfer server users success', props<{ users: TransferServerUsersResponse }>()),
    loadUsersFailure: createAction('[sns-topic-details] Load transfer server users error', props<{ error: string }>()),

    // Delete transfer server
    // deleteTransferServer: createAction('[transfer-server-list] Delete transfer server', props<{ serverId: string }>()),
    // deleteTransferServerSuccess: createAction('[transfer-server-list] Delete transfer server success'),
    // deleteTransferServerFailure: createAction('[transfer-server-list] Delete transfer server error', props<{ error: string }>()),
}