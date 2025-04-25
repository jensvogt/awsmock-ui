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
    reload: boolean,
    sortColumns: SortColumn[];
    error: unknown;
}

export const initialState: SQSQueueListState = {
    listQueueResponse: {total: 0, queueCounters: []},
    prefix: '',
    pageSize: 10,
    pageIndex: 0,
    loading: false,
    reload: false,
    sortColumns: [{column: 'attributes.approximateNumberOfMessages', sortDirection: -1}, {column: 'queueName', sortDirection: 1}],
    error: {}
};

export const sqsQueueListReducer = createReducer(
    initialState,

    // Initialize
    on(sqsQueueListActions.initialize, (state: SQSQueueListState): SQSQueueListState => ({
        ...state,
        pageIndex: 0,
        pageSize: 10,
        loading: true,
        reload: false,
    })),

    // Queue list
    on(sqsQueueListActions.loadQueues, (state: SQSQueueListState) => ({...state, loading: true, reload: false})),
    on(sqsQueueListActions.loadQueuesSuccess, (state: SQSQueueListState, {queues}) => ({
        ...state,
        listQueueResponse: queues,
        loading: false,
        reload: false
    })),
    on(sqsQueueListActions.loadQueuesFailure, (state: SQSQueueListState, {error}) => ({...state, error: error, loading: false, reload: false})),

    // Add queue
    on(sqsQueueListActions.createQueue, (state: SQSQueueListState) => ({...state, loading: true})),
    on(sqsQueueListActions.createQueueSuccess, (state: SQSQueueListState) => ({...state, loading: false, reload: true})),
    on(sqsQueueListActions.createQueueFailure, (state: SQSQueueListState, {error}) => ({...state, error: error, loading: false, reload: false})),

    // Purge queue
    on(sqsQueueListActions.purgeQueue, (state: SQSQueueListState) => ({...state, loading: true})),
    on(sqsQueueListActions.purgeQueueSuccess, (state: SQSQueueListState) => ({...state, loading: false, reload: true})),
    on(sqsQueueListActions.purgeQueueFailure, (state: SQSQueueListState, {error}) => ({...state, error: error, loading: false, reload: false})),

    // Delete queue
    on(sqsQueueListActions.deleteQueue, (state: SQSQueueListState) => ({...state, loading: true})),
    on(sqsQueueListActions.deleteQueueSuccess, (state: SQSQueueListState) => ({...state, loading: false, reload: true})),
    on(sqsQueueListActions.deleteQueueFailure, (state: SQSQueueListState, {error}) => ({...state, error: error, loading: false, reload: true})),
);