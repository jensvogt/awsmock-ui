import {createAction, props} from '@ngrx/store';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {ListTopicCountersResponse} from "../../model/sns-topic-item";

export const snsTopicListActions = {
    initialize: createAction('[sns-topic-list] initialize'),

    // Load topic
    loadTopics: createAction('[sns-topic-list] Load Topics', props<{ prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    loadTopicsSuccess: createAction('[sns-topic-list] Load Topics Success', props<{ topics: ListTopicCountersResponse }>()),
    loadTopicsFailure: createAction('[sns-topic-list] Load Topics Error', props<{ error: string }>()),

    // Add topic
    addTopic: createAction('[sns-topic-list] Add Topic', props<{ name: string }>()),
    addTopicSuccess: createAction('[sns-topic-list] Add Topic Success'),
    addTopicFailure: createAction('[sns-topic-list] Add Topic Error', props<{ error: string }>()),

    // Delete topic
    deleteTopic: createAction('[sns-topic-list] Delete Topic', props<{ topicUrl: string }>()),
    deleteTopicSuccess: createAction('[sns-topic-list] Delete Topic Success'),
    deleteTopicFailure: createAction('[sns-topic-list] Delete Topic Error', props<{ error: string }>()),

    // Purge topic
    purgeTopic: createAction('[sns-topic-list] Delete Topic', props<{ topicUrl: string }>()),
    purgeTopicSuccess: createAction('[sns-topic-list] Delete Topic Success'),
    purgeTopicFailure: createAction('[sns-topic-list] Delete Topic Error', props<{ error: string }>())
}