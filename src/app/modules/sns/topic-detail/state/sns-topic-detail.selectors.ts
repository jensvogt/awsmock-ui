import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from "@ngrx/store";
import {snsTopicDetailsFeatureKey, SnsTopicDetailsState} from "./sqs-queue-detail.reducer";
import {SnsTopicDetails} from "../../model/sns-topic-details";

export type SelectorType<T> = MemoizedSelector<object, T, DefaultProjectorFn<T>>;
export type SelectorFeatureType<T> = MemoizedSelector<object, T>;

const selectTopicDetailsFeature: SelectorFeatureType<SnsTopicDetailsState> =
    createFeatureSelector<SnsTopicDetailsState>(snsTopicDetailsFeatureKey);

export const selectDetails: SelectorType<SnsTopicDetails> = createSelector(
    selectTopicDetailsFeature,
    (state: SnsTopicDetailsState) => state?.snsTopicDetails
);

export const selectError: SelectorType<any> = createSelector(
    selectTopicDetailsFeature,
    (state: SnsTopicDetailsState) => state?.error
);
