import {createAction, props} from '@ngrx/store';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {LambdaFunctionCountersResponse} from "../../model/function-item";

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

    // Delete function
    deleteFunction: createAction('[lambda-function-list] Delete functions', props<{ functionName: string }>()),
    deleteFunctionSuccess: createAction('[lambda-function-list] Delete functions success'),
    deleteFunctionFailure: createAction('[lambda-function-list] Delete functions error', props<{ error: string }>()),
}