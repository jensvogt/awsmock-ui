import {createAction, props} from '@ngrx/store';
import {SqsQueueDetails} from "../../model/sqs-queue-details";

export const sqsQueueDetailsActions = {
    initialize: createAction('[sqs-queue-details] initialize'),

    // Load details
    loadDetails: createAction('[sqs-queue-details] Load Queues Details', props<{ queueArn: string }>()),
    loadDetailsSuccess: createAction('[sqs-queue-details] Load Queues Details Success', props<{ queueDetails: SqsQueueDetails }>()),
    loadDetailsFailure: createAction('[sqs-queue-details] Load Queues Details Error', props<{ error: string }>()),

    // Load attributes
    loadAttributes: createAction('[sqs-queue-details] Load Queues Attributes', props<{ queueArn: string }>()),
    loadAttributesSuccess: createAction('[sqs-queue-details] Load Queues Attributes Success', props<{ attributes: SqsQueueDetails }>()),
    loadAttributesFailure: createAction('[sqs-queue-details] Load Queues Attributes Error', props<{ error: string }>()),
}