import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from "@ngrx/store";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {applicationListFeatureKey, ApplicationListState} from "./application-list.reducer";
import {ListApplicationCountersResponse} from "../../model/application-item";

export type SelectorType<T> = MemoizedSelector<object, T, DefaultProjectorFn<T>>;
export type SelectorFeatureType<T> = MemoizedSelector<object, T>;

const selectApplicationListFeature: SelectorFeatureType<ApplicationListState> =
    createFeatureSelector<ApplicationListState>(applicationListFeatureKey);

export const selectPrefix: SelectorType<string> = createSelector(
    selectApplicationListFeature,
    (state: ApplicationListState) => state?.prefix
);

export const selectPageSize: SelectorType<number> = createSelector(
    selectApplicationListFeature,
    (state: ApplicationListState) => state?.pageSize
);

export const selectPageIndex: SelectorType<number> = createSelector(
    selectApplicationListFeature,
    (state: ApplicationListState) => state?.pageIndex
);

export const selectSortColumns: SelectorType<SortColumn[]> = createSelector(
    selectApplicationListFeature,
    (state: ApplicationListState) => state?.sortColumns
);

export const selectApplicationCounters: SelectorType<ListApplicationCountersResponse> = createSelector(
    selectApplicationListFeature,
    (state: ApplicationListState) => state?.listApplicationResponse
);
