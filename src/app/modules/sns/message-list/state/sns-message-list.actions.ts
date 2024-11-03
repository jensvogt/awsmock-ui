import {createAction, props} from '@ngrx/store';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {SnsMessageCountersResponse} from "../../model/sns-message-item";

export const snsMessageListActions = {
    initialize: createAction('[sns-message-list] initialize'),

    // Load topic
    loadMessages: createAction('[sns-message-list] Load messages', props<{ topicArn: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    loadMessagesSuccess: createAction('[sns-message-list] Load messages', props<{ messages: SnsMessageCountersResponse }>()),
    loadMessagesFailure: createAction('[sns-message-list] Load messages', props<{ error: string }>()),

    // Publish message
    publishMessage: createAction('[sns-message-list] Publish message', props<{ topicArn: string, message: string }>()),
    publishMessageSuccess: createAction('[sns-message-list] Publish message success'),
    publishMessageFailure: createAction('[sns-message-list] Publish message error', props<{ error: string }>()),

    // Delete topic
    deleteMessage: createAction('[sns-message-list] Delete message', props<{ messageId: string }>()),
    deleteMessageSuccess: createAction('[sns-message-list] Delete message success'),
    deleteMessageFailure: createAction('[sns-message-list] Delete message error', props<{ error: string }>()),
}