import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {mergeMap, of} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import {sqsMessageListActions} from './sqs-message-list.actions';
import {SqsService} from "../../service/sqs-service.component";

@Injectable()
export class SqsMessageListEffects {

    loadMessages$ = createEffect(() => this.actions$.pipe(
        ofType(sqsMessageListActions.loadMessages),
        mergeMap(action =>
            this.sqsService.listMessageCounters(
                action.queueArn,
                action.prefix,
                action.pageSize,
                action.pageIndex,
                action.sortColumns)
                .pipe(map((messages: any) => sqsMessageListActions.loadMessagesSuccess({messages})),
                    catchError((error) =>
                        of(sqsMessageListActions.loadMessagesFailure({error: error.message}))
                    )
                )
        ),
    ));

    updateMessage$ = createEffect(() => this.actions$.pipe(
        ofType(sqsMessageListActions.updateMessage),
        mergeMap(action =>
            this.sqsService.updateMessage(action.messageId, action.messageAttributes)
                .pipe(map(() => sqsMessageListActions.updateMessageSuccess()),
                    catchError((error) =>
                        of(sqsMessageListActions.updateMessageFailure({error: error.message}))
                    )
                )
        )));

    deleteMessage$ = createEffect(() => this.actions$.pipe(
        ofType(sqsMessageListActions.deleteMessage),
        mergeMap(action =>
            this.sqsService.deleteMessage(action.queueUrl, action.receiptHandle)
                .pipe(map(() => sqsMessageListActions.deleteMessageSuccess()),
                    catchError((error) =>
                        of(sqsMessageListActions.deleteMessageFailure({error: error.message}))
                    )
                )
        )));

    addAttribute$ = createEffect(() => this.actions$.pipe(
        ofType(sqsMessageListActions.addMessageAttribute),
        mergeMap(action =>
            this.sqsService.addMessageAttribute(action.messageId, action.name, action.dataType, action.value)
                .pipe(map(() => sqsMessageListActions.addMessageAttributeSuccess()),
                    catchError((error) =>
                        of(sqsMessageListActions.addMessageAttributeFailure({error: error.message}))
                    )
                )
        )));

    deleteAttribute$ = createEffect(() => this.actions$.pipe(
        ofType(sqsMessageListActions.deleteMessageAttribute),
        mergeMap(action =>
            this.sqsService.deleteMessageAttribute(action.messageId, action.attributeName)
                .pipe(map(() => sqsMessageListActions.deleteMessageAttributeSuccess()),
                    catchError((error) =>
                        of(sqsMessageListActions.deleteMessageAttributeFailure({error: error.message}))
                    )
                )
        )));

    constructor(private readonly actions$: Actions, private readonly sqsService: SqsService) {
    }
}