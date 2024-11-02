import {createReducer, on} from "@ngrx/store";
import {snsTopicDetailsActions} from './sns-topic-detail.actions';
import {SnsTopicDetails} from "../../model/sns-topic-details";

export const snsTopicDetailsFeatureKey = 'sns-topic-details';

export interface SnsTopicDetailsState {
    snsTopicDetails: SnsTopicDetails;
    loading: boolean;
    error: unknown;
}

export const initialState: SnsTopicDetailsState = {
    snsTopicDetails: {} as SnsTopicDetails,
    loading: false,
    error: {}
};

export const snsTopicDetailReducer = createReducer(
    initialState,

    // Initialize
    on(snsTopicDetailsActions.initialize, (state: SnsTopicDetailsState): SnsTopicDetailsState => ({...state, loading: false})),

    // Topic list
    on(snsTopicDetailsActions.loadDetails, (state: SnsTopicDetailsState) => ({...state, loading: true})),
    on(snsTopicDetailsActions.loadDetailsSuccess, (state: SnsTopicDetailsState, {topicDetails}) => ({...state, snsTopicDetails: topicDetails, loading: false})),
    on(snsTopicDetailsActions.loadDetailsFailure, (state: SnsTopicDetailsState, {error}) => ({...state, error: error, loading: false})),
);