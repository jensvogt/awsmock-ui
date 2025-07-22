import {createReducer, on} from "@ngrx/store";
import {lambdaFunctionDetailsActions} from './lambda-function-details.actions';
import {LambdaFunctionItem} from "../../model/lambda-item";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {LambdaTagCountersResponse} from "../../model/lambda-tag-item";
import {LambdaEnvironmentCountersResponse} from "../../model/lambda-environment-item";
import {LambdaInstanceCountersResponse} from "../../model/lambda-instance-item";
import {LambdaEventSourceCountersResponse} from "../../model/lambda-event-source-item";

export const lambdaFunctionDetailsFeatureKey = 'lambda-function-details';

export interface LambdaFunctionDetailsState {
    functionItem: LambdaFunctionItem;
    loading: boolean;
    error: unknown;

    // Environment
    lambdaEnvironment: LambdaEnvironmentCountersResponse;
    environmentPageSize: number,
    environmentPageIndex: number,
    environmentSortColumns: SortColumn[],

    // EventSource
    lambdaEventSource: LambdaEventSourceCountersResponse;
    eventSourcePageSize: number,
    eventSourcePageIndex: number,
    eventSourceSortColumns: SortColumn[],

    // Tags
    lambdaTags: LambdaTagCountersResponse;
    tagPageSize: number,
    tagPageIndex: number,
    tagSortColumns: SortColumn[],

    // Instances
    lambdaInstances: LambdaInstanceCountersResponse;
    instancePageSize: number,
    instancePageIndex: number,
    instanceSortColumns: SortColumn[],
}

export const initialState: LambdaFunctionDetailsState = {
    functionItem: {} as LambdaFunctionItem,
    loading: false,
    error: {},

    // Environment
    lambdaEnvironment: {} as LambdaEnvironmentCountersResponse,
    environmentPageSize: 5,
    environmentPageIndex: 0,
    environmentSortColumns: [{column: 'key', sortDirection: -1}],

    // EventSource
    lambdaEventSource: {} as LambdaEventSourceCountersResponse,
    eventSourcePageSize: 5,
    eventSourcePageIndex: 0,
    eventSourceSortColumns: [{column: 'key', sortDirection: -1}],

    // Tags
    lambdaTags: {} as LambdaTagCountersResponse,
    tagPageSize: 5,
    tagPageIndex: 0,
    tagSortColumns: [{column: 'key', sortDirection: -1}],

    // Instances
    lambdaInstances: {} as LambdaInstanceCountersResponse,
    instancePageSize: 5,
    instancePageIndex: 0,
    instanceSortColumns: [{column: 'lastStarted', sortDirection: -1}],
};

export const lambdaFunctionDetailsReducer = createReducer(
    initialState,

    // LambdaFunctionDetailsState
    on(lambdaFunctionDetailsActions.initialize, (state: LambdaFunctionDetailsState): LambdaFunctionDetailsState => ({
        ...state,
        loading: true
    })),

    // Function list
    on(lambdaFunctionDetailsActions.loadFunction, (state: LambdaFunctionDetailsState) => ({...state, loading: true})),
    on(lambdaFunctionDetailsActions.loadFunctionSuccess, (state: LambdaFunctionDetailsState, {functionItem}) => ({
        ...state,
        functionItem: functionItem,
        loading: false
    })),
    on(lambdaFunctionDetailsActions.loadFunctionFailure, (state: LambdaFunctionDetailsState, {error}) => ({...state, error: error, loading: false})),

    // Lambda environment
    on(lambdaFunctionDetailsActions.loadEnvironment, (state: LambdaFunctionDetailsState) => ({...state, loading: true})),
    on(lambdaFunctionDetailsActions.loadEnvironmentSuccess, (state: LambdaFunctionDetailsState, {environment}) => ({...state, lambdaEnvironment: environment, loading: false})),
    on(lambdaFunctionDetailsActions.loadEnvironmentFailure, (state: LambdaFunctionDetailsState, {error}) => ({...state, error: error, loading: false})),

    // Lambda tags
    on(lambdaFunctionDetailsActions.loadTags, (state: LambdaFunctionDetailsState) => ({...state, loading: true})),
    on(lambdaFunctionDetailsActions.loadTagsSuccess, (state: LambdaFunctionDetailsState, {tags}) => ({...state, lambdaTags: tags, loading: false})),
    on(lambdaFunctionDetailsActions.loadTagsFailure, (state: LambdaFunctionDetailsState, {error}) => ({...state, error: error, loading: false})),

    // Lambda instances
    on(lambdaFunctionDetailsActions.loadInstances, (state: LambdaFunctionDetailsState) => ({...state, loading: true})),
    on(lambdaFunctionDetailsActions.loadInstancesSuccess, (state: LambdaFunctionDetailsState, {instances}) => ({...state, lambdaInstances: instances, loading: false})),
    on(lambdaFunctionDetailsActions.loadInstancesFailure, (state: LambdaFunctionDetailsState, {error}) => ({...state, error: error, loading: false})),

    // Lambda eventSource
    on(lambdaFunctionDetailsActions.loadEventSource, (state: LambdaFunctionDetailsState) => ({...state, loading: true})),
    on(lambdaFunctionDetailsActions.loadEventSourceSuccess, (state: LambdaFunctionDetailsState, {eventSource}) => ({...state, lambdaEventSource: eventSource, loading: false})),
    on(lambdaFunctionDetailsActions.loadEventSourceFailure, (state: LambdaFunctionDetailsState, {error}) => ({...state, error: error, loading: false})),
);