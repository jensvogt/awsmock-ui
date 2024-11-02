import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from "@ngrx/store";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {s3ObjectListFeatureKey, S3ObjectListState} from "./s3-object-list.reducer";
import {S3ObjectCounterResponse} from "../../model/s3-object-item";

export type SelectorType<T> = MemoizedSelector<object, T, DefaultProjectorFn<T>>;
export type SelectorFeatureType<T> = MemoizedSelector<object, T>;

const selectObjectListFeature: SelectorFeatureType<S3ObjectListState> =
    createFeatureSelector<S3ObjectListState>(s3ObjectListFeatureKey);

export const selectIsLoading: SelectorType<boolean> = createSelector(
    selectObjectListFeature,
    (state: S3ObjectListState) => state.loading
);

export const selectPrefix: SelectorType<string> = createSelector(
    selectObjectListFeature,
    (state: S3ObjectListState) => state?.prefix
);

export const selectPageSize: SelectorType<number> = createSelector(
    selectObjectListFeature,
    (state: S3ObjectListState) => state?.pageSize
);

export const selectPageIndex: SelectorType<number> = createSelector(
    selectObjectListFeature,
    (state: S3ObjectListState) => state?.pageIndex
);

export const selectSortColumns: SelectorType<SortColumn[]> = createSelector(
    selectObjectListFeature,
    (state: S3ObjectListState) => state?.sortColumns
);

export const selectObjectCounters: SelectorType<S3ObjectCounterResponse> = createSelector(
    selectObjectListFeature,
    (state: S3ObjectListState) => state?.s3ObjectCounters
);
