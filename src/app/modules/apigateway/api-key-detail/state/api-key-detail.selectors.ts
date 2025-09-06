import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from "@ngrx/store";
import {apiKeyDetailsFeatureKey, ApiKeyDetailsState} from "./api-key-detail.reducer";
import {ApiKeyDetailsResponse} from "../../model/api-key-item";

export type SelectorType<T> = MemoizedSelector<object, T, DefaultProjectorFn<T>>;
export type SelectorFeatureType<T> = MemoizedSelector<object, T>;

const selectTopicDetailsFeature: SelectorFeatureType<ApiKeyDetailsState> =
    createFeatureSelector<ApiKeyDetailsState>(apiKeyDetailsFeatureKey);

export const selectDetails: SelectorType<ApiKeyDetailsResponse> = createSelector(
    selectTopicDetailsFeature,
    (state: ApiKeyDetailsState) => state?.apiKeyDetails
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
    (state: ApiKeyDetailsState) => state?.error
);
