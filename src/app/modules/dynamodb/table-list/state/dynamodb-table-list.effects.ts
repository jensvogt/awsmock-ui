import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {mergeMap, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {dynamodbTableListActions} from './dynamodb-table-list.actions';
import {DynamodbService} from "../../service/dynamodb.service";

@Injectable()
export class DynamodbTableListEffects {

    loadTable$ = createEffect(() => this.actions$.pipe(
        ofType(dynamodbTableListActions.loadTables),
        mergeMap(action =>
            this.dynamodbService.listTableCounters(
                action.prefix,
                action.pageSize,
                action.pageIndex,
                action.sortColumns)
                .pipe(map((tables: any) => dynamodbTableListActions.loadTablesSuccess({tables})),
                    catchError((error) =>
                        of(dynamodbTableListActions.loadTablesFailure({error: error.message}))
                    )
                )
        ),
    ));

    addTable$ = createEffect(() => this.actions$.pipe(
        ofType(dynamodbTableListActions.deleteTable),
        mergeMap(action =>
            this.dynamodbService.deleteTable(action.tableName)
                .pipe(map(() => dynamodbTableListActions.addTableSuccess()),
                    catchError((error) =>
                        of(dynamodbTableListActions.addTableFailure({error: error.message}))
                    )
                )
        )));


    deleteTable$ = createEffect(() => this.actions$.pipe(
        ofType(dynamodbTableListActions.deleteTable),
        mergeMap(action =>
            this.dynamodbService.deleteTable(action.tableName)
                .pipe(map(() => dynamodbTableListActions.deleteTableSuccess()),
                    catchError((error) =>
                        of(dynamodbTableListActions.deleteTableFailure({error: error.message}))
                    )
                )
        )));

    constructor(private actions$: Actions, private dynamodbService: DynamodbService) {
    }
}