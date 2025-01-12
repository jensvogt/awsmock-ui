import {createAction, props} from '@ngrx/store';
import {SqsQueueDetails} from "../../model/sqs-queue-details";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {SqsAttributeCountersResponse} from "../../model/sqs-attribute-item";

export const sqsQueueDetailsActions = {
    initialize: createAction('[sqs-queue-details] initialize'),

    // Load details
    loadDetails: createAction('[sqs-queue-details] Load queue details', props<{ queueArn: string }>()),
    loadDetailsSuccess: createAction('[sqs-queue-details] Load queue details success', props<{ queueDetails: SqsQueueDetails }>()),
    loadDetailsFailure: createAction('[sqs-queue-details] Load queue details error', props<{ error: string }>()),

    // Load attributes
    loadAttributes: createAction('[sqs-queue-details] Load queue attributes', props<{ queueArn: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    loadAttributesSuccess: createAction('[sqs-queue-details] Load queue attributes success', props<{ attributes: SqsAttributeCountersResponse }>()),
    loadAttributesFailure: createAction('[sqs-queue-details] Load queue attributes error', props<{ error: string }>()),
}