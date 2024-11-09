import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from "@ngrx/store";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {lambdaFunctionListFeatureKey, LambdaFunctionListState} from "./lambda-function-list.reducer";
import {LambdaFunctionCountersResponse} from "../../model/function-item";

export type SelectorType<T> = MemoizedSelector<object, T, DefaultProjectorFn<T>>;
export type SelectorFeatureType<T> = MemoizedSelector<object, T>;

const selectBucketListFeature: SelectorFeatureType<LambdaFunctionListState> =
    createFeatureSelector<LambdaFunctionListState>(lambdaFunctionListFeatureKey);

export const selectIsLoading: SelectorType<boolean> = createSelector(
    selectBucketListFeature,
    (state: LambdaFunctionListState) => state.loading
);

export const selectTotal: SelectorType<number> = createSelector(
    selectBucketListFeature,
    (state: LambdaFunctionListState) => state.total
);

export const selectFunctionName: SelectorType<string> = createSelector(
    selectBucketListFeature,
    (state: LambdaFunctionListState) => state?.name
);

export const selectPrefix: SelectorType<string> = createSelector(
    selectBucketListFeature,
    (state: LambdaFunctionListState) => state?.prefix
);

export const selectPageSize: SelectorType<number> = createSelector(
    selectBucketListFeature,
    (state: LambdaFunctionListState) => state?.pageSize
);

export const selectPageIndex: SelectorType<number> = createSelector(
    selectBucketListFeature,
    (state: LambdaFunctionListState) => state?.pageIndex
);

export const selectSortColumns: SelectorType<SortColumn[]> = createSelector(
    selectBucketListFeature,
    (state: LambdaFunctionListState) => state?.sortColumns
);

export const selectFunctionCounters: SelectorType<LambdaFunctionCountersResponse> = createSelector(
    selectBucketListFeature,
    (state: LambdaFunctionListState) => state?.functionCounters
);
