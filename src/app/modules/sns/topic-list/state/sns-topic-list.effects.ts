import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {mergeMap, of} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import {snsTopicListActions} from './sns-topic-list.actions';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {SnsService} from "../../service/sns-service.component";

@Injectable()
export class SnsTopicListEffects {

    sortColumns: SortColumn[] = [];

    loadTopics$ = createEffect(() => this.actions$.pipe(
        ofType(snsTopicListActions.loadTopics),
        mergeMap(action =>
            this.snsService.listTopicCounters(
                action.prefix,
                action.pageSize,
                action.pageIndex,
                action.sortColumns)
                .pipe(map((topics: any) => snsTopicListActions.loadTopicsSuccess({topics})),
                    catchError((error) =>
                        of(snsTopicListActions.loadTopicsFailure({error: error.message}))
                    )
                )
        ),
    ));

    /*addTopic$ = createEffect(() => this.actions$.pipe(
        ofType(restApiListActions.addTopic),
        mergeMap(action =>
            this.snsService.createTopic(action.name)
                .then(() => restApiListActions.addTopicSuccess()))
    ));*/

    publishMessage$ = createEffect(() => this.actions$.pipe(
        ofType(snsTopicListActions.publishMessage),
        mergeMap(action =>
            this.snsService.publishMessage(action.topicArn, action.message, action.attributes)
                .pipe(map(() => snsTopicListActions.publishMessageSuccess),
                    catchError((error) =>
                        of(snsTopicListActions.publishMessageFailure({error: error.message}))
                    )
                )
        )
    ));

    purgeTopic$ = createEffect(() => this.actions$.pipe(
        ofType(snsTopicListActions.purgeTopic),
        mergeMap(action =>
            this.snsService.purgeTopic(action.topicArn)
                .pipe(map(() => snsTopicListActions.purgeTopicSuccess()),
                    catchError((error) =>
                        of(snsTopicListActions.purgeTopicFailure({error: error.message}))
                    )
                )
        )
    ));

    /* deleteTopic$ = createEffect(() => this.actions$.pipe(
         ofType(restApiListActions.deleteTopic),
         mergeMap(action =>
             this.snsService.deleteTopic(action.topicArn)
                 .then(() => restApiListActions.addTopicSuccess()))
     ));*/

    constructor(private actions$: Actions, private snsService: SnsService) {
    }
}