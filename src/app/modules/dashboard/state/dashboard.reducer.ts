import {createReducer} from "@ngrx/store";

export const dashboardFeatureKey = 'dashboard';

export interface DashboardState {
    loading: boolean;
    error: unknown;
}

export const initialState: DashboardState = {
    loading: false,
    error: {}
};

export const dashboardReducer = createReducer(
    initialState,

    /*on(dashboardFeatureKey.loadQueues, (state: DashboardState, {}) =>
        ({
            ...state,
            error: '',
        })),

    on(dashboardFeatureKey.loadQueuesSuccess, (state: DashboardState, {}) => ({...state, queues, loading: false})),

    on(dashboardFeatureKey.loadQueuesFailure, (state: DashboardState, {error}) => ({...state, error, loading: false})),*/
);