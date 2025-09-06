import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {mergeMap, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {restApiListActions} from './rest-api-list.actions';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {ApiGatewayService} from "../../service/api-gateway-service.component";

@Injectable()
export class RestApiListEffects {

    sortColumns: SortColumn[] = [];

    loadRestApis$ = createEffect(() => this.actions$.pipe(
        ofType(restApiListActions.loadRestApis),
        mergeMap(action =>
            this.apiGatewayService.listRestApiCounters(action.prefix, action.pageSize, action.pageIndex, action.sortColumns)
                .pipe(map((restApis: any) => restApiListActions.loadRestApisSuccess({restApis: restApis})),
                    catchError((error) =>
                        of(restApiListActions.loadRestApisFailure({error: error.message}))
                    )
                )
        ),
    ));

    addRestApi$ = createEffect(() => this.actions$.pipe(
        ofType(restApiListActions.addRestApi),
        mergeMap(action =>
            this.apiGatewayService.addRestApi(action.request)
                .pipe(map(() => restApiListActions.addRestApiSuccess()),
                    catchError((error) =>
                        of(restApiListActions.addRestApiFailure({error: error.message}))
                    )
                )
        ),
    ));

    deleteRestApi$ = createEffect(() => this.actions$.pipe(
        ofType(restApiListActions.deleteRestApi),
        mergeMap(action =>
            this.apiGatewayService.deleteRestApi(action.id)
                .pipe(map(() => restApiListActions.deleteRestApiSuccess()),
                    catchError((error) =>
                        of(restApiListActions.deleteRestApiFailure({error: error.message}))
                    )
                )
        ),
    ));

    constructor(private readonly actions$: Actions, private readonly apiGatewayService: ApiGatewayService) {
    }
}
