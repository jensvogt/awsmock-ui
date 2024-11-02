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

    addTopic$ = createEffect(() => this.actions$.pipe(
        ofType(snsTopicListActions.addTopic),
        mergeMap(action =>
            this.snsService.addTopic(action.name)
                .then(() => snsTopicListActions.addTopicSuccess()))
    ));

    /*    purgeTopic$ = createEffect(() => this.actions$.pipe(
            ofType(snsTopicListActions.purgeTopic),
            mergeMap(action =>
                this.snsService.purgeTopic(action.topicUrl)
                    .then(() => snsTopicListActions.addTopicSuccess()))
        ));*/

    deleteTopic$ = createEffect(() => this.actions$.pipe(
        ofType(snsTopicListActions.deleteTopic),
        mergeMap(action =>
            this.snsService.deleteTopic(action.topicUrl)
                .then(() => snsTopicListActions.addTopicSuccess()))
    ));

    constructor(private actions$: Actions, private snsService: SnsService) {
    }
}