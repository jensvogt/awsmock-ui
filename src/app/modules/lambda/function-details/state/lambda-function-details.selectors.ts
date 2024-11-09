import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from "@ngrx/store";
import {lambdaFunctionDetailsFeatureKey, LambdaFunctionDetailsState} from "./lambda-function-details.reducer";
import {LambdaFunctionItem} from "../../model/function-item";

export type SelectorType<T> = MemoizedSelector<object, T, DefaultProjectorFn<T>>;
export type SelectorFeatureType<T> = MemoizedSelector<object, T>;

const selectBucketListFeature: SelectorFeatureType<LambdaFunctionDetailsState> =
    createFeatureSelector<LambdaFunctionDetailsState>(lambdaFunctionDetailsFeatureKey);

export const selectIsLoading: SelectorType<boolean> = createSelector(
    selectBucketListFeature,
    (state: LambdaFunctionDetailsState) => state.loading
);

export const selectFunctionItem: SelectorType<LambdaFunctionItem> = createSelector(
    selectBucketListFeature,
    (state: LambdaFunctionDetailsState) => state?.functionItem
);
