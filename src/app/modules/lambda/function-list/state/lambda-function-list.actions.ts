import {createAction, props} from '@ngrx/store';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {LambdaFunctionCountersResponse} from "../../model/lambda-item";

export const lambdaFunctionListActions = {
    initialize: createAction('[lambda-function-list] initialize'),

    // Load functions
    loadFunctions: createAction('[lambda-function-list] Load functions', props<{ prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    loadFunctionsSuccess: createAction('[lambda-function-list] Load functions success', props<{ functions: LambdaFunctionCountersResponse }>()),
    loadFunctionsFailure: createAction('[lambda-function-list] Load functions error', props<{ error: string }>()),

    // Add function
    addFunction: createAction('[lambda-function-list] Add functions', props<{ functionName: string }>()),
    addFunctionSuccess: createAction('[lambda-function-list] Add functions success'),
    addFunctionFailure: createAction('[lambda-function-list] Add functions Error', props<{ error: string }>()),

    // ResetCounters
    resetCounters: createAction('[lambda-function-list] Reset counters', props<{ functionName: string }>()),
    resetCountersSuccess: createAction('[lambda-function-list] Reset counters success'),
    resetCountersFailure: createAction('[lambda-function-list] Reset counters error', props<{ error: string }>()),

    // start all lambda function
    startAllLambdas: createAction('[lambda-function-list] Start all lambda functions'),
    startAllLambdasSuccess: createAction('[lambda-function-list] Start all lambda functions success'),
    startAllLambdasFailure: createAction('[lambda-function-list] Start all lambda functions error', props<{ error: string }>()),

    // Stop all lambda function
    stopAllLambdas: createAction('[lambda-function-list] Stop all lambda functions'),
    stopAllLambdasSuccess: createAction('[lambda-function-list] Stop all lambda functions success'),
    stopAllLambdasFailure: createAction('[lambda-function-list] Stop all lambda functions error', props<{ error: string }>()),

    // Delete image
    deleteImage: createAction('[lambda-function-list] Delete function image', props<{ functionArn: string }>()),
    deleteImageSuccess: createAction('[lambda-function-list] Delete function image success'),
    deleteImageFailure: createAction('[lambda-function-list] Delete function image error', props<{ error: string }>()),

    // Delete function
    deleteFunction: createAction('[lambda-function-list] Delete function', props<{ functionName: string }>()),
    deleteFunctionSuccess: createAction('[lambda-function-list] Delete function success'),
    deleteFunctionFailure: createAction('[lambda-function-list] Delete function error', props<{ error: string }>()),
}