import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, mergeMap, of} from 'rxjs';
import {s3BucketListActions} from './s3-bucket-list.actions';
import {AwsMockHttpService} from "../../../../services/awsmock-http.service";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {S3Service} from "../../service/s3-service.component";
import {map} from "rxjs/operators";

@Injectable()
export class S3BucketListEffects {

    sortColumns: SortColumn[] = [];

    loadBucketCounters$ = createEffect(() => this.actions$.pipe(
        ofType(s3BucketListActions.loadBuckets),
        mergeMap(action =>
            this.s3Service.listBucketCounters(
                action.prefix,
                action.pageSize,
                action.pageIndex,
                action.sortColumns)
                .pipe(map((buckets: any) => s3BucketListActions.loadBucketsSuccess({buckets})),
                    catchError((error) =>
                        of(s3BucketListActions.loadBucketsFailure({error: error.message}))
                    )
                )
        )
    ));

    addQueue$ = createEffect(() => this.actions$.pipe(
        ofType(s3BucketListActions.addBucket),
        mergeMap(action =>
            this.s3Service.createBucket(action.bucketName)
                .then(() => s3BucketListActions.addBucketSuccess()))
    ));

    deleteBucket$ = createEffect(() => this.actions$.pipe(
        ofType(s3BucketListActions.deleteBucket),
        mergeMap(action =>
            this.s3Service.deleteBucket(action.bucketName)
                .then(() => s3BucketListActions.deleteBucketSuccess()))
    ));

    purgeBucket$ = createEffect(() => this.actions$.pipe(
        ofType(s3BucketListActions.purgeBucket),
        mergeMap(action =>
            this.s3Service.purgeBucket(action.bucketName)
                .pipe(map((buckets: any) => s3BucketListActions.loadBucketsSuccess({buckets})),
                    catchError((error) =>
                        of(s3BucketListActions.loadBucketsFailure({error: error.message}))
                    )
                )
        )
    ));

    constructor(private actions$: Actions, private awsmockHttpService: AwsMockHttpService, private s3Service: S3Service) {
    }
}