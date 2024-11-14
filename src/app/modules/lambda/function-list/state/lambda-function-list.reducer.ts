import {createReducer, on} from "@ngrx/store";
import {lambdaFunctionListActions} from './lambda-function-list.actions';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {LambdaFunctionCountersResponse} from "../../model/function-item";

export const lambdaFunctionListFeatureKey = 'lambda-function-list';

export interface LambdaFunctionListState {
    functionCounters: LambdaFunctionCountersResponse;
    name: string,
    prefix: string;
    pageSize: number;
    pageIndex: number;
    loading: boolean;
    sortColumns: SortColumn[];
    total: number;
    error: unknown;
}

export const initialState: LambdaFunctionListState = {
    functionCounters: {total: 0, functionCounters: []},
    name: '',
    prefix: '',
    pageSize: 10,
    pageIndex: 0,
    loading: false,
    sortColumns: [{column: 'name', sortDirection: -1}],
    total: 0,
    error: {}
};

export const lambdaFunctionListReducer = createReducer(
    initialState,

    // Initialize
    on(lambdaFunctionListActions.initialize, (state: LambdaFunctionListState): LambdaFunctionListState => ({...state, pageIndex: 0, pageSize: 10, loading: true})),

    // Function list
    on(lambdaFunctionListActions.loadFunctions, (state: LambdaFunctionListState) => ({...state, loading: true})),
    on(lambdaFunctionListActions.loadFunctionsSuccess, (state: LambdaFunctionListState, {functions}) => ({...state, functionCounters: functions, loading: false})),
    on(lambdaFunctionListActions.loadFunctionsFailure, (state: LambdaFunctionListState, {error}) => ({...state, error: error, loading: false})),

    // Add function
    on(lambdaFunctionListActions.addFunction, (state: LambdaFunctionListState) => ({...state, loading: true})),
    on(lambdaFunctionListActions.addFunctionSuccess, (state: LambdaFunctionListState) => ({...state, loading: false})),
    on(lambdaFunctionListActions.addFunctionFailure, (state: LambdaFunctionListState, {error}) => ({...state, error: error, loading: false})),

    // Reset counters
    on(lambdaFunctionListActions.resetCounters, (state: LambdaFunctionListState) => ({...state, loading: true})),
    on(lambdaFunctionListActions.resetCountersSuccess, (state: LambdaFunctionListState) => ({...state, loading: false})),
    on(lambdaFunctionListActions.resetCountersFailure, (state: LambdaFunctionListState, {error}) => ({...state, error: error, loading: false})),
);