import {createAction, props} from '@ngrx/store';
import {ListMessageCountersResponse, SqsMessageAttribute} from '../../model/sqs-message-item';
import {SortColumn} from "../../../../shared/sorting/sorting.component";

export const sqsMessageListActions = {
    initialize: createAction('[sqs-message-list] initialize'),

    // Load message
    loadMessages: createAction('[sqs-message-list] Load messages', props<{
        queueArn: string,
        prefix: string,
        pageSize: number,
        pageIndex: number,
        sortColumns: SortColumn[]
    }>()),
    loadMessagesSuccess: createAction('[sqs-message-list] Load messages success', props<{ messages: ListMessageCountersResponse }>()),
    loadMessagesFailure: createAction('[sqs-message-list] Load messages error', props<{ error: string }>()),

    // Add message
    addMessage: createAction('[sqs-message-list] Add message', props<{ name: string }>()),
    addMessageSuccess: createAction('[sqs-message-list] Add message success'),
    addMessageFailure: createAction('[sqs-message-list] Add message error', props<{ error: string }>()),

    // Update attribute
    updateMessage: createAction('[sqs-message-list] Update message', props<{ messageId: string, messageAttributes: SqsMessageAttribute[] }>()),
    updateMessageSuccess: createAction('[sqs-message-list] Update message success'),
    updateMessageFailure: createAction('[sqs-message-list] Update message error', props<{ error: string }>()),

    // Delete message
    deleteMessage: createAction('[sqs-message-list] Delete message', props<{ queueUrl: string, receiptHandle: string }>()),
    deleteMessageSuccess: createAction('[sqs-message-list] Delete message success'),
    deleteMessageFailure: createAction('[sqs-message-list] Delete message error', props<{ error: string }>()),
}