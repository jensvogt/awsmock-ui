import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {mergeMap, of} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import {cognitoUserListActions} from './cognito-user-list.actions';
import {CognitoService} from "../../service/cognito.service";

@Injectable()
export class CognitoUserListEffects {

    loadUsers$ = createEffect(() => this.actions$.pipe(
        ofType(cognitoUserListActions.loadUsers),
        mergeMap(action =>
            this.cognitoService.listUserPoolCounters(
                action.prefix,
                action.pageSize,
                action.pageIndex,
                action.sortColumns)
                .pipe(map((queues: any) => cognitoUserListActions.loadUsersSuccess({queues})),
                    catchError((error) =>
                        of(cognitoUserListActions.loadUsersFailure({error: error.message}))
                    )
                )
        ),
    ));

    addUser$ = createEffect(() => this.actions$.pipe(
        ofType(cognitoUserListActions.deleteUser),
        mergeMap(action =>
            this.cognitoService.deleteUserPool(action.userPoolName)
                .pipe(map((queues: any) => cognitoUserListActions.addUserSuccess()),
                    catchError((error) =>
                        of(cognitoUserListActions.addUserFailure({error: error.message}))
                    )
                )
        )));


    deleteUser$ = createEffect(() => this.actions$.pipe(
        ofType(cognitoUserListActions.deleteUser),
        mergeMap(action =>
            this.cognitoService.deleteUserPool(action.userPoolName)
                .pipe(map((queues: any) => cognitoUserListActions.deleteUserSuccess()),
                    catchError((error) =>
                        of(cognitoUserListActions.deleteUserFailure({error: error.message}))
                    )
                )
        )));

    constructor(private actions$: Actions, private cognitoService: CognitoService) {
    }
}