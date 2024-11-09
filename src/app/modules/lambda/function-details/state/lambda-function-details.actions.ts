import {createAction, props} from '@ngrx/store';
import {LambdaFunctionItem} from "../../model/function-item";

export const lambdaFunctionDetailsActions = {
    initialize: createAction('[lambda-function-details] initialize'),

    // Load functions
    loadFunction: createAction('[lambda-function-details] Load function', props<{ name: string }>()),
    loadFunctionSuccess: createAction('[lambda-function-details] Load function success', props<{ functionItem: LambdaFunctionItem }>()),
    loadFunctionFailure: createAction('[lambda-function-details] Load function error', props<{ error: string }>()),
}