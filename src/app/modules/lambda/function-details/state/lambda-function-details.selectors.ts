import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from "@ngrx/store";
import {lambdaFunctionDetailsFeatureKey, LambdaFunctionDetailsState} from "./lambda-function-details.reducer";
import {LambdaFunctionItem} from "../../model/function-item";

export type SelectorType<T> = MemoizedSelector<object, T, DefaultProjectorFn<T>>;
export type SelectorFeatureType<T> = MemoizedSelector<object, T>;

const selectFunctionListFeature: SelectorFeatureType<LambdaFunctionDetailsState> =
    createFeatureSelector<LambdaFunctionDetailsState>(lambdaFunctionDetailsFeatureKey);

export const selectIsLoading: SelectorType<boolean> = createSelector(
    selectFunctionListFeature,
    (state: LambdaFunctionDetailsState) => state.loading
);

export const selectFunctionItem: SelectorType<LambdaFunctionItem> = createSelector(
    selectFunctionListFeature,
    (state: LambdaFunctionDetailsState) => state?.functionItem
);
