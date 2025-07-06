import {createAction, props} from '@ngrx/store';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {AddApplicationRequest, ListApplicationCountersResponse} from "../../model/application-item";

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

    // Update parameter
    // updateParameter: createAction('[application-list] Update parameter', props<{ request: UpdateParameterCounterRequest }>()),
    // updateParameterSuccess: createAction('[application-list] Update parameter success', props<{ parameters: ListParameterCountersResponse }>()),
    // updateParameterFailure: createAction('[application-list] Update parameter error', props<{ error: string }>()),

    // Delete parameter
    // deleteParameter: createAction('[application-list] Delete parameter', props<{ name: string, prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    // deleteParameterSuccess: createAction('[application-list] Delete parameter success', props<{ parameters: ListParameterCountersResponse }>()),
    // deleteParameterFailure: createAction('[application-list] Delete parameter error', props<{ error: string }>()),
}