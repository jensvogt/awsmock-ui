import {createReducer, on} from "@ngrx/store";
import {sqsMessageListActions} from './sqs-message-list.actions';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {ListMessageCountersResponse} from "../../model/sqs-message-item";

export const sqsMessageListFeatureKey = 'sqs-message-list';

export interface SQSMessageListState {
    listMessageCountersResponse: ListMessageCountersResponse;
    prefix: string;
    pageSize: number;
    pageIndex: number;
    loading: boolean;
    sortColumns: SortColumn[];
    error: unknown;
}

export const initialState: SQSMessageListState = {
    listMessageCountersResponse: {Total: 0, Messages: []},
    prefix: '',
    pageSize: 10,
    pageIndex: 0,
    loading: false,
    sortColumns: [{column: '_id', sortDirection: -1}],
    error: {}
};

export const sqsMessageListReducer = createReducer(
    initialState,

    // Initialize
    on(sqsMessageListActions.initialize, (state: SQSMessageListState): SQSMessageListState => ({...state, pageIndex: 0, pageSize: 10, loading: true})),

    // Load message list
    on(sqsMessageListActions.loadMessages, (state: SQSMessageListState) => ({...state, loading: true})),
    on(sqsMessageListActions.loadMessagesSuccess, (state: SQSMessageListState, {messages}) => ({...state, listMessageCountersResponse: messages, loading: false})),
    on(sqsMessageListActions.loadMessagesFailure, (state: SQSMessageListState, {error}) => ({...state, error: error, loading: false})),

    // Add message
    on(sqsMessageListActions.addMessage, (state: SQSMessageListState) => ({...state, loading: true})),
    on(sqsMessageListActions.addMessageSuccess, (state: SQSMessageListState) => ({...state, loading: false})),
    on(sqsMessageListActions.addMessageFailure, (state: SQSMessageListState, {error}) => ({...state, error: error, loading: false})),

    // Delete message
    on(sqsMessageListActions.deleteMessage, (state: SQSMessageListState) => ({...state, loading: true})),
    on(sqsMessageListActions.deleteMessageSuccess, (state: SQSMessageListState) => ({...state, loading: false})),
    on(sqsMessageListActions.deleteMessageFailure, (state: SQSMessageListState, {error}) => ({...state, error: error, loading: false})),
);