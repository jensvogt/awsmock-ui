import {ListTopicCountersResponse} from "../../model/sns-topic-item";
import {createReducer, on} from "@ngrx/store";
import {snsTopicListActions} from './sns-topic-list.actions';
import {SortColumn} from "../../../../shared/sorting/sorting.component";

export const snsTopicListFeatureKey = 'sns-topic-list';

export interface SNSTopicListState {
    listTopicResponse: ListTopicCountersResponse;
    prefix: string;
    pageSize: number;
    pageIndex: number;
    loading: boolean;
    sortColumns: SortColumn[];
    error: unknown;
}

export const initialState: SNSTopicListState = {
    listTopicResponse: {total: 0, topicCounters: []},
    prefix: '',
    pageSize: 10,
    pageIndex: 0,
    loading: false,
    sortColumns: [{column: 'messages', sortDirection: -1}],
    error: {}
};

export const snsTopicListReducer = createReducer(
    initialState,

    // Initialize
    on(snsTopicListActions.initialize, (state: SNSTopicListState): SNSTopicListState => ({...state, pageIndex: 0, pageSize: 10, loading: true})),

    // Topic list
    on(snsTopicListActions.loadTopics, (state: SNSTopicListState) => ({...state, loading: true})),
    on(snsTopicListActions.loadTopicsSuccess, (state: SNSTopicListState, {topics}) => ({...state, listTopicResponse: topics, loading: false})),
    on(snsTopicListActions.loadTopicsFailure, (state: SNSTopicListState, {error}) => ({...state, error: error, loading: false})),

    // Add topic
    on(snsTopicListActions.addTopic, (state: SNSTopicListState) => ({...state, loading: true})),
    on(snsTopicListActions.addTopicSuccess, (state: SNSTopicListState) => ({...state, loading: false})),
    on(snsTopicListActions.addTopicFailure, (state: SNSTopicListState, {error}) => ({...state, error: error, loading: false})),

    // Purge topic
    on(snsTopicListActions.purgeTopic, (state: SNSTopicListState) => ({...state, loading: true})),
    on(snsTopicListActions.purgeTopicSuccess, (state: SNSTopicListState) => ({...state, loading: false})),
    on(snsTopicListActions.purgeTopicFailure, (state: SNSTopicListState, {error}) => ({...state, error: error, loading: false})),

    // Publish message
    on(snsTopicListActions.publishMessage, (state: SNSTopicListState) => ({...state, loading: true})),
    on(snsTopicListActions.publishMessageSuccess, (state: SNSTopicListState) => ({...state, loading: false})),
    on(snsTopicListActions.publishMessageFailure, (state: SNSTopicListState, {error}) => ({...state, error: error, loading: false})),

    // Delete topic
    on(snsTopicListActions.deleteTopic, (state: SNSTopicListState) => ({...state, loading: true})),
    on(snsTopicListActions.deleteTopicSuccess, (state: SNSTopicListState) => ({...state, loading: false})),
    on(snsTopicListActions.deleteTopicFailure, (state: SNSTopicListState, {error}) => ({...state, error: error, loading: false})),
);