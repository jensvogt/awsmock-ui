import {createAction, props} from '@ngrx/store';
import {ListTransferServerCountersResponse} from '../../model/transfer-server-item';
import {SortColumn} from "../../../../shared/sorting/sorting.component";

export const transferServerListActions = {
    initialize: createAction('[transfer-server-list] initialize'),

    // Load server list
    loadTransferServer: createAction('[transfer-server-list] Load transfer server', props<{ prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    loadTransferServerSuccess: createAction('[transfer-server-list] Load transfer server success', props<{ listTransferServerCountersResponse: ListTransferServerCountersResponse }>()),
    loadTransferServerFailure: createAction('[transfer-server-list] Load transfer server error', props<{ error: string }>()),

    // Add queue
    //addQueue: createAction('[transfer-server-list] Add Queue', props<{ name: string }>()),
    //addQueueSuccess: createAction('[transfer-server-list] Add Queue Success'),
    //addQueueFailure: createAction('[transfer-server-list] Add Queue Error', props<{ error: string }>()),

    // Delete transfer server
    deleteTransferServer: createAction('[transfer-server-list] Delete transfer server', props<{ serverId: string }>()),
    deleteTransferServerSuccess: createAction('[transfer-server-list] Delete transfer server success'),
    deleteTransferServerFailure: createAction('[transfer-server-list] Delete transfer server error', props<{ error: string }>()),
}