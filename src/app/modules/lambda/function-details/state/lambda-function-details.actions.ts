import {createAction, props} from '@ngrx/store';
import {LambdaFunctionItem} from "../../model/function-item";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {LambdaTagCountersResponse} from "../../model/lambda-tag-item";

export const lambdaFunctionDetailsActions = {
    initialize: createAction('[lambda-function-details] initialize'),

    // Load functions
    loadFunction: createAction('[lambda-function-details] Load function', props<{ name: string }>()),
    loadFunctionSuccess: createAction('[lambda-function-details] Load function success', props<{ functionItem: LambdaFunctionItem }>()),
    loadFunctionFailure: createAction('[lambda-function-details] Load function error', props<{ error: string }>()),

    // Load tags
    loadTags: createAction('[lambda-function-details] Load lambda tags', props<{ lambdaArn: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    loadTagsSuccess: createAction('[lambda-function-details] Load lambda tags success', props<{ tags: LambdaTagCountersResponse }>()),
    loadTagsFailure: createAction('[lambda-function-details] Load lambda tags error', props<{ error: string }>()),
}