import {createAction, props} from '@ngrx/store';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {AddApplicationRequest, DeleteApplicationRequest, ListApplicationCountersResponse, RebuildApplicationRequest, RestartApplicationRequest, StartApplicationRequest, StopApplicationRequest} from "../../model/application-item";

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

    // Restart application
    restartApplication: createAction('[application-list] Restart application', props<{ request: RestartApplicationRequest }>()),
    restartApplicationSuccess: createAction('[application-list] Restart application success'),
    restartApplicationFailure: createAction('[application-list] Restart application error', props<{ error: string }>()),

    // Rebuild application
    rebuildApplication: createAction('[application-list] Rebuild application', props<{ request: RebuildApplicationRequest }>()),
    rebuildApplicationSuccess: createAction('[application-list] Rebuild application success'),
    rebuildApplicationFailure: createAction('[application-list] Rebuild application error', props<{ error: string }>()),

    // Start application
    startApplication: createAction('[application-list] Start application', props<{ request: StartApplicationRequest }>()),
    startApplicationSuccess: createAction('[application-list] Start application success'),
    startApplicationFailure: createAction('[application-list] Start application error', props<{ error: string }>()),

    // Stop application
    stopApplication: createAction('[application-list] Stop application', props<{ request: StopApplicationRequest }>()),
    stopApplicationSuccess: createAction('[application-list] Stop application success'),
    stopApplicationFailure: createAction('[application-list] Stop application error', props<{ error: string }>()),

    // Start all application
    startAllApplications: createAction('[application-list] Start all applications'),
    startAllApplicationsSuccess: createAction('[application-list] Start all applications success'),
    startAllApplicationsFailure: createAction('[application-list] Start all applications error', props<{ error: string }>()),

    // Stop all application
    stopAllApplications: createAction('[application-list] Stop all applications'),
    stopAllApplicationsSuccess: createAction('[application-list] Stop all applications success'),
    stopAllApplicationsFailure: createAction('[application-list] Stop all applications error', props<{ error: string }>()),

    // Restart all application
    restartAllApplications: createAction('[application-list] Restart all applications'),
    restartAllApplicationsSuccess: createAction('[application-list] Restart all applications success'),
    restartAllApplicationsFailure: createAction('[application-list] Restart all applications error', props<{ error: string }>()),

    // Delete application
    deleteApplication: createAction('[application-list] Delete application', props<{ request: DeleteApplicationRequest }>()),
    deleteApplicationSuccess: createAction('[application-list] Delete application success', props<{ applications: ListApplicationCountersResponse }>()),
    deleteApplicationFailure: createAction('[application-list] Delete application error', props<{ error: string }>()),
}