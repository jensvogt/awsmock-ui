import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from "@ngrx/store";
import {snsTopicDetailsFeatureKey, SnsTopicDetailsState} from "./sns-topic-detail.reducer";
import {SnsTopicDetails} from "../../model/sns-topic-details";
import {SnsSubscriptionCountersResponse} from "../../model/sns-subscription-item";
import {SnsAttributeCountersResponse} from "../../model/sns-attribute-item";
import {SnsTagCountersResponse} from "../../model/sns-tag-item";

export type SelectorType<T> = MemoizedSelector<object, T, DefaultProjectorFn<T>>;
export type SelectorFeatureType<T> = MemoizedSelector<object, T>;

const selectTopicDetailsFeature: SelectorFeatureType<SnsTopicDetailsState> =
    createFeatureSelector<SnsTopicDetailsState>(snsTopicDetailsFeatureKey);

export const selectDetails: SelectorType<SnsTopicDetails> = createSelector(
    selectTopicDetailsFeature,
    (state: SnsTopicDetailsState) => state?.snsTopicDetails
);

export const selectSubscriptions: SelectorType<SnsSubscriptionCountersResponse> = createSelector(
    selectTopicDetailsFeature,
    (state: SnsTopicDetailsState) => state?.snsTopicSubscriptions
);

export const selectSubscriptionPageSize: SelectorType<number> = createSelector(
    selectTopicDetailsFeature,
    (state: SnsTopicDetailsState) => state?.subscriptionPageSize
);

export const selectSubscriptionPageIndex: SelectorType<number> = createSelector(
    selectTopicDetailsFeature,
    (state: SnsTopicDetailsState) => state?.subscriptionPageIndex
);

export const selectTags: SelectorType<SnsTagCountersResponse> = createSelector(
    selectTopicDetailsFeature,
    (state: SnsTopicDetailsState) => state?.snsTopicTags
);

export const selectTagPageSize: SelectorType<number> = createSelector(
    selectTopicDetailsFeature,
    (state: SnsTopicDetailsState) => state?.tagPageSize
);

export const selectTagPageIndex: SelectorType<number> = createSelector(
    selectTopicDetailsFeature,
    (state: SnsTopicDetailsState) => state?.tagPageIndex
);

export const selectAttributes: SelectorType<SnsAttributeCountersResponse> = createSelector(
    selectTopicDetailsFeature,
    (state: SnsTopicDetailsState) => state?.snsTopicAttributes
);

export const selectAttributePageSize: SelectorType<number> = createSelector(
    selectTopicDetailsFeature,
    (state: SnsTopicDetailsState) => state?.attributePageSize
);

export const selectAttributePageIndex: SelectorType<number> = createSelector(
    selectTopicDetailsFeature,
    (state: SnsTopicDetailsState) => state?.attributePageIndex
);

export const selectError: SelectorType<any> = createSelector(
    selectTopicDetailsFeature,
    (state: SnsTopicDetailsState) => state?.error
);
