import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {mergeMap, of} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import {sqsQueueListActions} from './queue-list.actions';
import {AwsMockHttpService} from "../../../../services/awsmock-http.service";
import {SortColumn} from "../../../../shared/sorting/sorting.component";

@Injectable()
export class QueueListEffects {

    sortColumns: SortColumn[] = [];

    loadQueues$ = createEffect(() => this.actions$.pipe(
        ofType(sqsQueueListActions.loadQueues),
        mergeMap(() =>
            this.awsmockHttpService.listQueueCounters(
                sqsQueueListActions.loadQueues.arguments.prefix,
                sqsQueueListActions.loadQueues.arguments.pageSize,
                sqsQueueListActions.loadQueues.arguments.pageIndex,
                sqsQueueListActions.loadQueues.arguments.sortColumns)
                .pipe(map((queues: any) => sqsQueueListActions.loadQueuesSuccess({queues})),
                    catchError((error) =>
                        of(sqsQueueListActions.loadQueuesFailure({error: error.message}))
                    )
                )
        ),
    ));

    constructor(private actions$: Actions, private awsmockHttpService: AwsMockHttpService) {
    }
}