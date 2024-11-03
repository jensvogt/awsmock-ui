import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {mergeMap, of} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import {snsMessageListActions} from './sns-message-list.actions';
import {SnsService} from "../../service/sns-service.component";

@Injectable()
export class SnsMessageListEffects {

    loadMessages$ = createEffect(() => this.actions$.pipe(
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

    publishMessage$ = createEffect(() => this.actions$.pipe(
        ofType(snsMessageListActions.publishMessage),
        mergeMap(action =>
            this.snsService.publishMessage(action.topicArn, action.message)
                .then(() => snsMessageListActions.publishMessageSuccess())
                .catch((error: any) => snsMessageListActions.publishMessageFailure({error: error}))
                .finally(() => this.snsService.cleanup)
        )
    ));

    deleteMessage$ = createEffect(() => this.actions$.pipe(
        ofType(snsMessageListActions.deleteMessage),
        mergeMap(action =>
            this.snsService.deleteMessage(action.topicArn, action.messageId)
                .pipe(map(() => snsMessageListActions.deleteMessageSuccess()),
                    catchError((error) =>
                        of(snsMessageListActions.deleteMessageFailure({error: error.message}))
                    )
                )
        )
    ));

    constructor(private actions$: Actions, private snsService: SnsService) {
    }
}