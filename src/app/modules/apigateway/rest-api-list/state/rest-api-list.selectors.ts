import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from "@ngrx/store";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {restApisListFeatureKey, RestApisListState} from "./rest-api-list.reducer";
import {ListRestApiCountersResponse} from "../../model/rest-api-item";

export type SelectorType<T> = MemoizedSelector<object, T, DefaultProjectorFn<T>>;
export type SelectorFeatureType<T> = MemoizedSelector<object, T>;

const selectRestApiListFeature: SelectorFeatureType<RestApisListState> =
    createFeatureSelector<RestApisListState>(restApisListFeatureKey);

export const selectPrefix: SelectorType<string> = createSelector(
    selectRestApiListFeature,
    (state: RestApisListState) => state?.prefix
);

export const selectPageSize: SelectorType<number> = createSelector(
    selectRestApiListFeature,
    (state: RestApisListState) => state?.pageSize
);

export const selectPageIndex: SelectorType<number> = createSelector(
    selectRestApiListFeature,
    (state: RestApisListState) => state?.pageIndex
);

export const selectSortColumns: SelectorType<SortColumn[]> = createSelector(
    selectRestApiListFeature,
    (state: RestApisListState) => state?.sortColumns
);

export const selectRestApisCounters: SelectorType<ListRestApiCountersResponse> = createSelector(
    selectRestApiListFeature,
    (state: RestApisListState) => state?.listRestApisResponse
);
