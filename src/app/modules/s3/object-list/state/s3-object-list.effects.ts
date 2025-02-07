import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, mergeMap, of} from 'rxjs';
import {s3ObjectListActions} from './s3-object-list.actions';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {S3Service} from "../../service/s3-service.component";
import {map} from "rxjs/operators";

@Injectable()
export class S3ObjectListEffects {

    sortColumns: SortColumn[] = [];

    loadBucketCounters$ = createEffect(() => this.actions$.pipe(
        ofType(s3ObjectListActions.loadObjects),
        mergeMap(action =>
            this.s3Service.listObjectsCounters(
                action.bucketName,
                action.prefix,
                action.pageSize,
                action.pageIndex,
                action.sortColumns)
                .pipe(map((objects: any) => s3ObjectListActions.loadObjectsSuccess({objects})),
                    catchError((error) =>
                        of(s3ObjectListActions.loadObjectsFailure({error: error.message}))
                    )
                )
        )
    ));

    touchObject$ = createEffect(() => this.actions$.pipe(
        ofType(s3ObjectListActions.touchObject),
        mergeMap(action =>
            this.s3Service.touchObject(action.bucketName, action.key)
                .pipe(map(() => s3ObjectListActions.touchObjectSuccess),
                    catchError((error) =>
                        of(s3ObjectListActions.touchObjectFailure({error: error.message}))
                    )
                )
        )));

    deleteObject$ = createEffect(() => this.actions$.pipe(
        ofType(s3ObjectListActions.deleteObject),
        mergeMap(action =>
            this.s3Service.deleteObject(action.bucketName, action.key)
                .then(() => s3ObjectListActions.deleteObjectSuccess()))
    ));

    constructor(private actions$: Actions, private s3Service: S3Service) {
    }
}