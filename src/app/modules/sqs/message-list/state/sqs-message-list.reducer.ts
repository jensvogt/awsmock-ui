import {createReducer, on} from "@ngrx/store";
import {sqsMessageListActions} from './sqs-message-list.actions';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {ListMessageAttributeCountersResponse, ListMessageCountersResponse} from "../../model/sqs-message-item";

export const sqsMessageListFeatureKey = 'sqs-message-list';

export interface SQSMessageListState {

    // Messages
    messageCountersResponse: ListMessageCountersResponse;
    messagePrefix: string;
    messagePageSize: number;
    messagePageIndex: number;
    messageSortColumns: SortColumn[];

    // Message attributes
    messageAttributeCountersResponse: ListMessageAttributeCountersResponse;
    messageAttributePrefix: string;
    messageAttributePageSize: number;
    messageAttributePageIndex: number;
    messageAttributeSortColumns: SortColumn[];

    // Misc
    loading: boolean;
    error: unknown;
}

export const initialState: SQSMessageListState = {
    // Messages
    messageCountersResponse: {total: 0, messageCounters: []},
    messagePrefix: '',
    messagePageSize: 10,
    messagePageIndex: 0,
    messageSortColumns: [{column: '_id', sortDirection: -1}],

    // Message attributes
    messageAttributeCountersResponse: {total: 0, messageAttributeCounters: []},
    messageAttributePrefix: '',
    messageAttributePageSize: 10,
    messageAttributePageIndex: 0,
    messageAttributeSortColumns: [],

    // Misc
    loading: false,
    error: {},
};

export const sqsMessageListReducer = createReducer(
    initialState,

    // Initialize
    on(sqsMessageListActions.initialize, (state: SQSMessageListState): SQSMessageListState => ({...state, messagePageIndex: 0, messagePageSize: 10, loading: true})),

    // Load message list
    on(sqsMessageListActions.loadMessages, (state: SQSMessageListState) => ({...state, loading: true})),
    on(sqsMessageListActions.loadMessagesSuccess, (state: SQSMessageListState, {messages}) => ({...state, messageCountersResponse: messages, loading: false})),
    on(sqsMessageListActions.loadMessagesFailure, (state: SQSMessageListState, {error}) => ({...state, error: error, loading: false})),

    // Add message
    on(sqsMessageListActions.addMessage, (state: SQSMessageListState) => ({...state, loading: true})),
    on(sqsMessageListActions.addMessageSuccess, (state: SQSMessageListState) => ({...state, loading: false})),
    on(sqsMessageListActions.addMessageFailure, (state: SQSMessageListState, {error}) => ({...state, error: error, loading: false})),

    // Delete message
    on(sqsMessageListActions.deleteMessage, (state: SQSMessageListState) => ({...state, loading: true})),
    on(sqsMessageListActions.deleteMessageSuccess, (state: SQSMessageListState) => ({...state, loading: false})),
    on(sqsMessageListActions.deleteMessageFailure, (state: SQSMessageListState, {error}) => ({...state, error: error, loading: false})),

    // Load message attribute list
    on(sqsMessageListActions.loadMessageAttributes, (state: SQSMessageListState) => ({...state, loading: true})),
    on(sqsMessageListActions.loadMessageAttributesSuccess, (state: SQSMessageListState, {messageAttributes}) => ({...state, messageAttributeCountersResponse: messageAttributes, loading: false})),
    on(sqsMessageListActions.loadMessageAttributesFailure, (state: SQSMessageListState, {error}) => ({...state, error: error, loading: false})),

    // Add message attribute
    on(sqsMessageListActions.addMessageAttribute, (state: SQSMessageListState) => ({...state, loading: true})),
    on(sqsMessageListActions.addMessageAttributeSuccess, (state: SQSMessageListState) => ({...state, loading: false})),
    on(sqsMessageListActions.addMessageAttributeFailure, (state: SQSMessageListState, {error}) => ({...state, error: error, loading: false})),

    // Delete message attribute
    on(sqsMessageListActions.deleteMessageAttribute, (state: SQSMessageListState) => ({...state, loading: true})),
    on(sqsMessageListActions.deleteMessageAttributeSuccess, (state: SQSMessageListState) => ({...state, loading: false})),
    on(sqsMessageListActions.deleteMessageAttributeFailure, (state: SQSMessageListState, {error}) => ({...state, error: error, loading: false})),
);