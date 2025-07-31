import {createReducer, on} from "@ngrx/store";
import {applicationListActions} from './application-list.actions';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {ListApplicationCountersResponse} from "../../model/application-item";

export const applicationListFeatureKey = 'application-list';

export interface ApplicationListState {
    listApplicationResponse: ListApplicationCountersResponse;
    prefix: string;
    pageSize: number;
    pageIndex: number;
    loading: boolean;
    reload: boolean,
    sortColumns: SortColumn[];
    error: unknown;
}

export const initialState: ApplicationListState = {
    listApplicationResponse: {} as ListApplicationCountersResponse,
    prefix: '',
    pageSize: 10,
    pageIndex: 0,
    loading: false,
    reload: false,
    sortColumns: [{column: 'name', sortDirection: 1}],
    error: {}
};

export const applicationListReducer = createReducer(
    initialState,

    // Initialize
    on(applicationListActions.initialize, (state: ApplicationListState): ApplicationListState => ({...state, pageIndex: 0, pageSize: 10, loading: true, reload: false,})),

    // Load application
    on(applicationListActions.loadApplications, (state: ApplicationListState) => ({...state, loading: true, reload: false})),
    on(applicationListActions.loadApplicationsSuccess, (state: ApplicationListState, {applications}) => ({...state, listApplicationResponse: applications, loading: false})),
    on(applicationListActions.loadApplicationsFailure, (state: ApplicationListState, {error}) => ({...state, error: error, loading: false})),

    // Start application
    on(applicationListActions.startApplication, (state: ApplicationListState) => ({...state, loading: true})),
    on(applicationListActions.startApplicationSuccess, (state: ApplicationListState, {applications}) => ({...state, listApplicationResponse: applications, loading: false})),
    on(applicationListActions.startApplicationFailure, (state: ApplicationListState, {error}) => ({...state, error: error, loading: false})),

    // Start all applications
    on(applicationListActions.startAllApplications, (state: ApplicationListState) => ({...state, loading: true})),
    on(applicationListActions.startAllApplicationsSuccess, (state: ApplicationListState, {applications}) => ({...state, listApplicationResponse: applications, loading: false})),
    on(applicationListActions.startAllApplicationsFailure, (state: ApplicationListState, {error}) => ({...state, error: error, loading: false})),

    // Stop application
    on(applicationListActions.stopApplication, (state: ApplicationListState) => ({...state, loading: true})),
    on(applicationListActions.stopApplicationSuccess, (state: ApplicationListState, {applications}) => ({...state, listApplicationResponse: applications, loading: false})),
    on(applicationListActions.stopApplicationFailure, (state: ApplicationListState, {error}) => ({...state, error: error, loading: false})),

    // Stop all applications
    on(applicationListActions.stopAllApplications, (state: ApplicationListState) => ({...state, loading: true})),
    on(applicationListActions.stopAllApplicationsSuccess, (state: ApplicationListState, {applications}) => ({...state, listApplicationResponse: applications, loading: false})),
    on(applicationListActions.stopAllApplicationsFailure, (state: ApplicationListState, {error}) => ({...state, error: error, loading: false})),

    // Rebuild application
    on(applicationListActions.rebuildApplication, (state: ApplicationListState) => ({...state, loading: true})),
    on(applicationListActions.rebuildApplicationSuccess, (state: ApplicationListState, {applications}) => ({...state, listApplicationResponse: applications, loading: false})),
    on(applicationListActions.rebuildApplicationFailure, (state: ApplicationListState, {error}) => ({...state, error: error, loading: false})),

    // Delete application
    on(applicationListActions.deleteApplication, (state: ApplicationListState) => ({...state, loading: true})),
    on(applicationListActions.deleteApplicationSuccess, (state: ApplicationListState, {applications}) => ({...state, listApplicationResponse: applications, loading: false})),
    on(applicationListActions.deleteApplicationFailure, (state: ApplicationListState, {error}) => ({...state, error: error, loading: false})),
);