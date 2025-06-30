import {createReducer, on} from "@ngrx/store";
import {ssmParameterListActions} from './ssm-parameter-list.actions';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {ListParameterCountersResponse} from "../../model/ssm-parameter-item";

export const ssmParameterListFeatureKey = 'ssm-parameter-list';

export interface SsmParameterListState {
    listParameterResponse: ListParameterCountersResponse;
    prefix: string;
    pageSize: number;
    pageIndex: number;
    loading: boolean;
    reload: boolean,
    sortColumns: SortColumn[];
    error: unknown;
}

export const initialState: SsmParameterListState = {
    listParameterResponse: {total: 0, parameterCounters: []},
    prefix: '',
    pageSize: 10,
    pageIndex: 0,
    loading: false,
    reload: false,
    sortColumns: [{column: 'name', sortDirection: -1}],
    error: {}
};

export const ssmParameterListReducer = createReducer(
    initialState,

    // Initialize
    on(ssmParameterListActions.initialize, (state: SsmParameterListState): SsmParameterListState => ({...state, pageIndex: 0, pageSize: 10, loading: true, reload: false,})),

    // Parameter list
    on(ssmParameterListActions.loadParameters, (state: SsmParameterListState) => ({...state, loading: true, reload: false})),
    on(ssmParameterListActions.loadParametersSuccess, (state: SsmParameterListState, {parameters}) => ({...state, listParameterResponse: parameters, loading: false, reload: false})),
    on(ssmParameterListActions.loadParametersFailure, (state: SsmParameterListState, {error}) => ({...state, error: error, loading: false, reload: false})),

    // Delete parameter
    on(ssmParameterListActions.deleteParameter, (state: SsmParameterListState) => ({...state, loading: true})),
    on(ssmParameterListActions.deleteParameterSuccess, (state: SsmParameterListState, {parameters}) => ({...state, listParameterResponse: parameters, loading: false, reload: true})),
    on(ssmParameterListActions.deleteParameterFailure, (state: SsmParameterListState, {error}) => ({...state, error: error, loading: false, reload: true})),

    /*
        // Add queue
        on(ssmParameterListActions.createQueue, (state: SsmParameterListState) => ({...state, loading: true})),
        on(ssmParameterListActions.createQueueSuccess, (state: SsmParameterListState) => ({...state, loading: false, reload: true})),
        on(ssmParameterListActions.createQueueFailure, (state: SsmParameterListState, {error}) => ({...state, error: error, loading: false, reload: false})),

        // Purge queue
        on(ssmParameterListActions.purgeQueue, (state: SsmParameterListState) => ({...state, loading: true})),
        on(ssmParameterListActions.purgeQueueSuccess, (state: SsmParameterListState) => ({...state, loading: false, reload: true})),
        on(ssmParameterListActions.purgeQueueFailure, (state: SsmParameterListState, {error}) => ({...state, error: error, loading: false, reload: false})),

        // Delete queue
        on(ssmParameterListActions.deleteQueue, (state: SsmParameterListState) => ({...state, loading: true})),
        on(ssmParameterListActions.deleteQueueSuccess, (state: SsmParameterListState) => ({...state, loading: false, reload: true})),
        on(ssmParameterListActions.deleteQueueFailure, (state: SsmParameterListState, {error}) => ({...state, error: error, loading: false, reload: true})),*/
);