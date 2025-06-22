import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from "@ngrx/store";
import {kmsKeyDetailsFeatureKey, KmsKeyDetailsState} from "./kms-key-detail.reducer";
import {KeyDetailsResponse} from "../../model/key-details";

export type SelectorType<T> = MemoizedSelector<object, T, DefaultProjectorFn<T>>;
export type SelectorFeatureType<T> = MemoizedSelector<object, T>;

const selectTopicDetailsFeature: SelectorFeatureType<KmsKeyDetailsState> =
    createFeatureSelector<KmsKeyDetailsState>(kmsKeyDetailsFeatureKey);

export const selectDetails: SelectorType<KeyDetailsResponse> = createSelector(
    selectTopicDetailsFeature,
    (state: KmsKeyDetailsState) => state?.kmsKeyDetails
);

// export const selectTags: SelectorType<SnsTagCountersResponse> = createSelector(
//     selectTopicDetailsFeature,
//     (state: SnsTopicDetailsState) => state?.snsTopicTags
// );
//
// export const selectTagPageSize: SelectorType<number> = createSelector(
//     selectTopicDetailsFeature,
//     (state: SnsTopicDetailsState) => state?.tagPageSize
// );
//
// export const selectTagPageIndex: SelectorType<number> = createSelector(
//     selectTopicDetailsFeature,
//     (state: SnsTopicDetailsState) => state?.tagPageIndex
// );

export const selectError: SelectorType<any> = createSelector(
    selectTopicDetailsFeature,
    (state: KmsKeyDetailsState) => state?.error
);
