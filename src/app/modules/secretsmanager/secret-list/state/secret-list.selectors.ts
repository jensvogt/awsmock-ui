import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from "@ngrx/store";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {secretListFeatureKey, SecretListState} from "./secret-list.reducer";
import {ListSecretCountersResponse} from "../../model/secret-item";

export type SelectorType<T> = MemoizedSelector<object, T, DefaultProjectorFn<T>>;
export type SelectorFeatureType<T> = MemoizedSelector<object, T>;

const selectSecretListFeature: SelectorFeatureType<SecretListState> =
    createFeatureSelector<SecretListState>(secretListFeatureKey);

export const selectIsLoading: SelectorType<boolean> = createSelector(
    selectSecretListFeature,
    (state: SecretListState) => state.loading
);

export const selectPrefix: SelectorType<string> = createSelector(
    selectSecretListFeature,
    (state: SecretListState) => state?.prefix
);

export const selectPageSize: SelectorType<number> = createSelector(
    selectSecretListFeature,
    (state: SecretListState) => state?.pageSize
);

export const selectPageIndex: SelectorType<number> = createSelector(
    selectSecretListFeature,
    (state: SecretListState) => state?.pageIndex
);

export const selectSortColumns: SelectorType<SortColumn[]> = createSelector(
    selectSecretListFeature,
    (state: SecretListState) => state?.sortColumns
);

export const selectSecretCounters: SelectorType<ListSecretCountersResponse> = createSelector(
    selectSecretListFeature,
    (state: SecretListState) => state?.listSecretResponse
);

export const selectReload: SelectorType<boolean> = createSelector(
    selectSecretListFeature,
    (state: SecretListState) => state?.reload
);

