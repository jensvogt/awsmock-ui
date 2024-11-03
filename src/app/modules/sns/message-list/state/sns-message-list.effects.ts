import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {mergeMap, of} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import {snsMessageListActions} from './sns-message-list.actions';
import {SnsService} from "../../service/sns-service.component";

@Injectable()
export class SnsMessageListEffects {

    loadTopics$ = createEffect(() => this.actions$.pipe(
        ofType(snsMessageListActions.loadMessages),
        mergeMap(action =>
            this.snsService.listMessageCounters(
                action.topicArn,
                action.pageSize,
                action.pageIndex,
                action.sortColumns)
                .pipe(map((messages: any) => snsMessageListActions.loadMessagesSuccess({messages})),
                    catchError((error) =>
                        of(snsMessageListActions.loadMessagesFailure({error: error.message}))
                    )
                )
        ),
    ));

    /*    addTopic$ = createEffect(() => this.actions$.pipe(
            ofType(snsMessageListActions.addTopic),
            mergeMap(action =>
                this.snsService.addTopic(action.name)
                    .then(() => snsMessageListActions.addTopicSuccess()))
        ));*/

    /*    purgeTopic$ = createEffect(() => this.actions$.pipe(
            ofType(snsMessageListActions.purgeTopic),
            mergeMap(action =>
                this.snsService.purgeTopic(action.topicUrl)
                    .then(() => snsMessageListActions.addTopicSuccess()))
        ));*/

    /*deleteTopic$ = createEffect(() => this.actions$.pipe(
        ofType(snsMessageListActions.deleteTopic),
        mergeMap(action =>
            this.snsService.deleteTopic(action.topicUrl)
                .then(() => snsMessageListActions.addTopicSuccess()))
    ));*/

    constructor(private actions$: Actions, private snsService: SnsService) {
    }
}