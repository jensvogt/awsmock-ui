import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from "@ngrx/store";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {ssmParameterListFeatureKey, SsmParameterListState} from "./ssm-parameter-list.reducer";
import {ListParameterCountersResponse} from "../../model/ssm-parameter-item";

export type SelectorType<T> = MemoizedSelector<object, T, DefaultProjectorFn<T>>;
export type SelectorFeatureType<T> = MemoizedSelector<object, T>;

const selectQueueListFeature: SelectorFeatureType<SsmParameterListState> =
    createFeatureSelector<SsmParameterListState>(ssmParameterListFeatureKey);

export const selectIsLoading: SelectorType<boolean> = createSelector(
    selectQueueListFeature,
    (state: SsmParameterListState) => state.loading
);

export const selectPrefix: SelectorType<string> = createSelector(
    selectQueueListFeature,
    (state: SsmParameterListState) => state?.prefix
);

export const selectPageSize: SelectorType<number> = createSelector(
    selectQueueListFeature,
    (state: SsmParameterListState) => state?.pageSize
);

export const selectPageIndex: SelectorType<number> = createSelector(
    selectQueueListFeature,
    (state: SsmParameterListState) => state?.pageIndex
);

export const selectSortColumns: SelectorType<SortColumn[]> = createSelector(
    selectQueueListFeature,
    (state: SsmParameterListState) => state?.sortColumns
);

export const selectParameterCounters: SelectorType<ListParameterCountersResponse> = createSelector(
    selectQueueListFeature,
    (state: SsmParameterListState) => state?.listParameterResponse
);
