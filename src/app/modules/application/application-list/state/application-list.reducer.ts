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
    sortColumns: [{column: 'name', sortDirection: -1}],
    error: {}
};

export const applicationListReducer = createReducer(
    initialState,

    // Initialize
    on(applicationListActions.initialize, (state: ApplicationListState): ApplicationListState => ({...state, pageIndex: 0, pageSize: 10, loading: true, reload: false,})),

    // Parameter list
    on(applicationListActions.loadApplications, (state: ApplicationListState) => ({...state, loading: true, reload: false})),
    on(applicationListActions.loadApplicationsSuccess, (state: ApplicationListState, {applications}) => ({...state, listApplicationResponse: applications, loading: false, reload: false})),
    on(applicationListActions.loadApplicationsFailure, (state: ApplicationListState, {error}) => ({...state, error: error, loading: false, reload: false})),

    // Add parameter
    // on(applicationListActions.createParameter, (state: ApplicationListState) => ({...state, loading: true})),
    // on(applicationListActions.createParameterSuccess, (state: ApplicationListState, {parameters}) => ({...state, listParameterResponse: parameters, loading: false, reload: true})),
    // on(applicationListActions.createParameterFailure, (state: ApplicationListState, {error}) => ({...state, error: error, loading: false, reload: true})),

    // Delete application
    on(applicationListActions.deleteApplication, (state: ApplicationListState) => ({...state, loading: true})),
    on(applicationListActions.deleteApplicationSuccess, (state: ApplicationListState, {applications}) => ({...state, listApplicationResponse: applications, loading: false, reload: true})),
    on(applicationListActions.deleteApplicationFailure, (state: ApplicationListState, {error}) => ({...state, error: error, loading: false, reload: true})),
);