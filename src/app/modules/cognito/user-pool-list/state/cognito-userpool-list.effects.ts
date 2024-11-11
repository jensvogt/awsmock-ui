import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {mergeMap, of} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import {cognitoUserpoolListActions} from './cognito-userpool-list.actions';
import {CognitoService} from "../../service/cognito.service";

@Injectable()
export class CognitoUserPoolListEffects {

    loadQueues$ = createEffect(() => this.actions$.pipe(
        ofType(cognitoUserpoolListActions.loadUserPools),
        mergeMap(action =>
            this.cognitoService.listUserPoolCounters(
                action.prefix,
                action.pageSize,
                action.pageIndex,
                action.sortColumns)
                .pipe(map((queues: any) => cognitoUserpoolListActions.loadUserPoolsSuccess({queues})),
                    catchError((error) =>
                        of(cognitoUserpoolListActions.loadUserPoolsFailure({error: error.message}))
                    )
                )
        ),
    ));

    addQueue$ = createEffect(() => this.actions$.pipe(
        ofType(cognitoUserpoolListActions.deleteUserPool),
        mergeMap(action =>
            this.cognitoService.deleteUserPool(action.userPoolName)
                .pipe(map((queues: any) => cognitoUserpoolListActions.addUserPoolSuccess()),
                    catchError((error) =>
                        of(cognitoUserpoolListActions.addUserPoolFailure({error: error.message}))
                    )
                )
        )));


    deleteQueue$ = createEffect(() => this.actions$.pipe(
        ofType(cognitoUserpoolListActions.deleteUserPool),
        mergeMap(action =>
            this.cognitoService.deleteUserPool(action.userPoolName)
                .pipe(map((queues: any) => cognitoUserpoolListActions.deleteUserPoolSuccess()),
                    catchError((error) =>
                        of(cognitoUserpoolListActions.deleteUserPoolFailure({error: error.message}))
                    )
                )
        )));

    constructor(private actions$: Actions, private cognitoService: CognitoService) {
    }
}