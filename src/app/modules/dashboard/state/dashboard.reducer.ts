// Hinzufügen:
import {createReducer, on} from "@ngrx/store";
import {sqsQueueListActions} from './dashboard.actions';
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {QueueItem} from "../../sqs/model/queue-item";

export const dashboardFeatureKey = 'dashboard';

export interface DashboardAppState {
    [dashboardFeatureKey]: DashboardState;
}

export interface DashboardState {
    error: unknown;
}

export const initialState: DashboardState = {
    error: {}
};

export const dashboardReducer = createReducer(
    initialState,

    on(sqsQueueListActions.loadQueues, (state: DashboardState, {}) =>
        ({
            ...state,
            loading: true,
        })),

    on(sqsQueueListActions.loadQueuesSuccess, (state: DashboardState, {queues}) => ({...state, queues, loading: false})),

    on(sqsQueueListActions.loadQueuesFailure, (state: DashboardState, {error}) => ({...state, error, loading: false})),
);