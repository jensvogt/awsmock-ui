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

    addQueue$ = createEffect(() => this.actions$.pipe(
        ofType(sqsQueueListActions.addQueue),
        mergeMap(action =>
            this.sqsService.saveQueue(action.name)
                .then(() => sqsQueueListActions.addQueueSuccess()))
    ));

    purgeQueue$ = createEffect(() => this.actions$.pipe(
        ofType(sqsQueueListActions.purgeQueue),
        mergeMap(action =>
            this.sqsService.purgeQueue(action.queueUrl)
                .then(() => sqsQueueListActions.addQueueSuccess()))
    ));

    deleteQueue$ = createEffect(() => this.actions$.pipe(
        ofType(sqsQueueListActions.deleteQueue),
        mergeMap(action =>
            this.sqsService.deleteQueue(action.queueUrl)
                .then(() => sqsQueueListActions.addQueueSuccess()))
    ));

    constructor(private actions$: Actions, private sqsService: SqsService) {
    }
}