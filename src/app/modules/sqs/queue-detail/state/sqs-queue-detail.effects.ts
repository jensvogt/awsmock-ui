import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {mergeMap, of} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import {sqsQueueDetailsActions} from './sqs-queue-detail.actions';
import {AwsMockHttpService} from "../../../../services/awsmock-http.service";
import {SortColumn} from "../../../../shared/sorting/sorting.component";

@Injectable()
export class SqsQueueDetailEffects {

    sortColumns: SortColumn[] = [];

    loadQueuesDetails$ = createEffect(() => this.actions$.pipe(
        ofType(sqsQueueDetailsActions.loadDetails),
        mergeMap(action =>
            this.awsmockService.getQueueDetails(action.queueArn)
                .pipe(map((details: any) =>
                        sqsQueueDetailsActions.loadDetailsSuccess({queueDetails: details})),
                    catchError((error) =>
                        of(sqsQueueDetailsActions.loadDetailsFailure({error: error.message}))
                    )
                )
        ),
    ));

    constructor(private actions$: Actions, private awsmockService: AwsMockHttpService) {
    }
}