import {createReducer, on} from "@ngrx/store";
import {sqsQueueDetailsActions} from './sqs-queue-detail.actions';
import {SqsQueueDetails} from "../../model/sqs-queue-details";

export const sqsQueueDetailsFeatureKey = 'sqs-queue-details';

export interface SqsQueueDetailsState {
    sqsQueueDetails: SqsQueueDetails;
    loading: boolean;
    error: unknown;
}

export const initialState: SqsQueueDetailsState = {
    sqsQueueDetails: {} as SqsQueueDetails,
    loading: false,
    error: {}
};

export const sqsQueueDetailReducer = createReducer(
    initialState,

    // Initialize
    on(sqsQueueDetailsActions.initialize, (state: SqsQueueDetailsState): SqsQueueDetailsState => ({...state, loading: false})),

    // Queue list
    on(sqsQueueDetailsActions.loadDetails, (state: SqsQueueDetailsState) => ({...state, loading: true})),
    on(sqsQueueDetailsActions.loadDetailsSuccess, (state: SqsQueueDetailsState, {queueDetails}) => ({...state, sqsQueueDetails: queueDetails, loading: false})),
    on(sqsQueueDetailsActions.loadDetailsFailure, (state: SqsQueueDetailsState, {error}) => ({...state, error: error, loading: false})),
);