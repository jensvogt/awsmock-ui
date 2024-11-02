import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from "@ngrx/store";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {s3BucketListFeatureKey, S3BucketListState} from "./s3-bucket-list.reducer";
import {S3BucketCountersResponse} from "../../model/s3-bucket-item";

export type SelectorType<T> = MemoizedSelector<object, T, DefaultProjectorFn<T>>;
export type SelectorFeatureType<T> = MemoizedSelector<object, T>;

const selectBucketListFeature: SelectorFeatureType<S3BucketListState> =
    createFeatureSelector<S3BucketListState>(s3BucketListFeatureKey);

export const selectIsLoading: SelectorType<boolean> = createSelector(
    selectBucketListFeature,
    (state: S3BucketListState) => state.loading
);

export const selectBucketName: SelectorType<string> = createSelector(
    selectBucketListFeature,
    (state: S3BucketListState) => state?.bucketName
);

export const selectPrefix: SelectorType<string> = createSelector(
    selectBucketListFeature,
    (state: S3BucketListState) => state?.prefix
);

export const selectPageSize: SelectorType<number> = createSelector(
    selectBucketListFeature,
    (state: S3BucketListState) => state?.pageSize
);

export const selectPageIndex: SelectorType<number> = createSelector(
    selectBucketListFeature,
    (state: S3BucketListState) => state?.pageIndex
);

export const selectSortColumns: SelectorType<SortColumn[]> = createSelector(
    selectBucketListFeature,
    (state: S3BucketListState) => state?.sortColumns
);

export const selectBucketCounters: SelectorType<S3BucketCountersResponse> = createSelector(
    selectBucketListFeature,
    (state: S3BucketListState) => state?.s3BucketCounters
);
