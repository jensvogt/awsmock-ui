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

    constructor(private actions$: Actions, private sqsService: SqsService) {
    }
}