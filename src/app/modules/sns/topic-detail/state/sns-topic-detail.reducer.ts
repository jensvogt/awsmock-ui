import {createReducer, on} from "@ngrx/store";
import {snsTopicDetailsActions} from './sns-topic-detail.actions';
import {SnsTopicDetails} from "../../model/sns-topic-details";
import {SnsSubscriptionCountersResponse} from "../../model/sns-subscription-item";
import {SortColumn} from "../../../../shared/sorting/sorting.component";

export const snsTopicDetailsFeatureKey = 'sns-topic-details';

export interface SnsTopicDetailsState {
    snsTopicDetails: SnsTopicDetails;
    snsTopicSubscriptions: SnsSubscriptionCountersResponse;
    subscriptionPageSize: number,
    subscriptionPageIndex: number,
    subscriptionSortColumns: SortColumn[],
    loading: boolean;
    error: unknown;
}

export const initialState: SnsTopicDetailsState = {
    snsTopicDetails: {} as SnsTopicDetails,
    snsTopicSubscriptions: {} as SnsSubscriptionCountersResponse,
    subscriptionPageSize: 10,
    subscriptionPageIndex: 0,
    subscriptionSortColumns: [{column: 'endpoint', sortDirection: -1}],
    loading: false,
    error: {}
};

export const snsTopicDetailReducer = createReducer(
    initialState,

    // Initialize
    on(snsTopicDetailsActions.initialize, (state: SnsTopicDetailsState): SnsTopicDetailsState => ({...state, loading: false})),

    // Topic details
    on(snsTopicDetailsActions.loadDetails, (state: SnsTopicDetailsState) => ({...state, loading: true})),
    on(snsTopicDetailsActions.loadDetailsSuccess, (state: SnsTopicDetailsState, {topicDetails}) => ({...state, snsTopicDetails: topicDetails, loading: false})),
    on(snsTopicDetailsActions.loadDetailsFailure, (state: SnsTopicDetailsState, {error}) => ({...state, error: error, loading: false})),

    // Topic subscriptions
    on(snsTopicDetailsActions.loadSubscriptions, (state: SnsTopicDetailsState) => ({...state, loading: true})),
    on(snsTopicDetailsActions.loadSubscriptionsSuccess, (state: SnsTopicDetailsState, {subscriptions}) => ({
        ...state,
        snsTopicSubscriptions: subscriptions,
        loading: false
    })),
    on(snsTopicDetailsActions.loadSubscriptionsFailure, (state: SnsTopicDetailsState, {error}) => ({...state, error: error, loading: false})),
);