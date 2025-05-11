import {createReducer, on} from "@ngrx/store";
import {transferServerListActions} from './transfer-server-list.actions';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {ListTransferServerCountersResponse} from "../../model/transfer-server-item";

export const transferServerListFeatureKey = 'transfer-server-list';

export interface TransferServerListState {
    listTransferServerCountersResponse: ListTransferServerCountersResponse;
    prefix: string;
    pageSize: number;
    pageIndex: number;
    loading: boolean;
    sortColumns: SortColumn[];
    error: unknown;
}

export const initialState: TransferServerListState = {
    listTransferServerCountersResponse: {total: 0, transferServers: []},
    prefix: '',
    pageSize: 10,
    pageIndex: 0,
    loading: false,
    sortColumns: [{column: 'serverId', sortDirection: -1}],
    error: {}
};

export const transferServerListReducer = createReducer(
    initialState,

    // Initialize
    on(transferServerListActions.initialize, (state: TransferServerListState): TransferServerListState => ({...state, pageIndex: 0, pageSize: 10, loading: true})),

    // Transfer server list
    on(transferServerListActions.loadTransferServer, (state: TransferServerListState) => ({...state, loading: true})),
    on(transferServerListActions.loadTransferServerSuccess, (state: TransferServerListState, {listTransferServerCountersResponse}) => ({
        ...state,
        listTransferServerCountersResponse: listTransferServerCountersResponse,
        loading: false
    })),
    on(transferServerListActions.loadTransferServerFailure, (state: TransferServerListState, {error}) => ({...state, error: error, loading: false})),

    // Delete transfer server
    on(transferServerListActions.deleteTransferServer, (state: TransferServerListState) => ({...state, loading: true})),
    on(transferServerListActions.deleteTransferServerSuccess, (state: TransferServerListState) => ({...state, loading: false})),
    on(transferServerListActions.deleteTransferServerFailure, (state: TransferServerListState, {error}) => ({...state, error: error, loading: false})),
);