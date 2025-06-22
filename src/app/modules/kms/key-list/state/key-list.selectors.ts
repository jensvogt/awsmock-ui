import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from "@ngrx/store";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {kmsKeyListFeatureKey, KMSKeyListState} from "./key-list.reducer";
import {ListKeyCountersResponse} from "../../model/key-item";

export type SelectorType<T> = MemoizedSelector<object, T, DefaultProjectorFn<T>>;
export type SelectorFeatureType<T> = MemoizedSelector<object, T>;

const selectKeyListFeature: SelectorFeatureType<KMSKeyListState> =
    createFeatureSelector<KMSKeyListState>(kmsKeyListFeatureKey);

export const selectIsLoading: SelectorType<boolean> = createSelector(
    selectKeyListFeature,
    (state: KMSKeyListState) => state.loading
);

export const selectPrefix: SelectorType<string> = createSelector(
    selectKeyListFeature,
    (state: KMSKeyListState) => state?.prefix
);

export const selectPageSize: SelectorType<number> = createSelector(
    selectKeyListFeature,
    (state: KMSKeyListState) => state?.pageSize
);

export const selectPageIndex: SelectorType<number> = createSelector(
    selectKeyListFeature,
    (state: KMSKeyListState) => state?.pageIndex
);

export const selectSortColumns: SelectorType<SortColumn[]> = createSelector(
    selectKeyListFeature,
    (state: KMSKeyListState) => state?.sortColumns
);

export const selectKeyCounters: SelectorType<ListKeyCountersResponse> = createSelector(
    selectKeyListFeature,
    (state: KMSKeyListState) => state?.listKeyResponse
);

export const selectKeyError: SelectorType<any> = createSelector(
    selectKeyListFeature,
    (state: KMSKeyListState) => state?.error
);
