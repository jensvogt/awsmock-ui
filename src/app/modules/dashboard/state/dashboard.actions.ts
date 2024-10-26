import {createAction, props} from '@ngrx/store';
import {QueueItem} from '../../sqs/model/queue-item';
import {SortColumn} from "../../../shared/sorting/sorting.component";

export const sqsQueueListActions = {
    initialize: createAction('[sqs-queue-list] initialize'),
    loadQueues: createAction('[sqs-queue-list] Load Queues', props<{ prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    loadQueuesSuccess: createAction('[sqs-queue-list] Load Queues Success', props<{ queues: QueueItem[] }>()),
    loadQueuesFailure: createAction('[sqs-queue-list] Load Queues Error', props<{ error: string }>())
}