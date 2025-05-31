import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {mergeMap, of} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import {secretListActions} from './secret-list.actions';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {SecretsmanagerService} from "../../service/secretsmanager-service.component";

@Injectable()
export class SecretListEffects {

    sortColumns: SortColumn[] = [];

    loadSecrets$ = createEffect(() => this.actions$.pipe(
        ofType(secretListActions.loadSecrets),
        mergeMap(action =>
            this.secretsmanagerService.listSecretCounters(
                action.prefix,
                action.pageSize,
                action.pageIndex,
                action.sortColumns)
                .pipe(map((secrets: any) => secretListActions.loadSecretsSuccess({secrets})),
                    catchError((error) =>
                        of(secretListActions.loadSecretsFailure({error: error.message}))
                    )
                )
        ),
    ));

    /*
        createSecret$ = createEffect(() => this.actions$.pipe(
            ofType(secretListActions.createSecret),
            mergeMap((action) =>
                this.secretsmanagerService.createSecret(action.name)
                    .pipe(map(() => secretListActions.createSecretSuccess),
                        catchError((error) =>
                            of(secretListActions.createSecretFailure({error: error.message}))
                        )
                    )
            )
        ));

        sendMessage$ = createEffect(() => this.actions$.pipe(
            ofType(secretListActions.sendMessage),
            mergeMap(action =>
                this.secretsmanagerService.sendMessage(action.secretId, action.message, action.delay, action.attributes)
                    .pipe(map(() => secretListActions.sendMessageSuccess),
                        catchError((error) =>
                            of(secretListActions.sendMessageFailure({error: error.message}))
                        )
                    )
            )
        ));

        purgeSecret$ = createEffect(() => this.actions$.pipe(
            ofType(secretListActions.purgeSecret),
            mergeMap(action =>
                this.secretsmanagerService.purgeSecret(action.secretId)
                    .pipe(map(() => secretListActions.purgeSecretSuccess()),
                        catchError((error) =>
                            of(secretListActions.purgeSecretFailure({error: error.message}))
                        )
                    )
            )
        ));

        deleteSecret$ = createEffect(() => this.actions$.pipe(
            ofType(secretListActions.deleteSecret),
            mergeMap((action) =>
                this.secretsmanagerService.deleteSecret(action.secretId)
                    .pipe(map(() => secretListActions.deleteSecretSuccess),
                        catchError((error) =>
                            of(secretListActions.deleteSecretFailure({error: error.message}))
                        )
                    )
            )
        ));
    */
    constructor(private actions$: Actions, private secretsmanagerService: SecretsmanagerService) {
    }
}
