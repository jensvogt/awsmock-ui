import {createReducer, on} from "@ngrx/store";
import {lambdaFunctionDetailsActions} from './lambda-function-details.actions';
import {LambdaFunctionItem} from "../../model/lambda-item";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {LambdaTagCountersResponse} from "../../model/lambda-tag-item";
import {LambdaEnvironmentCountersResponse} from "../../model/lambda-environment-item";

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

    // Tags
    lambdaTags: LambdaTagCountersResponse;
    tagPageSize: number,
    tagPageIndex: number,
    tagSortColumns: SortColumn[],
}

export const initialState: LambdaFunctionDetailsState = {
    functionItem: {} as LambdaFunctionItem,
    loading: false,
    error: {},

    // Environment
    lambdaEnvironment: {} as LambdaEnvironmentCountersResponse,
    environmentPageSize: 10,
    environmentPageIndex: 0,
    environmentSortColumns: [{column: 'key', sortDirection: -1}],

    // Tags
    lambdaTags: {} as LambdaTagCountersResponse,
    tagPageSize: 10,
    tagPageIndex: 0,
    tagSortColumns: [{column: 'key', sortDirection: -1}],
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
    on(lambdaFunctionDetailsActions.loadEnvironmentSuccess, (state: LambdaFunctionDetailsState, {environment}) => ({...state, lambdaEnvironments: environment, loading: false})),
    on(lambdaFunctionDetailsActions.loadEnvironmentFailure, (state: LambdaFunctionDetailsState, {error}) => ({...state, error: error, loading: false})),

    // Lambda tags
    on(lambdaFunctionDetailsActions.loadTags, (state: LambdaFunctionDetailsState) => ({...state, loading: true})),
    on(lambdaFunctionDetailsActions.loadTagsSuccess, (state: LambdaFunctionDetailsState, {tags}) => ({...state, lambdaTags: tags, loading: false})),
    on(lambdaFunctionDetailsActions.loadTagsFailure, (state: LambdaFunctionDetailsState, {error}) => ({...state, error: error, loading: false})),
);