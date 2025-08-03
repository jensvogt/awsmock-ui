import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, mergeMap, of} from 'rxjs';
import {tableDetailsActions} from './table-details.actions';
import {map} from "rxjs/operators";
import {DynamodbService} from "../../service/dynamodb.service";

@Injectable()
export class DynamodbTableDetailEffects {

    loadTable$ = createEffect(() => this.actions$.pipe(
        ofType(tableDetailsActions.loadTable),
        mergeMap(action =>
            this.dynamodbService.getTable(action.request)
                .pipe(map((getTableResponse: any) => tableDetailsActions.loadTableSuccess({getTableResponse})),
                    catchError((error) =>
                        of(tableDetailsActions.loadTableFailure({error: error.message}))
                    )
                )
        )
    ));

    updateTable$ = createEffect(() => this.actions$.pipe(
        ofType(tableDetailsActions.updateTable),
        mergeMap(action =>
            this.dynamodbService.updateTable(action.request)
                .pipe(map((getTableResponse: any) => tableDetailsActions.updateTableSuccess({getTableResponse})),
                    catchError((error) =>
                        of(tableDetailsActions.updateTableFailure({error: error.message}))
                    )
                )
        )
    ));

    constructor(private readonly actions$: Actions, private readonly dynamodbService: DynamodbService) {
    }
}