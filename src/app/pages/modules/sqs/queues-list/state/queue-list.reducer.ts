// Hinzufügen:
import {QueueItem} from "../../model/queue-item";
import {createReducer, on} from "@ngrx/store";
import {sqsQueueListActions} from './queue-list.actions';
import {SortColumn} from "../../../../../shared/sorting/sorting.component";

export const sqsQueueListFeatureKey = 'sqs-queue-list';

export interface SQSQueueListAppState {
    [sqsQueueListFeatureKey]: SQSQueueListState;
}

export interface SQSQueueListState {
    queues: QueueItem[];
    prefix: string,
    pageSize: number;
    pageIndex: number;
    loading: boolean;
    sortColumns: SortColumn[];
    error: unknown;
}

export const initialState: SQSQueueListState = {
    queues: [],
    prefix: '',
    pageSize: 10,
    pageIndex: 0,
    loading: false,
    sortColumns: [],
    error: {}
};

export const queueListReducer = createReducer(
    initialState,

    on(sqsQueueListActions.loadQueues, (state: SQSQueueListState, {prefix, pageIndex, pageSize, sortColumns}) =>
        ({
            ...state,
            loading: true,
            prefix,
            pageSize,
            pageIndex,
            sortColumns
        })),

    on(sqsQueueListActions.loadQueuesSuccess, (state: SQSQueueListState, {queues}) => ({...state, queues, loading: false})),

    on(sqsQueueListActions.loadQueuesFailure, (state: SQSQueueListState, {error}) => ({...state, error, loading: false})),
);