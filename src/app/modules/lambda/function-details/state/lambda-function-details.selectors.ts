import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from "@ngrx/store";
import {lambdaFunctionDetailsFeatureKey, LambdaFunctionDetailsState} from "./lambda-function-details.reducer";
import {LambdaFunctionItem} from "../../model/function-item";
import {LambdaTagCountersResponse} from "../../model/lambda-tag-item";

export type SelectorType<T> = MemoizedSelector<object, T, DefaultProjectorFn<T>>;
export type SelectorFeatureType<T> = MemoizedSelector<object, T>;

const selectFunctionDetailsFeature: SelectorFeatureType<LambdaFunctionDetailsState> =
    createFeatureSelector<LambdaFunctionDetailsState>(lambdaFunctionDetailsFeatureKey);

export const selectIsLoading: SelectorType<boolean> = createSelector(
    selectFunctionDetailsFeature,
    (state: LambdaFunctionDetailsState) => state.loading
);

export const selectFunctionItem: SelectorType<LambdaFunctionItem> = createSelector(
    selectFunctionDetailsFeature,
    (state: LambdaFunctionDetailsState) => state?.functionItem
);

export const selectTags: SelectorType<LambdaTagCountersResponse> = createSelector(
    selectFunctionDetailsFeature,
    (state: LambdaFunctionDetailsState) => state?.lambdaTags
);

export const selectTagPageSize: SelectorType<number> = createSelector(
    selectFunctionDetailsFeature,
    (state: LambdaFunctionDetailsState) => state?.tagPageSize
);

export const selectTagPageIndex: SelectorType<number> = createSelector(
    selectFunctionDetailsFeature,
    (state: LambdaFunctionDetailsState) => state?.tagPageIndex
);

export const selectError: SelectorType<any> = createSelector(
    selectFunctionDetailsFeature,
    (state: LambdaFunctionDetailsState) => state?.error
);

