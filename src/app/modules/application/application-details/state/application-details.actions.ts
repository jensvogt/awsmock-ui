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
}