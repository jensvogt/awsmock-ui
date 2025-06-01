import {createReducer, on} from "@ngrx/store";
import {secretListActions} from './secret-list.actions';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {ListSecretCountersResponse} from "../../model/secret-item";

export const secretListFeatureKey = 'secret-list';

export interface SecretListState {
    listSecretResponse: ListSecretCountersResponse;
    prefix: string;
    pageSize: number;
    pageIndex: number;
    loading: boolean;
    reload: boolean,
    sortColumns: SortColumn[];
    error: unknown;
}

export const initialState: SecretListState = {
    listSecretResponse: {total: 0, secretCounters: []},
    prefix: '',
    pageSize: 10,
    pageIndex: 0,
    loading: false,
    reload: false,
    sortColumns: [{column: 'attributes.approximateNumberOfMessages', sortDirection: -1}, {column: 'secretName', sortDirection: 1}],
    error: {}
};

export const secretListReducer = createReducer(
    initialState,

    // Initialize
    on(secretListActions.initialize, (state: SecretListState): SecretListState => ({
        ...state,
        pageIndex: 0,
        pageSize: 10,
        loading: true,
        reload: false,
    })),

    // Secret list
    on(secretListActions.loadSecrets, (state: SecretListState) => ({...state, loading: true, reload: false})),
    on(secretListActions.loadSecretsSuccess, (state: SecretListState, {secrets}) => ({
        ...state,
        listSecretResponse: secrets,
        loading: false,
        reload: false
    })),
    on(secretListActions.loadSecretsFailure, (state: SecretListState, {error}) => ({...state, error: error, loading: false, reload: false})),

    // Add secret
    on(secretListActions.createSecret, (state: SecretListState) => ({...state, loading: true})),
    on(secretListActions.createSecretSuccess, (state: SecretListState) => ({...state, loading: false, reload: true})),
    on(secretListActions.createSecretFailure, (state: SecretListState, {error}) => ({...state, error: error, loading: false, reload: false})),

    // Delete secret
    on(secretListActions.deleteSecret, (state: SecretListState) => ({...state, loading: true})),
    on(secretListActions.deleteSecretSuccess, (state: SecretListState) => ({...state, loading: false, reload: true})),
    on(secretListActions.deleteSecretFailure, (state: SecretListState, {error}) => ({...state, error: error, loading: false, reload: true})),
);