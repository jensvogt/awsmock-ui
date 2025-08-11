import {createAction, props} from '@ngrx/store';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {S3BucketCountersResponse} from "../../model/s3-bucket-item";

export const s3BucketListActions = {
    initialize: createAction('[s3-bucket-list] initialize'),

    // Load buckets
    loadBuckets: createAction('[s3-bucket-list] Load Buckets', props<{ prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    loadBucketsSuccess: createAction('[s3-bucket-list] Load Buckets Success', props<{ buckets: S3BucketCountersResponse }>()),
    loadBucketsFailure: createAction('[s3-bucket-list] Load Buckets Error', props<{ error: string }>()),

    // Add bucket
    addBucket: createAction('[s3-bucket-list] Add Bucket', props<{ bucketName: string }>()),
    addBucketSuccess: createAction('[s3-bucket-list] Add Bucket Success'),
    addBucketFailure: createAction('[s3-bucket-list] Add Bucket Error', props<{ error: string }>()),

    // Delete bucket
    deleteBucket: createAction('[s3-bucket-list] Delete Bucket', props<{ bucketName: string }>()),
    deleteBucketSuccess: createAction('[s3-bucket-list] Delete Bucket Success'),
    deleteBucketFailure: createAction('[s3-bucket-list] Delete Bucket Error', props<{ error: string }>()),

    // Purge bucket
    purgeBucket: createAction('[s3-bucket-list] Purge Bucket', props<{ bucketName: string }>()),
    purgeBucketSuccess: createAction('[s3-bucket-list] Purge Bucket Success'),
    purgeBucketFailure: createAction('[s3-bucket-list] Purge Bucket Error', props<{ error: string }>()),

    // Purge all buckets
    purgeAllBuckets: createAction('[s3-bucket-list] Purge all bucket'),
    purgeAllBucketsSuccess: createAction('[s3-bucket-list] Purge all bucket success'),
    purgeAllBucketsFailure: createAction('[s3-bucket-list] Purge all buckets error', props<{ error: string }>())

}