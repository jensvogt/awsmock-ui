import {Actions, createEffect, ofType} from '@ngrx/effects';
import {mergeMap, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {dynamodbItemListActions} from './dynamodb-item-list.actions';
import {DynamodbService} from "../../service/dynamodb.service";
import {Injectable} from "@angular/core";

@Injectable()
export class DynamodbItemListEffects {

    loadItem$ = createEffect(() => this.actions$.pipe(
        ofType(dynamodbItemListActions.loadItems),
        mergeMap(action =>
            this.dynamodbService.listItemCounters(
                action.tableName,
                action.prefix,
                action.pageSize,
                action.pageIndex,
                action.sortColumns)
                .pipe(map((items: any) => dynamodbItemListActions.loadItemsSuccess({items})),
                    catchError((error) =>
                        of(dynamodbItemListActions.loadItemsFailure({error: error.message}))
                    )
                )
        ),
    ));

    /* putItem$ = createEffect(() => this.actions$.pipe(
         ofType(dynamodbItemListActions.putItem),
         mergeMap(action =>
             this.dynamodbService.putItem(action.tableName)
                 .pipe(map(() => dynamodbItemListActions.addItemSuccess()),
                     catchError((error) =>
                         of(dynamodbItemListActions.addItemFailure({error: error.message}))
                     )
                 )
         )));*/

    constructor(private actions$: Actions, private dynamodbService: DynamodbService) {
    }
}