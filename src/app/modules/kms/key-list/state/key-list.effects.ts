import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {mergeMap, of} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import {keyListActions} from './key-list.actions';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {KmsService} from "../../service/kms-service.component";

@Injectable()
export class KMSKeyListEffects {

    sortColumns: SortColumn[] = [];

    loadTopics$ = createEffect(() => this.actions$.pipe(
        ofType(keyListActions.loadKeys),
        mergeMap(action =>
            this.kmsService.listKeyCounters(
                action.prefix,
                action.pageSize,
                action.pageIndex,
                action.sortColumns)
                .pipe(map((keys: any) => keyListActions.loadKeysSuccess({keys})),
                    catchError((error) =>
                        of(keyListActions.loadKeysFailure({error: error.message}))
                    )
                )
        ),
    ));

    /*addTopic$ = createEffect(() => this.actions$.pipe(
        ofType(keyListActions.addTopic),
        mergeMap(action =>
            this.snsService.createTopic(action.name)
                .then(() => keyListActions.addTopicSuccess()))
    ));*/

    /* deleteTopic$ = createEffect(() => this.actions$.pipe(
         ofType(keyListActions.deleteTopic),
         mergeMap(action =>
             this.snsService.deleteTopic(action.topicArn)
                 .then(() => keyListActions.addTopicSuccess()))
     ));*/

    constructor(private readonly actions$: Actions, private readonly kmsService: KmsService) {
    }
}