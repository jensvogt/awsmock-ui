import {createAction, props} from '@ngrx/store';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {S3ObjectCounterResponse, S3ObjectMetadata} from "../../model/s3-object-item";

export const s3ObjectListActions = {
    initialize: createAction('[s3-object-list] initialize'),

    // Load objects
    loadObjects: createAction('[s3-object-list] Load Objects', props<{
        bucket: string,
        prefix: string,
        pageSize: number,
        pageIndex: number,
        sortColumns: SortColumn[]
    }>()),
    loadObjectsSuccess: createAction('[s3-object-list] Load Objects Success', props<{ objects: S3ObjectCounterResponse }>()),
    loadObjectsFailure: createAction('[s3-object-list] Load Objects Error', props<{ error: string }>()),

    // Update object
    updateObject: createAction('[s3-object-list] Update Object', props<{ bucketName: string, key: string, metadata: S3ObjectMetadata[] }>()),
    updateObjectSuccess: createAction('[s3-object-list] Update Object Success'),
    updateObjectFailure: createAction('[s3-object-list] Update Object Error', props<{ error: string }>()),

    // Delete object
    touchObject: createAction('[s3-object-list] Touch Object', props<{ bucketName: string, key: string }>()),
    touchObjectSuccess: createAction('[s3-object-list] Touch Object Success'),
    touchObjectFailure: createAction('[s3-object-list] Touch Object Error', props<{ error: string }>()),

    // Delete object
    deleteObject: createAction('[s3-object-list] Delete Object', props<{ bucketName: string, key: string }>()),
    deleteObjectSuccess: createAction('[s3-object-list] Delete Object Success'),
    deleteObjectFailure: createAction('[s3-object-list] Delete Object Error', props<{ error: string }>()),
}