import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {mergeMap, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {apiKeyListActions} from './api-key-list.actions';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {ApiGatewayService} from "../../service/api-gateway-service.component";

@Injectable()
export class ApiKeyListEffects {

    sortColumns: SortColumn[] = [];

    loadApiKeys$ = createEffect(() => this.actions$.pipe(
        ofType(apiKeyListActions.loadApiKeys),
        mergeMap(action =>
            this.apiGatewayService.listApiKeyCounters(action.prefix, action.pageSize, action.pageIndex, action.sortColumns)
                .pipe(map((apiKeys: any) => apiKeyListActions.loadApiKeysSuccess({apiKeys: apiKeys})),
                    catchError((error) =>
                        of(apiKeyListActions.loadApiKeysFailure({error: error.message}))
                    )
                )
        ),
    ));

    addApiKey$ = createEffect(() => this.actions$.pipe(
        ofType(apiKeyListActions.addApiKey),
        mergeMap(action =>
            this.apiGatewayService.addApiKey(action.request)
                .pipe(map(() => apiKeyListActions.addApiKeySuccess()),
                    catchError((error) =>
                        of(apiKeyListActions.addApiKeyFailure({error: error.message}))
                    )
                )
        ),
    ));

    deleteApiKey$ = createEffect(() => this.actions$.pipe(
        ofType(apiKeyListActions.deleteApiKey),
        mergeMap(action =>
            this.apiGatewayService.deleteApiKey(action.id)
                .pipe(map(() => apiKeyListActions.deleteApiKeySuccess()),
                    catchError((error) =>
                        of(apiKeyListActions.deleteApiKeyFailure({error: error.message}))
                    )
                )
        ),
    ));

    constructor(private readonly actions$: Actions, private readonly apiGatewayService: ApiGatewayService) {
    }
}
