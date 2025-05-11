import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from "@ngrx/store";
import {transferServerListFeatureKey, TransferServerListState} from "./transfer-server-list.reducer";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {ListTransferServerCountersResponse} from "../../model/transfer-server-item";

export type SelectorType<T> = MemoizedSelector<object, T, DefaultProjectorFn<T>>;
export type SelectorFeatureType<T> = MemoizedSelector<object, T>;

const selectServerListFeature: SelectorFeatureType<TransferServerListState> =
    createFeatureSelector<TransferServerListState>(transferServerListFeatureKey);

export const selectIsLoading: SelectorType<boolean> = createSelector(
    selectServerListFeature,
    (state: TransferServerListState) => state.loading
);

export const selectPrefix: SelectorType<string> = createSelector(
    selectServerListFeature,
    (state: TransferServerListState) => state?.prefix
);

export const selectPageSize: SelectorType<number> = createSelector(
    selectServerListFeature,
    (state: TransferServerListState) => state?.pageSize
);

export const selectPageIndex: SelectorType<number> = createSelector(
    selectServerListFeature,
    (state: TransferServerListState) => state?.pageIndex
);

export const selectSortColumns: SelectorType<SortColumn[]> = createSelector(
    selectServerListFeature,
    (state: TransferServerListState) => state?.sortColumns
);

export const selectTransferServerCounters: SelectorType<ListTransferServerCountersResponse> = createSelector(
    selectServerListFeature,
    (state: TransferServerListState) => state?.listTransferServerCountersResponse
);
