import {createReducer, on} from "@ngrx/store";
import {snsTopicDetailsActions} from './sns-topic-detail.actions';
import {SnsTopicDetails} from "../../model/sns-topic-details";
import {SnsSubscriptionCountersResponse} from "../../model/sns-subscription-item";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {SnsAttributeCountersResponse} from "../../model/sns-attribute-item";
import {SnsTagCountersResponse} from "../../model/sns-tag-item";

export const snsTopicDetailsFeatureKey = 'sns-topic-details';

export interface SnsTopicDetailsState {
    snsTopicDetails: SnsTopicDetails;
    // Subscription
    snsTopicSubscriptions: SnsSubscriptionCountersResponse;
    subscriptionPageSize: number,
    subscriptionPageIndex: number,
    subscriptionSortColumns: SortColumn[],
    // Tags
    snsTopicTags: SnsTagCountersResponse;
    tagPageSize: number,
    tagPageIndex: number,
    tagSortColumns: SortColumn[],
    // Attributes
    snsTopicAttributes: SnsAttributeCountersResponse;
    attributePageSize: number,
    attributePageIndex: number,
    attributeSortColumns: SortColumn[],
    loading: boolean;
    error: unknown;
}

export const initialState: SnsTopicDetailsState = {
    snsTopicDetails: {} as SnsTopicDetails,
    // Subscriptions
    snsTopicSubscriptions: {} as SnsSubscriptionCountersResponse,
    subscriptionPageSize: 10,
    subscriptionPageIndex: 0,
    subscriptionSortColumns: [{column: 'endpoint', sortDirection: -1}],
    // Tags
    snsTopicTags: {} as SnsTagCountersResponse,
    tagPageSize: 10,
    tagPageIndex: 0,
    tagSortColumns: [{column: 'endpoint', sortDirection: -1}],
    // Attributes
    snsTopicAttributes: {} as SnsAttributeCountersResponse,
    attributePageSize: 10,
    attributePageIndex: 0,
    attributeSortColumns: [{column: 'endpoint', sortDirection: -1}],
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
    on(snsTopicDetailsActions.loadSubscriptionsSuccess, (state: SnsTopicDetailsState, {subscriptions}) => ({...state, snsTopicSubscriptions: subscriptions, loading: false})),
    on(snsTopicDetailsActions.loadSubscriptionsFailure, (state: SnsTopicDetailsState, {error}) => ({...state, error: error, loading: false})),

    // Topic tags
    on(snsTopicDetailsActions.loadTags, (state: SnsTopicDetailsState) => ({...state, loading: true})),
    on(snsTopicDetailsActions.loadTagsSuccess, (state: SnsTopicDetailsState, {tags}) => ({...state, snsTopicTags: tags, loading: false})),
    on(snsTopicDetailsActions.loadTagsFailure, (state: SnsTopicDetailsState, {error}) => ({...state, error: error, loading: false})),

    // Topic attributes
    on(snsTopicDetailsActions.loadAttributes, (state: SnsTopicDetailsState) => ({...state, loading: true})),
    on(snsTopicDetailsActions.loadAttributesSuccess, (state: SnsTopicDetailsState, {attributes}) => ({...state, snsTopicAttributes: attributes, loading: false})),
    on(snsTopicDetailsActions.loadAttributesFailure, (state: SnsTopicDetailsState, {error}) => ({...state, error: error, loading: false})),
);