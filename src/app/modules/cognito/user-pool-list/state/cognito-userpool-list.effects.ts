import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {mergeMap, of} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import {cognitoUserpoolListActions} from './cognito-userpool-list.actions';
import {CognitoService} from "../../service/cognito.service";

@Injectable()
export class CognitoUserPoolListEffects {

    loadUSerPools$ = createEffect(() => this.actions$.pipe(
        ofType(cognitoUserpoolListActions.loadUserPools),
        mergeMap(action =>
            this.cognitoService.listUserPoolCounters(
                action.prefix,
                action.pageSize,
                action.pageIndex,
                action.sortColumns)
                .pipe(map((userPools: any) => cognitoUserpoolListActions.loadUserPoolsSuccess({userPools})),
                    catchError((error) =>
                        of(cognitoUserpoolListActions.loadUserPoolsFailure({error: error.message}))
                    )
                )
        ),
    ));

    addUserPool$ = createEffect(() => this.actions$.pipe(
        ofType(cognitoUserpoolListActions.deleteUserPool),
        mergeMap(action =>
            this.cognitoService.deleteUserPool(action.userPoolName)
                .pipe(map(() => cognitoUserpoolListActions.addUserPoolSuccess()),
                    catchError((error) =>
                        of(cognitoUserpoolListActions.addUserPoolFailure({error: error.message}))
                    )
                )
        )));


    deleteUserPool$ = createEffect(() => this.actions$.pipe(
        ofType(cognitoUserpoolListActions.deleteUserPool),
        mergeMap(action =>
            this.cognitoService.deleteUserPool(action.userPoolName)
                .pipe(map(() => cognitoUserpoolListActions.deleteUserPoolSuccess()),
                    catchError((error) =>
                        of(cognitoUserpoolListActions.deleteUserPoolFailure({error: error.message}))
                    )
                )
        )));

    constructor(private actions$: Actions, private cognitoService: CognitoService) {
    }
}