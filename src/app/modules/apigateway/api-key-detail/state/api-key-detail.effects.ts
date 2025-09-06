import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {mergeMap, of} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import {apiKeyDetailsActions} from "./api-key-detail.actions";
import {ApiGatewayService} from "../../service/api-gateway-service.component";

@Injectable()
export class ApiKeyDetailEffects {

    loadKeyDetails$ = createEffect(() => this.actions$.pipe(
        ofType(apiKeyDetailsActions.loadDetails),
        mergeMap(action =>
            this.apiGatewayService.getApiKeyDetails(action.keyId)
                .pipe(map((keyDetails: any) =>
                        apiKeyDetailsActions.loadDetailsSuccess({keyDetails: keyDetails})),
                    catchError((error) =>
                        of(apiKeyDetailsActions.loadDetailsFailure({error: error.message}))
                    )
                )
        ),
    ));

    updateKeyDetails$ = createEffect(() => this.actions$.pipe(
        ofType(apiKeyDetailsActions.updateApiKey),
        mergeMap(action =>
            this.apiGatewayService.updateApiKey(action.request)
                .pipe(map(() =>
                        apiKeyDetailsActions.updateApiKeySuccess()),
                    catchError((error) =>
                        of(apiKeyDetailsActions.updateApiKeyFailure({error: error.message}))
                    )
                )
        ),
    ));

    constructor(private readonly actions$: Actions, private readonly apiGatewayService: ApiGatewayService) {
    }
}