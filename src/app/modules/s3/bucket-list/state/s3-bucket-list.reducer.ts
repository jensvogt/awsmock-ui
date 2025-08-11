import {createReducer, on} from "@ngrx/store";
import {s3BucketListActions} from './s3-bucket-list.actions';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {S3BucketCountersResponse} from "../../model/s3-bucket-item"

export const s3BucketListFeatureKey = 's3-bucket-list';

export interface S3BucketListState {
    s3BucketCounters: S3BucketCountersResponse;
    bucketName: string,
    prefix: string;
    pageSize: number;
    pageIndex: number;
    loading: boolean;
    sortColumns: SortColumn[];
    total: number;
    error: unknown;
}

export const initialState: S3BucketListState = {
    s3BucketCounters: {total: 0, bucketCounters: []},
    bucketName: '',
    prefix: '',
    pageSize: 10,
    pageIndex: 0,
    loading: false,
    sortColumns: [{column: 'keys', sortDirection: -1}],
    total: 0,
    error: {}
};

export const s3BucketListReducer = createReducer(
    initialState,

    // Initialize
    on(s3BucketListActions.initialize, (state: S3BucketListState): S3BucketListState => ({...state, pageIndex: 0, pageSize: 10, loading: true})),

    // Bucket list
    on(s3BucketListActions.loadBuckets, (state: S3BucketListState) => ({...state, loading: true})),
    on(s3BucketListActions.loadBucketsSuccess, (state: S3BucketListState, {buckets}) => ({...state, s3BucketCounters: buckets})),
    on(s3BucketListActions.loadBucketsFailure, (state: S3BucketListState, {error}) => ({...state, error: error})),

    // Add bucket
    on(s3BucketListActions.addBucket, (state: S3BucketListState) => ({...state, loading: true})),
    on(s3BucketListActions.addBucketSuccess, (state: S3BucketListState) => ({...state})),
    on(s3BucketListActions.addBucketFailure, (state: S3BucketListState, {error}) => ({...state, error: error})),

    // Purge bucket
    on(s3BucketListActions.purgeBucket, (state: S3BucketListState) => ({...state, loading: true})),
    on(s3BucketListActions.purgeBucketSuccess, (state: S3BucketListState) => ({...state})),
    on(s3BucketListActions.purgeBucketFailure, (state: S3BucketListState, {error}) => ({...state, error: error})),

    // Purge all buckets
    on(s3BucketListActions.purgeAllBuckets, (state: S3BucketListState) => ({...state, loading: true})),
    on(s3BucketListActions.purgeAllBucketsSuccess, (state: S3BucketListState) => ({...state})),
    on(s3BucketListActions.purgeAllBucketsFailure, (state: S3BucketListState, {error}) => ({...state, error: error})),
);