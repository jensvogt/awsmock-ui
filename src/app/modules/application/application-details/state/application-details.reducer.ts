import {createReducer, on} from "@ngrx/store";
import {applicationDetailsActions} from './application-details.actions';
import {GetApplicationResponse} from "../../model/application-item";

export const applicationDetailFeatureKey = 'application-details';

export interface ApplicationDetailsState {
    getApplicationResponse: GetApplicationResponse;
    loading: boolean;
    error: unknown;

    // Environment
    // Environment: EnvironmentCountersResponse;
    // environmentPageSize: number,
    // environmentPageIndex: number,
    // environmentSortColumns: SortColumn[],

    // EventSource
    // EventSource: EventSourceCountersResponse;
    // eventSourcePageSize: number,
    // eventSourcePageIndex: number,
    // eventSourceSortColumns: SortColumn[],

    // Tags
    // Tags: TagCountersResponse;
    // tagPageSize: number,
    // tagPageIndex: number,
    // tagSortColumns: SortColumn[],

    // Instances
    // Instances: InstanceCountersResponse;
    // instancePageSize: number,
    // instancePageIndex: number,
    // instanceSortColumns: SortColumn[],
}

export const initialState: ApplicationDetailsState = {
    getApplicationResponse: {} as GetApplicationResponse,
    loading: false,
    error: {},

    // Environment
    // Environment: {} as EnvironmentCountersResponse,
    // environmentPageSize: 5,
    // environmentPageIndex: 0,
    // environmentSortColumns: [{column: 'key', sortDirection: -1}],

    // EventSource
    // EventSource: {} as EventSourceCountersResponse,
    // eventSourcePageSize: 5,
    // eventSourcePageIndex: 0,
    // eventSourceSortColumns: [{column: 'key', sortDirection: -1}],

    // Tags
    // Tags: {} as TagCountersResponse,
    // tagPageSize: 5,
    // tagPageIndex: 0,
    // tagSortColumns: [{column: 'key', sortDirection: -1}],

    // Instances
    // Instances: {} as InstanceCountersResponse,
    // instancePageSize: 5,
    // instancePageIndex: 0,
    // instanceSortColumns: [{column: 'key', sortDirection: -1}],
};

export const applicationDetailReducer = createReducer(
    initialState,

    // ApplicationDetailsState
    on(applicationDetailsActions.initialize, (state: ApplicationDetailsState): ApplicationDetailsState => ({
        ...state,
        loading: true
    })),

    // Application list
    on(applicationDetailsActions.loadApplication, (state: ApplicationDetailsState) => ({...state, loading: true})),
    on(applicationDetailsActions.loadApplicationSuccess, (state: ApplicationDetailsState, {getApplicationResponse}) => ({
        ...state,
        getApplicationResponse: getApplicationResponse,
        loading: false
    })),
    on(applicationDetailsActions.loadApplicationFailure, (state: ApplicationDetailsState, {error}) => ({...state, error: error, loading: false})),

    // //  environment
    // on(applicationDetailsActions.loadEnvironment, (state: ApplicationDetailsState) => ({...state, loading: true})),
    // on(applicationDetailsActions.loadEnvironmentSuccess, (state: ApplicationDetailsState, {environment}) => ({...state, Environment: environment, loading: false})),
    // on(applicationDetailsActions.loadEnvironmentFailure, (state: ApplicationDetailsState, {error}) => ({...state, error: error, loading: false})),
    //
    // //  tags
    // on(applicationDetailsActions.loadTags, (state: ApplicationDetailsState) => ({...state, loading: true})),
    // on(applicationDetailsActions.loadTagsSuccess, (state: ApplicationDetailsState, {tags}) => ({...state, Tags: tags, loading: false})),
    // on(applicationDetailsActions.loadTagsFailure, (state: ApplicationDetailsState, {error}) => ({...state, error: error, loading: false})),
    //
    // //  instances
    // on(applicationDetailsActions.loadInstances, (state: ApplicationDetailsState) => ({...state, loading: true})),
    // on(applicationDetailsActions.loadInstancesSuccess, (state: ApplicationDetailsState, {instances}) => ({...state, Instances: instances, loading: false})),
    // on(applicationDetailsActions.loadInstancesFailure, (state: ApplicationDetailsState, {error}) => ({...state, error: error, loading: false})),
    //
    // //  eventSource
    // on(applicationDetailsActions.loadEventSource, (state: ApplicationDetailsState) => ({...state, loading: true})),
    // on(applicationDetailsActions.loadEventSourceSuccess, (state: ApplicationDetailsState, {eventSource}) => ({...state, EventSource: eventSource, loading: false})),
    // on(applicationDetailsActions.loadEventSourceFailure, (state: ApplicationDetailsState, {error}) => ({...state, error: error, loading: false})),
);