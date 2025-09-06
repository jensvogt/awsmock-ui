import {createReducer, on} from "@ngrx/store";
import {restApiListActions} from './rest-api-list.actions';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {ListRestApiCountersResponse} from "../../model/rest-api-item";

export const restApisListFeatureKey = 'rest-api-list';

export interface RestApisListState {
    listRestApisResponse: ListRestApiCountersResponse;
    prefix: string;
    pageSize: number;
    pageIndex: number;
    sortColumns: SortColumn[];
    error: unknown;
}

export const initialState: RestApisListState = {
    listRestApisResponse: {} as ListRestApiCountersResponse,
    prefix: '',
    pageSize: 10,
    pageIndex: 0,
    sortColumns: [{column: 'name', sortDirection: 1}],
    error: {}
};

export const restApiListReducer = createReducer(
    initialState,

    // Initialize
    on(restApiListActions.initialize, (state: RestApisListState): RestApisListState => ({...state, pageIndex: 0, pageSize: 10})),

    // Load application
    on(restApiListActions.loadRestApis, (state: RestApisListState) => ({...state, loading: true})),
    on(restApiListActions.loadRestApisSuccess, (state: RestApisListState, {restApis}) => ({...state, listRestApisResponse: restApis, loading: false})),
    on(restApiListActions.loadRestApisFailure, (state: RestApisListState, {error}) => ({...state, error: error})),

    // Load application
    on(restApiListActions.addRestApi, (state: RestApisListState) => ({...state, loading: true})),
    on(restApiListActions.addRestApiSuccess, (state: RestApisListState, {}) => ({...state, loading: false})),
    on(restApiListActions.addRestApiFailure, (state: RestApisListState, {error}) => ({...state, error: error})),
);