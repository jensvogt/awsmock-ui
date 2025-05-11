import {createReducer, on} from "@ngrx/store";
import {transferServerDetailActions} from './transfer-server-detail.actions';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {TransferServerDetailsResponse} from "../../model/transfer-server-details";
import {TransferServerUsersResponse} from "../../model/transfer-server-users";
import {TransferServerProtocolsResponse} from "../../model/transfer-server-protocols";
import {TransferServerTagsResponse} from "../../model/transfer-server-tags";

export const transferServerDetailsFeatureKey = 'transfer-server-details';

export interface TransferServerDetailsState {

    transferServerDetails: TransferServerDetailsResponse;
    prefix: string;

    // Users
    users: TransferServerUsersResponse;
    userPageSize: number;
    userPageIndex: number;
    userSortColumns: SortColumn[];

    // Protocols
    protocols: TransferServerProtocolsResponse;
    protocolPageSize: number;
    protocolPageIndex: number;
    protocolSortColumns: SortColumn[];

    // Tags
    tags: TransferServerTagsResponse;
    tagPageSize: number;
    tagPageIndex: number;
    tagSortColumns: SortColumn[];

    loading: boolean;
    error: unknown;
}

export const initialState: TransferServerDetailsState = {

    transferServerDetails: {} as TransferServerDetailsResponse,
    prefix: '',

    // Users
    users: {} as TransferServerUsersResponse,
    userPageSize: 10,
    userPageIndex: 0,
    userSortColumns: [{column: 'name', sortDirection: -1}],

    // Protocols
    protocols: {} as TransferServerProtocolsResponse,
    protocolPageSize: 10,
    protocolPageIndex: 0,
    protocolSortColumns: [{column: 'name', sortDirection: -1}],

    // Tags
    tags: {} as TransferServerTagsResponse,
    tagPageSize: 10,
    tagPageIndex: 0,
    tagSortColumns: [{column: 'name', sortDirection: -1}],

    loading: false,
    error: {}
};

export const transferServerDetailReducer = createReducer(
    initialState,

    // Initialize
    on(transferServerDetailActions.initialize, (state: TransferServerDetailsState): TransferServerDetailsState => ({...state, loading: true})),

    // Transfer server list
    on(transferServerDetailActions.loadTransferServerDetails, (state: TransferServerDetailsState) => ({...state, loading: true})),
    on(transferServerDetailActions.loadTransferServerDetailsSuccess, (state: TransferServerDetailsState, {transferServerDetailsResponse}) => ({
        ...state,
        transferServerDetails: transferServerDetailsResponse,
        loading: false
    })),
    on(transferServerDetailActions.loadTransferServerDetailsFailure, (state: TransferServerDetailsState, {error}) => ({...state, error: error, loading: false})),

    // Transfer server user list
    on(transferServerDetailActions.loadUsers, (state: TransferServerDetailsState) => ({...state, loading: true})),
    on(transferServerDetailActions.loadUsersSuccess, (state: TransferServerDetailsState, {users}) => ({
        ...state,
        users: users,
        loading: false
    })),
    on(transferServerDetailActions.loadUsersFailure, (state: TransferServerDetailsState, {error}) => ({...state, error: error, loading: false})),

    // Transfer server protocol list
    on(transferServerDetailActions.loadProtocols, (state: TransferServerDetailsState) => ({...state, loading: true})),
    on(transferServerDetailActions.loadProtocolsSuccess, (state: TransferServerDetailsState, {protocols}) => ({
        ...state,
        protocols: protocols,
        loading: false
    })),
    on(transferServerDetailActions.loadProtocolsFailure, (state: TransferServerDetailsState, {error}) => ({...state, error: error, loading: false})),

    // Transfer server tag list
    on(transferServerDetailActions.loadTags, (state: TransferServerDetailsState) => ({...state, loading: true})),
    on(transferServerDetailActions.loadTagsSuccess, (state: TransferServerDetailsState, {tags}) => ({
        ...state,
        tags: tags,
        loading: false
    })),
    on(transferServerDetailActions.loadTagsFailure, (state: TransferServerDetailsState, {error}) => ({...state, error: error, loading: false})),

    // Delete transfer server
    // on(transferServerDetailActions.deleteTransferServer, (state: TransferServerDetailsState) => ({...state, loading: true})),
    // on(transferServerDetailActions.deleteTransferServerSuccess, (state: TransferServerDetailsState) => ({...state, loading: false})),
    // on(transferServerDetailActions.deleteTransferServerFailure, (state: TransferServerDetailsState, {error}) => ({...state, error: error, loading: false})),
);