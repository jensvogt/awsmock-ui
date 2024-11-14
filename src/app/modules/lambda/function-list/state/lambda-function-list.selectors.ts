import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from "@ngrx/store";
import {lambdaFunctionListFeatureKey, LambdaFunctionListState} from "./lambda-function-list.reducer";
import {LambdaFunctionCountersResponse} from "../../model/function-item";

export type SelectorType<T> = MemoizedSelector<object, T, DefaultProjectorFn<T>>;
export type SelectorFeatureType<T> = MemoizedSelector<object, T>;

const selectFunctionListFeature: SelectorFeatureType<LambdaFunctionListState> =
    createFeatureSelector<LambdaFunctionListState>(lambdaFunctionListFeatureKey);

export const selectIsLoading: SelectorType<boolean> = createSelector(
    selectFunctionListFeature,
    (state: LambdaFunctionListState) => state.loading
);

export const selectTotal: SelectorType<number> = createSelector(
    selectFunctionListFeature,
    (state: LambdaFunctionListState) => state.total
);

export const selectPrefix: SelectorType<string> = createSelector(
    selectFunctionListFeature,
    (state: LambdaFunctionListState) => state?.prefix
);

export const selectPageSize: SelectorType<number> = createSelector(
    selectFunctionListFeature,
    (state: LambdaFunctionListState) => state?.pageSize
);

export const selectPageIndex: SelectorType<number> = createSelector(
    selectFunctionListFeature,
    (state: LambdaFunctionListState) => state?.pageIndex
);

export const selectFunctionCounters: SelectorType<LambdaFunctionCountersResponse> = createSelector(
    selectFunctionListFeature,
    (state: LambdaFunctionListState) => state?.functionCounters
);
