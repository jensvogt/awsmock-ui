import {createAction, props} from '@ngrx/store';
import {LambdaFunctionItem} from "../../model/lambda-item";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {LambdaTagCountersResponse} from "../../model/lambda-tag-item";
import {LambdaEnvironmentCountersResponse} from "../../model/lambda-environment-item";
import {LambdaInstanceCountersResponse} from "../../model/lambda-instance-item";
import {LambdaEventSourceCountersResponse} from "../../model/lambda-event-source-item";

export const lambdaFunctionDetailsActions = {
    initialize: createAction('[lambda-function-details] initialize'),

    // Load functions
    loadFunction: createAction('[lambda-function-details] Load function', props<{ name: string }>()),
    loadFunctionSuccess: createAction('[lambda-function-details] Load function success', props<{ functionItem: LambdaFunctionItem }>()),
    loadFunctionFailure: createAction('[lambda-function-details] Load function error', props<{ error: string }>()),

    // Load environment
    loadEnvironment: createAction('[lambda-function-details] Load lambda environments', props<{ lambdaArn: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    loadEnvironmentSuccess: createAction('[lambda-function-details] Load lambda environments success', props<{ environment: LambdaEnvironmentCountersResponse }>()),
    loadEnvironmentFailure: createAction('[lambda-function-details] Load lambda environments error', props<{ error: string }>()),

    // Load tags
    loadTags: createAction('[lambda-function-details] Load lambda tags', props<{ lambdaArn: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    loadTagsSuccess: createAction('[lambda-function-details] Load lambda tags success', props<{ tags: LambdaTagCountersResponse }>()),
    loadTagsFailure: createAction('[lambda-function-details] Load lambda tags error', props<{ error: string }>()),

    // Load instances
    loadInstances: createAction('[lambda-function-details] Load lambda instances', props<{ lambdaArn: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    loadInstancesSuccess: createAction('[lambda-function-details] Load lambda instances success', props<{ instances: LambdaInstanceCountersResponse }>()),
    loadInstancesFailure: createAction('[lambda-function-details] Load lambda instances error', props<{ error: string }>()),

    // Load event souirces
    loadEventSource: createAction('[lambda-function-details] Load lambda event sources', props<{ lambdaArn: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    loadEventSourceSuccess: createAction('[lambda-function-details] Load lambda event sources success', props<{ eventSource: LambdaEventSourceCountersResponse }>()),
    loadEventSourceFailure: createAction('[lambda-function-details] Load lambda event sources error', props<{ error: string }>()),
}