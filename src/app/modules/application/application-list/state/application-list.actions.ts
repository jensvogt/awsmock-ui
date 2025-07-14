import {createAction, props} from '@ngrx/store';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {AddApplicationRequest, DeleteApplicationRequest, ListApplicationCountersResponse, RebuildApplicationRequest, StartApplicationRequest, StopApplicationRequest} from "../../model/application-item";

export const applicationListActions = {
    initialize: createAction('[application-list] initialize'),

    // Load application
    loadApplications: createAction('[application-list] Load applications', props<{ prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    loadApplicationsSuccess: createAction('[application-list] Load applications success', props<{ applications: ListApplicationCountersResponse }>()),
    loadApplicationsFailure: createAction('[application-list] Load applications error', props<{ error: string }>()),

    // Add application
    addApplication: createAction('[application-list] Add application', props<{ request: AddApplicationRequest }>()),
    addApplicationSuccess: createAction('[application-list] Add application success', props<{ applications: ListApplicationCountersResponse }>()),
    addApplicationFailure: createAction('[application-list] Add application error', props<{ error: string }>()),

    // rebuild application
    rebuildApplication: createAction('[application-list] Rebuild application', props<{ request: RebuildApplicationRequest }>()),
    rebuildApplicationSuccess: createAction('[application-list] Rebuild application success', props<{ applications: ListApplicationCountersResponse }>()),
    rebuildApplicationFailure: createAction('[application-list] Rebuild application error', props<{ error: string }>()),

    // Start application
    startApplication: createAction('[application-list] Start application', props<{ request: StartApplicationRequest }>()),
    startApplicationSuccess: createAction('[application-list] Start application success', props<{ applications: ListApplicationCountersResponse }>()),
    startApplicationFailure: createAction('[application-list] Start application error', props<{ error: string }>()),

    // Stop application
    stopApplication: createAction('[application-list] Stop application', props<{ request: StopApplicationRequest }>()),
    stopApplicationSuccess: createAction('[application-list] Stop application success', props<{ applications: ListApplicationCountersResponse }>()),
    stopApplicationFailure: createAction('[application-list] Stop application error', props<{ error: string }>()),

    // Delete application
    deleteApplication: createAction('[application-list] Delete application', props<{ request: DeleteApplicationRequest }>()),
    deleteApplicationSuccess: createAction('[application-list] Delete application success', props<{ applications: ListApplicationCountersResponse }>()),
    deleteApplicationFailure: createAction('[application-list] Delete application error', props<{ error: string }>()),
}