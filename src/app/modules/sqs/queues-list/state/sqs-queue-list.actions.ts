import {createAction, props} from '@ngrx/store';
import {ListQueueCountersResponse} from '../../model/sqs-queue-item';
import {SortColumn} from "../../../../shared/sorting/sorting.component";

export const sqsQueueListActions = {
    initialize: createAction('[sqs-queue-list] initialize'),

    // Load queue
    loadQueues: createAction('[sqs-queue-list] Load Queues', props<{ prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    loadQueuesSuccess: createAction('[sqs-queue-list] Load Queues Success', props<{ queues: ListQueueCountersResponse }>()),
    loadQueuesFailure: createAction('[sqs-queue-list] Load Queues Error', props<{ error: string }>()),

    // Add queue
    addQueue: createAction('[sqs-queue-list] Add Queue', props<{ name: string }>()),
    addQueueSuccess: createAction('[sqs-queue-list] Add Queue Success'),
    addQueueFailure: createAction('[sqs-queue-list] Add Queue Error', props<{ error: string }>()),

    // Delete queue
    deleteQueue: createAction('[sqs-queue-list] Delete Queue', props<{ queueUrl: string }>()),
    deleteQueueSuccess: createAction('[sqs-queue-list] Delete Queue Success'),
    deleteQueueFailure: createAction('[sqs-queue-list] Delete Queue Error', props<{ error: string }>()),

    // Purge queue
    purgeQueue: createAction('[sqs-queue-list] Delete Queue', props<{ queueUrl: string }>()),
    purgeQueueSuccess: createAction('[sqs-queue-list] Delete Queue Success'),
    purgeQueueFailure: createAction('[sqs-queue-list] Delete Queue Error', props<{ error: string }>())
}