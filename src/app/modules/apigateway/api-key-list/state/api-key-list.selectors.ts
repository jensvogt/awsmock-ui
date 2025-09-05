import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from "@ngrx/store";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {apiKeysListFeatureKey, ApiKeysListState} from "./api-key-list.reducer";
import {ListApiKeyCountersResponse} from "../../model/api-key-item";

export type SelectorType<T> = MemoizedSelector<object, T, DefaultProjectorFn<T>>;
export type SelectorFeatureType<T> = MemoizedSelector<object, T>;

const selectApplicationListFeature: SelectorFeatureType<ApiKeysListState> =
    createFeatureSelector<ApiKeysListState>(apiKeysListFeatureKey);

export const selectPrefix: SelectorType<string> = createSelector(
    selectApplicationListFeature,
    (state: ApiKeysListState) => state?.prefix
);

export const selectPageSize: SelectorType<number> = createSelector(
    selectApplicationListFeature,
    (state: ApiKeysListState) => state?.pageSize
);

export const selectPageIndex: SelectorType<number> = createSelector(
    selectApplicationListFeature,
    (state: ApiKeysListState) => state?.pageIndex
);

export const selectSortColumns: SelectorType<SortColumn[]> = createSelector(
    selectApplicationListFeature,
    (state: ApiKeysListState) => state?.sortColumns
);

export const selectApiKeysCounters: SelectorType<ListApiKeyCountersResponse> = createSelector(
    selectApplicationListFeature,
    (state: ApiKeysListState) => state?.listApiKeysResponse
);
