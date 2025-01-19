import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from "@ngrx/store";
import {dynamodbItemListFeatureKey, DynamodbItemListState} from "./dynamodb-item-list.reducer";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {ItemCountersResponse} from "../../model/item-item";

export type SelectorType<T> = MemoizedSelector<object, T, DefaultProjectorFn<T>>;
export type SelectorFeatureType<T> = MemoizedSelector<object, T>;

const selectItemListFeature: SelectorFeatureType<DynamodbItemListState> =
    createFeatureSelector<DynamodbItemListState>(dynamodbItemListFeatureKey);

export const selectIsLoading: SelectorType<boolean> = createSelector(
    selectItemListFeature,
    (state: DynamodbItemListState) => state.loading
);

export const selectPrefix: SelectorType<string> = createSelector(
    selectItemListFeature,
    (state: DynamodbItemListState) => state?.prefix
);

export const selectPageSize: SelectorType<number> = createSelector(
    selectItemListFeature,
    (state: DynamodbItemListState) => state?.pageSize
);

export const selectPageIndex: SelectorType<number> = createSelector(
    selectItemListFeature,
    (state: DynamodbItemListState) => state?.pageIndex
);

export const selectSortColumns: SelectorType<SortColumn[]> = createSelector(
    selectItemListFeature,
    (state: DynamodbItemListState) => state?.sortColumns
);

export const selectItemCounters: SelectorType<ItemCountersResponse> = createSelector(
    selectItemListFeature,
    (state: DynamodbItemListState) => state?.listItemResponse
);
