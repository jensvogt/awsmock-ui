import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {mergeMap, of} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import {sqsQueueDetailsActions} from './sqs-queue-detail.actions';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {SqsService} from "../../service/sqs-service.component";

@Injectable()
export class SqsQueueDetailEffects {

    sortColumns: SortColumn[] = [];

    loadQueuesDetails$ = createEffect(() => this.actions$.pipe(
        ofType(sqsQueueDetailsActions.loadDetails),
        mergeMap(action =>
            this.sqsService.getQueueDetails(action.queueArn)
                .pipe(map((details: any) =>
                        sqsQueueDetailsActions.loadDetailsSuccess({queueDetails: details})),
                    catchError((error) =>
                        of(sqsQueueDetailsActions.loadDetailsFailure({error: error.message}))
                    )
                )
        ),
    ));

    loadQueueAttributes$ = createEffect(() => this.actions$.pipe(
        ofType(sqsQueueDetailsActions.loadAttributes),
        mergeMap(action =>
            this.sqsService.listQueueAttributeCounters(action.queueArn, action.pageSize, action.pageIndex, action.sortColumns)
                .pipe(map((attributes: any) =>
                        sqsQueueDetailsActions.loadAttributesSuccess({attributes})),
                    catchError((error) =>
                        of(sqsQueueDetailsActions.loadAttributesFailure({error: error.message}))
                    )
                )
        ),
    ));

    loadLambdaTriggers$ = createEffect(() => this.actions$.pipe(
        ofType(sqsQueueDetailsActions.loadLambdaTriggers),
        mergeMap(action =>
            this.sqsService.listLambdaTriggerCounters(action.queueArn, action.pageSize, action.pageIndex, action.sortColumns)
                .pipe(map((lambdaTriggers: any) =>
                        sqsQueueDetailsActions.loadLambdaTriggersSuccess({lambdaTriggers})),
                    catchError((error) =>
                        of(sqsQueueDetailsActions.loadLambdaTriggersFailure({error: error.message}))
                    )
                )
        ),
    ));

    loadQueueTags$ = createEffect(() => this.actions$.pipe(
        ofType(sqsQueueDetailsActions.loadTags),
        mergeMap(action =>
            this.sqsService.listTagCounters(action.queueArn, action.pageSize, action.pageIndex, action.sortColumns)
                .pipe(map((tags: any) =>
                        sqsQueueDetailsActions.loadTagsSuccess({tags})),
                    catchError((error) =>
                        of(sqsQueueDetailsActions.loadTagsFailure({error: error.message}))
                    )
                )
        ),
    ));

    loadQueueDefaultMessageAttributes$ = createEffect(() => this.actions$.pipe(
        ofType(sqsQueueDetailsActions.loadDefaultMessageAttributes),
        mergeMap(action =>
            this.sqsService.listDefaultMessageAttributeCounters(action.queueArn, action.pageSize, action.pageIndex, action.sortColumns)
                .pipe(map((defaultMessageAttributes: any) =>
                        sqsQueueDetailsActions.loadDefaultMessageAttributesSuccess({defaultMessageAttributes})),
                    catchError((error) =>
                        of(sqsQueueDetailsActions.loadDefaultMessageAttributesFailure({error: error.message}))
                    )
                )
        ),
    ));

    addQueueDefaultMessageAttributes$ = createEffect(() => this.actions$.pipe(
        ofType(sqsQueueDetailsActions.addDefaultMessageAttributes),
        mergeMap(action =>
            this.sqsService.addDefaultMessageAttributeCounters(action.queueArn, action.name, action.value, action.dataType)
                .pipe(map((defaultMessageAttributes: any) =>
                        sqsQueueDetailsActions.addDefaultMessageAttributesSuccess({defaultMessageAttributes})),
                    catchError((error) =>
                        of(sqsQueueDetailsActions.addDefaultMessageAttributesFailure({error: error.message}))
                    )
                )
        ),
    ));

    updateQueueDefaultMessageAttributes$ = createEffect(() => this.actions$.pipe(
        ofType(sqsQueueDetailsActions.updateDefaultMessageAttributes),
        mergeMap(action =>
            this.sqsService.updateDefaultMessageAttributeCounters(action.queueArn, action.name, action.value, action.dataType)
                .pipe(map((defaultMessageAttributes: any) =>
                        sqsQueueDetailsActions.updateDefaultMessageAttributesSuccess({defaultMessageAttributes})),
                    catchError((error) =>
                        of(sqsQueueDetailsActions.updateDefaultMessageAttributesFailure({error: error.message}))
                    )
                )
        ),
    ));

    deleteQueueDefaultMessageAttributes$ = createEffect(() => this.actions$.pipe(
        ofType(sqsQueueDetailsActions.deleteDefaultMessageAttributes),
        mergeMap(action =>
            this.sqsService.deleteDefaultMessageAttributeCounters(action.queueArn, action.name)
                .pipe(map((defaultMessageAttributes: any) =>
                        sqsQueueDetailsActions.deleteDefaultMessageAttributesSuccess({defaultMessageAttributes})),
                    catchError((error) =>
                        of(sqsQueueDetailsActions.deleteDefaultMessageAttributesFailure({error: error.message}))
                    )
                )
        ),
    ));

    constructor(private readonly actions$: Actions, private readonly sqsService: SqsService) {
    }
}