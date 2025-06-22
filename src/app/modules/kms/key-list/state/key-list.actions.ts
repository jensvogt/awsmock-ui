import {createAction, props} from '@ngrx/store';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {ListKeyCountersResponse} from "../../model/key-item";

export const keyListActions = {
    initialize: createAction('[kms-key-list] initialize'),

    // Load topic
    loadKeys: createAction('[kms-key-list] Load keys', props<{ prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    loadKeysSuccess: createAction('[kms-key-list] Load keys success', props<{ keys: ListKeyCountersResponse }>()),
    loadKeysFailure: createAction('[kms-key-list] Load keys error', props<{ error: string }>()),

    // Add topic
    // addTopic: createAction('[kms-key-list] Add Topic', props<{ name: string }>()),
    // addTopicSuccess: createAction('[kms-key-list] Add Topic Success'),
    // addTopicFailure: createAction('[kms-key-list] Add Topic Error', props<{ error: string }>()),

    // Delete topic
    // deleteTopic: createAction('[kms-key-list] Delete Topic', props<{ topicArn: string }>()),
    // deleteTopicSuccess: createAction('[kms-key-list] Delete Topic Success'),
    // deleteTopicFailure: createAction('[kms-key-list] Delete Topic Error', props<{ error: string }>()),
}