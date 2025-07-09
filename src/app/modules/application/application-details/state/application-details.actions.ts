import {createAction, props} from '@ngrx/store';
import {GetApplicationRequest, GetApplicationResponse, UpdateApplicationRequest} from "../../model/application-item";

export const applicationDetailsActions = {
    initialize: createAction('[application-details] initialize'),

    // Load applications
    loadApplication: createAction('[application-details] Load application', props<{ request: GetApplicationRequest }>()),
    loadApplicationSuccess: createAction('[application-details] Load application success', props<{ getApplicationResponse: GetApplicationResponse }>()),
    loadApplicationFailure: createAction('[application-details] Load application error', props<{ error: string }>()),

    // Update applications
    updateApplication: createAction('[application-details] Update application', props<{ request: UpdateApplicationRequest }>()),
    updateApplicationSuccess: createAction('[application-details] Update application success', props<{ getApplicationResponse: GetApplicationResponse }>()),
    updateApplicationFailure: createAction('[application-details] Update application error', props<{ error: string }>()),

    // Load environment
    // loadEnvironment: createAction('[application-details] Load lambda environments', props<{ lambdaArn: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    // loadEnvironmentSuccess: createAction('[application-details] Load lambda environments success', props<{ environment: LambdaEnvironmentCountersResponse }>()),
    // loadEnvironmentFailure: createAction('[application-details] Load lambda environments error', props<{ error: string }>()),

    // Load tags
    // loadTags: createAction('[application-details] Load lambda tags', props<{ lambdaArn: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    // loadTagsSuccess: createAction('[application-details] Load lambda tags success', props<{ tags: LambdaTagCountersResponse }>()),
    // loadTagsFailure: createAction('[application-details] Load lambda tags error', props<{ error: string }>()),

    // Load instances
    // loadInstances: createAction('[application-details] Load lambda instances', props<{ lambdaArn: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    // loadInstancesSuccess: createAction('[application-details] Load lambda instances success', props<{ instances: LambdaInstanceCountersResponse }>()),
    // loadInstancesFailure: createAction('[application-details] Load lambda instances error', props<{ error: string }>()),

    // Load event souirces
    // loadEventSource: createAction('[application-details] Load lambda event sources', props<{ lambdaArn: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    // loadEventSourceSuccess: createAction('[application-details] Load lambda event sources success', props<{ eventSource: LambdaEventSourceCountersResponse }>()),
    // loadEventSourceFailure: createAction('[application-details] Load lambda event sources error', props<{ error: string }>()),
}