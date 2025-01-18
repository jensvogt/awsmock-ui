import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {mergeMap, of} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import {sqsQueueListActions} from './sqs-queue-list.actions';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {SqsService} from "../../service/sqs-service.component";

@Injectable()
export class SqsQueueListEffects {

    sortColumns: SortColumn[] = [];

    loadQueues$ = createEffect(() => this.actions$.pipe(
        ofType(sqsQueueListActions.loadQueues),
        mergeMap(action =>
            this.sqsService.listQueueCounters(
                action.prefix,
                action.pageSize,
                action.pageIndex,
                action.sortColumns)
                .pipe(map((queues: any) => sqsQueueListActions.loadQueuesSuccess({queues})),
                    catchError((error) =>
                        of(sqsQueueListActions.loadQueuesFailure({error: error.message}))
                    )
                )
        ),
    ));

    createQueue$ = createEffect(() => this.actions$.pipe(
        ofType(sqsQueueListActions.createQueue),
        mergeMap((action) =>
            this.sqsService.createQueue(action.name)
                .pipe(map(() => sqsQueueListActions.createQueueSuccess),
                    catchError((error) =>
                        of(sqsQueueListActions.createQueueFailure({error: error.message}))
                    )
                )
        )
    ));

    sendMessage$ = createEffect(() => this.actions$.pipe(
        ofType(sqsQueueListActions.sendMessage),
        mergeMap(action =>
            this.sqsService.sendMessage(action.queueUrl, action.message, action.delay, action.attributes)
                .pipe(map(() => sqsQueueListActions.sendMessageSuccess),
                    catchError((error) =>
                        of(sqsQueueListActions.sendMessageFailure({error: error.message}))
                    )
                )
        )
    ));

    purgeQueue$ = createEffect(() => this.actions$.pipe(
        ofType(sqsQueueListActions.purgeQueue),
        mergeMap(action =>
            this.sqsService.purgeQueue(action.queueUrl)
                .pipe(map(() => sqsQueueListActions.purgeQueueSuccess()),
                    catchError((error) =>
                        of(sqsQueueListActions.purgeQueueFailure({error: error.message}))
                    )
                )
        )
    ));

    deleteQueue$ = createEffect(() => this.actions$.pipe(
        ofType(sqsQueueListActions.deleteQueue),
        mergeMap((action) =>
            this.sqsService.deleteQueue(action.queueUrl)
                .pipe(map(() => sqsQueueListActions.deleteQueueSuccess),
                    catchError((error) =>
                        of(sqsQueueListActions.deleteQueueFailure({error: error.message}))
                    )
                )
        )
    ));

    constructor(private actions$: Actions, private sqsService: SqsService) {
    }
}
