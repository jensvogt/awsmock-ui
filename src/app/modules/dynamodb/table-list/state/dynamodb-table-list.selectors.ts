import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from "@ngrx/store";
import {dynamodbTableListFeatureKey, DynamodbTableListState} from "./dynamodb-table-list.reducer";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {TableCountersResponse} from "../../model/table-item";

export type SelectorType<T> = MemoizedSelector<object, T, DefaultProjectorFn<T>>;
export type SelectorFeatureType<T> = MemoizedSelector<object, T>;

const selectTableListFeature: SelectorFeatureType<DynamodbTableListState> =
    createFeatureSelector<DynamodbTableListState>(dynamodbTableListFeatureKey);

export const selectIsLoading: SelectorType<boolean> = createSelector(
    selectTableListFeature,
    (state: DynamodbTableListState) => state.loading
);

export const selectPrefix: SelectorType<string> = createSelector(
    selectTableListFeature,
    (state: DynamodbTableListState) => state?.prefix
);

export const selectPageSize: SelectorType<number> = createSelector(
    selectTableListFeature,
    (state: DynamodbTableListState) => state?.pageSize
);

export const selectPageIndex: SelectorType<number> = createSelector(
    selectTableListFeature,
    (state: DynamodbTableListState) => state?.pageIndex
);

export const selectSortColumns: SelectorType<SortColumn[]> = createSelector(
    selectTableListFeature,
    (state: DynamodbTableListState) => state?.sortColumns
);

export const selectTableCounters: SelectorType<TableCountersResponse> = createSelector(
    selectTableListFeature,
    (state: DynamodbTableListState) => state?.listTableResponse
);
