import {createReducer, on} from "@ngrx/store";
import {apiKeyListActions} from './api-key-list.actions';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {ListApiKeyCountersResponse} from "../../model/api-key-item";

export const apiKeysListFeatureKey = 'api-key-list';

export interface ApiKeysListState {
    listApiKeysResponse: ListApiKeyCountersResponse;
    prefix: string;
    pageSize: number;
    pageIndex: number;
    sortColumns: SortColumn[];
    error: unknown;
}

export const initialState: ApiKeysListState = {
    listApiKeysResponse: {} as ListApiKeyCountersResponse,
    prefix: '',
    pageSize: 10,
    pageIndex: 0,
    sortColumns: [{column: 'name', sortDirection: 1}],
    error: {}
};

export const apiKeyListReducer = createReducer(
    initialState,

    // Initialize
    on(apiKeyListActions.initialize, (state: ApiKeysListState): ApiKeysListState => ({...state, pageIndex: 0, pageSize: 10})),

    // Load application
    on(apiKeyListActions.loadApiKeys, (state: ApiKeysListState) => ({...state, loading: true})),
    on(apiKeyListActions.loadApiKeysSuccess, (state: ApiKeysListState, {apiKeys}) => ({...state, listApiKeysResponse: apiKeys, loading: false})),
    on(apiKeyListActions.loadApiKeysFailure, (state: ApiKeysListState, {error}) => ({...state, error: error})),

    // Load application
    on(apiKeyListActions.addApiKey, (state: ApiKeysListState) => ({...state, loading: true})),
    on(apiKeyListActions.addApiKeySuccess, (state: ApiKeysListState, {}) => ({...state, loading: false})),
    on(apiKeyListActions.addApiKeyFailure, (state: ApiKeysListState, {error}) => ({...state, error: error})),
);