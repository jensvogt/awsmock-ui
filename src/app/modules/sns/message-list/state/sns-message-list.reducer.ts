import {createReducer, on} from "@ngrx/store";
import {snsMessageListActions} from './sns-message-list.actions';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {SnsMessageCountersResponse} from "../../model/sns-message-item";

export const snsMessageListFeatureKey = 'sns-message-list';

export interface SNSMessageListState {
    snsMessageCountersResponse: SnsMessageCountersResponse;
    pageSize: number;
    pageIndex: number;
    loading: boolean;
    sortColumns: SortColumn[];
    error: unknown;
}

export const initialState: SNSMessageListState = {
    snsMessageCountersResponse: {Total: 0, Messages: []},
    pageSize: 10,
    pageIndex: 0,
    loading: false,
    sortColumns: [{column: 'attributes.availableMessages', sortDirection: -1}],
    error: {}
};

export const snsMessageListReducer = createReducer(
    initialState,

    // Initialize
    on(snsMessageListActions.initialize, (state: SNSMessageListState): SNSMessageListState => ({...state, pageIndex: 0, pageSize: 10, loading: true})),

    // Message list
    on(snsMessageListActions.loadMessages, (state: SNSMessageListState) => ({...state, loading: true})),
    on(snsMessageListActions.loadMessagesSuccess, (state: SNSMessageListState, {messages}) => ({...state, snsMessageCountersResponse: messages, loading: false})),
    on(snsMessageListActions.loadMessagesFailure, (state: SNSMessageListState, {error}) => ({...state, error: error, loading: false})),

    // Publish message
    on(snsMessageListActions.publishMessage, (state: SNSMessageListState) => ({...state, loading: true})),
    on(snsMessageListActions.publishMessageSuccess, (state: SNSMessageListState) => ({...state, loading: false})),
    on(snsMessageListActions.publishMessageFailure, (state: SNSMessageListState, {error}) => ({...state, error: error, loading: false})),

    // Delete message
    on(snsMessageListActions.deleteMessage, (state: SNSMessageListState) => ({...state, loading: true})),
    on(snsMessageListActions.deleteMessageSuccess, (state: SNSMessageListState) => ({...state, loading: false})),
    on(snsMessageListActions.deleteMessageFailure, (state: SNSMessageListState, {error}) => ({...state, error: error, loading: false})),
);