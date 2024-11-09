import {createReducer, on} from "@ngrx/store";
import {lambdaFunctionDetailsActions} from './lambda-function-details.actions';
import {LambdaFunctionItem} from "../../model/function-item";

export const lambdaFunctionDetailsFeatureKey = 'lambda-function-details';

export interface LambdaFunctionDetailsState {
    functionItem: LambdaFunctionItem;
    loading: boolean;
    error: unknown;
}

export const initialState: LambdaFunctionDetailsState = {
    functionItem: {} as LambdaFunctionItem,
    loading: false,
    error: {}
};

export const lambdaFunctionDetailsReducer = createReducer(
    initialState,

    // LambdaFunctionDetailsState
    on(lambdaFunctionDetailsActions.initialize, (state: LambdaFunctionDetailsState): LambdaFunctionDetailsState => ({
        ...state,
        loading: true
    })),

    // Bucket list
    on(lambdaFunctionDetailsActions.loadFunction, (state: LambdaFunctionDetailsState) => ({...state, loading: true})),
    on(lambdaFunctionDetailsActions.loadFunctionSuccess, (state: LambdaFunctionDetailsState, {functionItem}) => ({
        ...state,
        functionItem: functionItem,
        loading: false
    })),
    on(lambdaFunctionDetailsActions.loadFunctionFailure, (state: LambdaFunctionDetailsState, {error}) => ({...state, error: error, loading: false})),

    // Add bucket
    //on(lambdaFunctionDetailsActions.addFunction, (state: LambdaFunctionDetailsState) => ({...state, loading: true})),
    //on(lambdaFunctionDetailsActions.addFunctionSuccess, (state: LambdaFunctionDetailsState) => ({...state, loading: false})),
    //on(lambdaFunctionDetailsActions.addFunctionFailure, (state: LambdaFunctionDetailsState, {error}) => ({...state, error: error, loading: false})),
);