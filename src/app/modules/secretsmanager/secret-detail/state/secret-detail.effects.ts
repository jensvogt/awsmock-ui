import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {mergeMap, of} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {secretDetailsActions} from "./secret-detail.actions";
import {SecretsmanagerService} from "../../service/secretsmanager-service.component";
import {LambdaService} from "../../../lambda/service/lambda-service.component";

@Injectable()
export class SecretDetailEffects {

    sortColumns: SortColumn[] = [];

    loadSecretDetails$ = createEffect(() => this.actions$.pipe(
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

    updateSecretDetails$ = createEffect(() => this.actions$.pipe(
        ofType(secretDetailsActions.updateDetails),
        mergeMap(action =>
            this.secretsmanagerService.updateSecretDetails(action.secretDetails)
                .pipe(map((details: any) =>
                        secretDetailsActions.updateDetailsSuccess({secretDetails: details})),
                    catchError((error) =>
                        of(secretDetailsActions.updateDetailsFailure({error: error.message}))
                    )
                )
        ),
    ));

    rotateSecretDetails$ = createEffect(() => this.actions$.pipe(
        ofType(secretDetailsActions.rotateSecret),
        mergeMap(action =>
            this.secretsmanagerService.rotateSecret(action.rotateSecretRequest)
                .pipe(map((details: any) =>
                        secretDetailsActions.rotateSecretSuccess({secretDetails: details})),
                    catchError((error) =>
                        of(secretDetailsActions.rotateSecretFailure({error: error.message}))
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

    loadRotationLambdaARNs$ = createEffect(() => this.actions$.pipe(
        ofType(secretDetailsActions.loadLambdasARNs),
        mergeMap(action =>
            this.lambdaService.listLambdaArns()
                .pipe(map((loadLambdaArnsResponse: any) =>
                        secretDetailsActions.loadLambdasARNsSuccess({loadLambdaArnsResponse})),
                    catchError((error) =>
                        of(secretDetailsActions.loadLambdasARNsFailure({error: error.message}))
                    )
                )
        ),
    ));

    constructor(private readonly actions$: Actions, private readonly secretsmanagerService: SecretsmanagerService, private readonly lambdaService: LambdaService) {
    }
}