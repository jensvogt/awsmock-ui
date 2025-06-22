import {createReducer, on} from "@ngrx/store";
import {keyListActions} from './key-list.actions';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {ListKeyCountersResponse} from "../../model/key-item";

export const kmsKeyListFeatureKey = 'kms-key-list';

export interface KMSKeyListState {
    listKeyResponse: ListKeyCountersResponse;
    prefix: string;
    pageSize: number;
    pageIndex: number;
    loading: boolean;
    sortColumns: SortColumn[];
    error: unknown;
}

export const initialState: KMSKeyListState = {
    listKeyResponse: {total: 0, keyCounters: []},
    prefix: '',
    pageSize: 10,
    pageIndex: 0,
    loading: false,
    sortColumns: [{column: 'attributes.availableMessages', sortDirection: -1}],
    error: {}
};

export const kmsKeyListReducer = createReducer(
    initialState,

    // Initialize
    on(keyListActions.initialize, (state: KMSKeyListState): KMSKeyListState => ({...state, pageIndex: 0, pageSize: 10, loading: true})),

    // Topic list
    on(keyListActions.loadKeys, (state: KMSKeyListState) => ({...state, loading: true})),
    on(keyListActions.loadKeysSuccess, (state: KMSKeyListState, {keys}) => ({...state, listKeyResponse: keys, loading: false})),
    on(keyListActions.loadKeysFailure, (state: KMSKeyListState, {error}) => ({...state, error: error, loading: false})),

    // // Add topic
    // on(keyListActions.addTopic, (state: SNSTopicListState) => ({...state, loading: true})),
    // on(keyListActions.addTopicSuccess, (state: SNSTopicListState) => ({...state, loading: false})),
    // on(keyListActions.addTopicFailure, (state: SNSTopicListState, {error}) => ({...state, error: error, loading: false})),
    //
    // // Purge topic
    // on(keyListActions.purgeTopic, (state: SNSTopicListState) => ({...state, loading: true})),
    // on(keyListActions.purgeTopicSuccess, (state: SNSTopicListState) => ({...state, loading: false})),
    // on(keyListActions.purgeTopicFailure, (state: SNSTopicListState, {error}) => ({...state, error: error, loading: false})),
    //
    // // Publish message
    // on(keyListActions.publishMessage, (state: SNSTopicListState) => ({...state, loading: true})),
    // on(keyListActions.publishMessageSuccess, (state: SNSTopicListState) => ({...state, loading: false})),
    // on(keyListActions.publishMessageFailure, (state: SNSTopicListState, {error}) => ({...state, error: error, loading: false})),
    //
    // // Delete topic
    // on(keyListActions.deleteTopic, (state: SNSTopicListState) => ({...state, loading: true})),
    // on(keyListActions.deleteTopicSuccess, (state: SNSTopicListState) => ({...state, loading: false})),
    // on(keyListActions.deleteTopicFailure, (state: SNSTopicListState, {error}) => ({...state, error: error, loading: false})),
);