// Hinzufügen:
import {ListQueueCountersResponse} from "../../model/sqs-queue-item";
import {createReducer, on} from "@ngrx/store";
import {sqsQueueListActions} from './sqs-queue-list.actions';
import {SortColumn} from "../../../../shared/sorting/sorting.component";

export const sqsQueueListFeatureKey = 'sqs-queue-list';

export interface SQSQueueListState {
    listQueueResponse: ListQueueCountersResponse;
    prefix: string;
    pageSize: number;
    pageIndex: number;
    loading: boolean;
    sortColumns: SortColumn[];
    error: unknown;
}

export const initialState: SQSQueueListState = {
    listQueueResponse: {Total: 0, QueueCounters: []},
    prefix: '',
    pageSize: 10,
    pageIndex: 0,
    loading: false,
    sortColumns: [{column: 'attributes.approximateNumberOfMessages', sortDirection: -1}],
    error: {}
};

export const sqsQueueListReducer = createReducer(
    initialState,

    // Initialize
    on(sqsQueueListActions.initialize, (state: SQSQueueListState): SQSQueueListState => ({...state, pageIndex: 0, pageSize: 10, loading: true})),

    // Queue list
    on(sqsQueueListActions.loadQueues, (state: SQSQueueListState) => ({...state, loading: true})),
    on(sqsQueueListActions.loadQueuesSuccess, (state: SQSQueueListState, {queues}) => ({...state, listQueueResponse: queues, loading: false})),
    on(sqsQueueListActions.loadQueuesFailure, (state: SQSQueueListState, {error}) => ({...state, error: error, loading: false})),

    // Add queue
    on(sqsQueueListActions.addQueue, (state: SQSQueueListState) => ({...state, loading: true})),
    on(sqsQueueListActions.addQueueSuccess, (state: SQSQueueListState) => ({...state, loading: false})),
    on(sqsQueueListActions.addQueueFailure, (state: SQSQueueListState, {error}) => ({...state, error: error, loading: false})),

    // Purge queue
    on(sqsQueueListActions.purgeQueue, (state: SQSQueueListState) => ({...state, loading: true})),
    on(sqsQueueListActions.purgeQueueSuccess, (state: SQSQueueListState) => ({...state, loading: false})),
    on(sqsQueueListActions.purgeQueueFailure, (state: SQSQueueListState, {error}) => ({...state, error: error, loading: false})),

    // Delete queue
    on(sqsQueueListActions.deleteQueue, (state: SQSQueueListState) => ({...state, loading: true})),
    on(sqsQueueListActions.deleteQueueSuccess, (state: SQSQueueListState) => ({...state, loading: false})),
    on(sqsQueueListActions.deleteQueueFailure, (state: SQSQueueListState, {error}) => ({...state, error: error, loading: false})),
);