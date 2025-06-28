import {createReducer, on} from "@ngrx/store";
import {sqsQueueDetailsActions} from './sqs-queue-detail.actions';
import {SqsQueueAttributeCountersResponse, SqsQueueDetails} from "../../model/sqs-queue-details";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {SqsTagCountersResponse} from "../../model/sqs-tag-item";
import {SqsLambdaTriggerCountersResponse} from "../../model/sqs-lambda-trigger-item";
import {SqsDefaultMessageAttributeResponse} from "../../model/sqs-default-message-attribute";

export const sqsQueueDetailsFeatureKey = 'sqs-queue-details';

export interface SqsQueueDetailsState {
    sqsQueueDetails: SqsQueueDetails;

    // Attributes
    sqsQueueAttributes: SqsQueueAttributeCountersResponse;
    attributePageSize: number,
    attributePageIndex: number,
    attributeSortColumns: SortColumn[],

    // Lambda triggers
    sqsLambdaTriggers: SqsLambdaTriggerCountersResponse;
    lambdaTriggerPageSize: number,
    lambdaTriggerPageIndex: number,
    lambdaTriggerSortColumns: SortColumn[],

    // Tags
    sqsQueueTags: SqsTagCountersResponse;
    tagPageSize: number,
    tagPageIndex: number,
    tagSortColumns: SortColumn[],

    // DefaultMessageAttributes
    sqsQueueDefaultMessageAttributes: SqsDefaultMessageAttributeResponse;
    defaultMessageAttributePageSize: number,
    defaultMessageAttributePageIndex: number,
    defaultMessageAttributeSortColumns: SortColumn[],

    loading: boolean;
    error: unknown;
}

export const initialState: SqsQueueDetailsState = {
    sqsQueueDetails: {} as SqsQueueDetails,

    // Attributes
    sqsQueueAttributes: {} as SqsQueueAttributeCountersResponse,
    attributePageSize: 10,
    attributePageIndex: 0,
    attributeSortColumns: [{column: 'endpoint', sortDirection: -1}],

    // Attributes
    sqsLambdaTriggers: {} as SqsLambdaTriggerCountersResponse,
    lambdaTriggerPageSize: 10,
    lambdaTriggerPageIndex: 0,
    lambdaTriggerSortColumns: [{column: 'arn', sortDirection: -1}],

    // Tags
    sqsQueueTags: {} as SqsTagCountersResponse,
    tagPageSize: 10,
    tagPageIndex: 0,
    tagSortColumns: [{column: 'endpoint', sortDirection: -1}],

    // DefaultMessageAttributes
    sqsQueueDefaultMessageAttributes: {} as SqsDefaultMessageAttributeResponse,
    defaultMessageAttributePageSize: 10,
    defaultMessageAttributePageIndex: 0,
    defaultMessageAttributeSortColumns: [{column: 'endpoint', sortDirection: -1}],

    loading: false,
    error: {}
};

export const sqsQueueDetailReducer = createReducer(
    initialState,

    // Initialize
    on(sqsQueueDetailsActions.initialize, (state: SqsQueueDetailsState): SqsQueueDetailsState => ({...state, loading: false})),

    // Queue details
    on(sqsQueueDetailsActions.loadDetails, (state: SqsQueueDetailsState) => ({...state, loading: true})),
    on(sqsQueueDetailsActions.loadDetailsSuccess, (state: SqsQueueDetailsState, {queueDetails}) => ({...state, sqsQueueDetails: queueDetails, loading: false})),
    on(sqsQueueDetailsActions.loadDetailsFailure, (state: SqsQueueDetailsState, {error}) => ({...state, error: error, loading: false})),

    // Queue attributes
    on(sqsQueueDetailsActions.loadAttributes, (state: SqsQueueDetailsState) => ({...state, loading: true})),
    on(sqsQueueDetailsActions.loadAttributesSuccess, (state: SqsQueueDetailsState, {attributes}) => ({...state, sqsQueueAttributes: attributes, loading: false})),
    on(sqsQueueDetailsActions.loadAttributesFailure, (state: SqsQueueDetailsState, {error}) => ({...state, error: error, loading: false})),

    // Queue attributes
    on(sqsQueueDetailsActions.loadLambdaTriggers, (state: SqsQueueDetailsState) => ({...state, loading: true})),
    on(sqsQueueDetailsActions.loadLambdaTriggersSuccess, (state: SqsQueueDetailsState, {lambdaTriggers}) => ({...state, sqsLambdaTriggers: lambdaTriggers, loading: false})),
    on(sqsQueueDetailsActions.loadLambdaTriggersFailure, (state: SqsQueueDetailsState, {error}) => ({...state, error: error, loading: false})),

    // Queue tags
    on(sqsQueueDetailsActions.loadTags, (state: SqsQueueDetailsState) => ({...state, loading: true})),
    on(sqsQueueDetailsActions.loadTagsSuccess, (state: SqsQueueDetailsState, {tags}) => ({...state, sqsQueueTags: tags, loading: false})),
    on(sqsQueueDetailsActions.loadTagsFailure, (state: SqsQueueDetailsState, {error}) => ({...state, error: error, loading: false})),

    // List queue default message attributes
    on(sqsQueueDetailsActions.loadDefaultMessageAttributes, (state: SqsQueueDetailsState) => ({...state, loading: true})),
    on(sqsQueueDetailsActions.loadDefaultMessageAttributesSuccess, (state: SqsQueueDetailsState, {defaultMessageAttributes}) => ({...state, sqsQueueDefaultMessageAttributes: defaultMessageAttributes, loading: false})),
    on(sqsQueueDetailsActions.loadDefaultMessageAttributesFailure, (state: SqsQueueDetailsState, {error}) => ({...state, error: error, loading: false})),

    // Add queue default message attributes
    on(sqsQueueDetailsActions.addDefaultMessageAttributes, (state: SqsQueueDetailsState) => ({...state, loading: true})),
    on(sqsQueueDetailsActions.addDefaultMessageAttributesSuccess, (state: SqsQueueDetailsState, {defaultMessageAttributes}) => ({...state, sqsQueueDefaultMessageAttributes: defaultMessageAttributes, loading: false})),
    on(sqsQueueDetailsActions.addDefaultMessageAttributesFailure, (state: SqsQueueDetailsState, {error}) => ({...state, error: error, loading: false})),

    // Update queue default message attributes
    on(sqsQueueDetailsActions.updateDefaultMessageAttributes, (state: SqsQueueDetailsState) => ({...state, loading: true})),
    on(sqsQueueDetailsActions.updateDefaultMessageAttributesSuccess, (state: SqsQueueDetailsState, {defaultMessageAttributes}) => ({...state, sqsQueueDefaultMessageAttributes: defaultMessageAttributes, loading: false})),
    on(sqsQueueDetailsActions.updateDefaultMessageAttributesFailure, (state: SqsQueueDetailsState, {error}) => ({...state, error: error, loading: false})),

    // Delete queue default message attributes
    on(sqsQueueDetailsActions.deleteDefaultMessageAttributes, (state: SqsQueueDetailsState) => ({...state, loading: true})),
    on(sqsQueueDetailsActions.deleteDefaultMessageAttributesSuccess, (state: SqsQueueDetailsState, {defaultMessageAttributes}) => ({...state, sqsQueueDefaultMessageAttributes: defaultMessageAttributes, loading: false})),
    on(sqsQueueDetailsActions.deleteDefaultMessageAttributesFailure, (state: SqsQueueDetailsState, {error}) => ({...state, error: error, loading: false})),
);