import {createReducer, on} from "@ngrx/store";
import {sqsQueueDetailsActions} from './sqs-queue-detail.actions';
import {SqsQueueDetails} from "../../model/sqs-queue-details";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {SqsAttributeCountersResponse} from "../../model/sqs-attribute-item";
import {SqsTagCountersResponse} from "../../model/sqs-tag-item";

export const sqsQueueDetailsFeatureKey = 'sqs-queue-details';

export interface SqsQueueDetailsState {
    sqsQueueDetails: SqsQueueDetails;

    // Attributes
    sqsQueueAttributes: SqsAttributeCountersResponse;
    attributePageSize: number,
    attributePageIndex: number,
    attributeSortColumns: SortColumn[],

    // Tags
    sqsQueueTags: SqsTagCountersResponse;
    tagPageSize: number,
    tagPageIndex: number,
    tagSortColumns: SortColumn[],

    loading: boolean;
    error: unknown;
}

export const initialState: SqsQueueDetailsState = {
    sqsQueueDetails: {} as SqsQueueDetails,

    // Attributes
    sqsQueueAttributes: {} as SqsAttributeCountersResponse,
    attributePageSize: 10,
    attributePageIndex: 0,
    attributeSortColumns: [{column: 'endpoint', sortDirection: -1}],

    // Tags
    sqsQueueTags: {} as SqsTagCountersResponse,
    tagPageSize: 10,
    tagPageIndex: 0,
    tagSortColumns: [{column: 'endpoint', sortDirection: -1}],

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

    // Topic tags
    on(sqsQueueDetailsActions.loadTags, (state: SqsQueueDetailsState) => ({...state, loading: true})),
    on(sqsQueueDetailsActions.loadTagsSuccess, (state: SqsQueueDetailsState, {tags}) => ({...state, sqsQueueTags: tags, loading: false})),
    on(sqsQueueDetailsActions.loadTagsFailure, (state: SqsQueueDetailsState, {error}) => ({...state, error: error, loading: false})),
);