import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {mergeMap, of} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {secretDetailsActions} from "./secret-detail.actions";
import {SecretsmanagerService} from "../../service/secretsmanager-service.component";

@Injectable()
export class SecretDetailEffects {

    sortColumns: SortColumn[] = [];

    loadQueuesDetails$ = createEffect(() => this.actions$.pipe(
        ofType(secretDetailsActions.loadDetails),
        mergeMap(action =>
            this.secretsmanagerService.getSecretDetails(action.secretId)
                .pipe(map((details: any) =>
                        secretDetailsActions.loadDetailsSuccess({secretDetails: details})),
                    catchError((error) =>
                        of(secretDetailsActions.loadDetailsFailure({error: error.message}))
                    )
                )
        ),
    ));

    loadSecretVersions$ = createEffect(() => this.actions$.pipe(
        ofType(secretDetailsActions.loadVersions),
        mergeMap(action =>
            this.secretsmanagerService.listSecretVersionCounters(action.secretId, action.pageSize, action.pageIndex, action.sortColumns)
                .pipe(map((secretVersions: any) =>
                        secretDetailsActions.loadVersionsSuccess({secretVersions})),
                    catchError((error) =>
                        of(secretDetailsActions.loadVersionsFailure({error: error.message}))
                    )
                )
        ),
    ));

    /*

            loadQueueTags$ = createEffect(() => this.actions$.pipe(
                ofType(secretDetailsActions.loadTags),
                mergeMap(action =>
                    this.sqsService.listTagCounters(action.queueArn, action.pageSize, action.pageIndex, action.sortColumns)
                        .pipe(map((tags: any) =>
                                secretDetailsActions.loadTagsSuccess({tags})),
                            catchError((error) =>
                                of(secretDetailsActions.loadTagsFailure({error: error.message}))
                            )
                        )
                ),
            ));
        */
    constructor(private actions$: Actions, private secretsmanagerService: SecretsmanagerService) {
    }
}