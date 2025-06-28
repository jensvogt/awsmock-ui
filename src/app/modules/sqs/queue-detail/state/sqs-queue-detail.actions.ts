import {createAction, props} from '@ngrx/store';
import {SqsQueueAttributeCountersResponse, SqsQueueDetails} from "../../model/sqs-queue-details";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {SqsTagCountersResponse} from "../../model/sqs-tag-item";
import {SqsLambdaTriggerCountersResponse} from "../../model/sqs-lambda-trigger-item";
import {SqsDefaultMessageAttributeResponse} from "../../model/sqs-default-message-attribute";

export const sqsQueueDetailsActions = {
    initialize: createAction('[sqs-queue-details] initialize'),

    // Load details
    loadDetails: createAction('[sqs-queue-details] Load queue details', props<{ queueArn: string }>()),
    loadDetailsSuccess: createAction('[sqs-queue-details] Load queue details success', props<{ queueDetails: SqsQueueDetails }>()),
    loadDetailsFailure: createAction('[sqs-queue-details] Load queue details error', props<{ error: string }>()),

    // Load attributes
    loadAttributes: createAction('[sqs-queue-details] Load queue attributes', props<{ queueArn: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    loadAttributesSuccess: createAction('[sqs-queue-details] Load queue attributes success', props<{ attributes: SqsQueueAttributeCountersResponse }>()),
    loadAttributesFailure: createAction('[sqs-queue-details] Load queue attributes error', props<{ error: string }>()),

    // Load lambda triggers
    loadLambdaTriggers: createAction('[sqs-queue-details] Load queue lambda trigger', props<{ queueArn: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    loadLambdaTriggersSuccess: createAction('[sqs-queue-details] Load queue lambda trigger success', props<{ lambdaTriggers: SqsLambdaTriggerCountersResponse }>()),
    loadLambdaTriggersFailure: createAction('[sqs-queue-details] Load queue lambda trigger error', props<{ error: string }>()),

    // Load tags
    loadTags: createAction('[sns-queue-details] Load queue tags', props<{ queueArn: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    loadTagsSuccess: createAction('[sns-queue-details] Load queue tags success', props<{ tags: SqsTagCountersResponse }>()),
    loadTagsFailure: createAction('[sns-queue-details] Load queue tags error', props<{ error: string }>()),

    // Load default message attributes
    loadDefaultMessageAttributes: createAction('[sns-queue-details] Load default message attributes', props<{ queueArn: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    loadDefaultMessageAttributesSuccess: createAction('[sns-queue-details] Load default message attributes success', props<{ defaultMessageAttributes: SqsDefaultMessageAttributeResponse }>()),
    loadDefaultMessageAttributesFailure: createAction('[sns-queue-details] Load default message attributes error', props<{ error: string }>()),

    // Add default message attributes
    addDefaultMessageAttributes: createAction('[sns-queue-details] Add default message attributes', props<{ queueArn: string, name: string, value: string, dataType: string }>()),
    addDefaultMessageAttributesSuccess: createAction('[sns-queue-details] Add default message attributes success', props<{ defaultMessageAttributes: SqsDefaultMessageAttributeResponse }>()),
    addDefaultMessageAttributesFailure: createAction('[sns-queue-details] Add default message attributes error', props<{ error: string }>()),

    // Update default message attributes
    updateDefaultMessageAttributes: createAction('[sns-queue-details] Update default message attributes', props<{ queueArn: string, name: string, value: string, dataType: string }>()),
    updateDefaultMessageAttributesSuccess: createAction('[sns-queue-details] Update default message attributes success', props<{ defaultMessageAttributes: SqsDefaultMessageAttributeResponse }>()),
    updateDefaultMessageAttributesFailure: createAction('[sns-queue-details] Update default message attributes error', props<{ error: string }>()),

    // Delete default message attributes
    deleteDefaultMessageAttributes: createAction('[sns-queue-details] Delete default message attributes', props<{ queueArn: string, name: string }>()),
    deleteDefaultMessageAttributesSuccess: createAction('[sns-queue-details] Delete default message attributes success', props<{ defaultMessageAttributes: SqsDefaultMessageAttributeResponse }>()),
    deleteDefaultMessageAttributesFailure: createAction('[sns-queue-details] Delete default message attributes error', props<{ error: string }>()),
}