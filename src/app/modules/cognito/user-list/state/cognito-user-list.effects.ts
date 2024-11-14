import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {mergeMap, of} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import {cognitoUserActions} from './cognito-user-list.actions';
import {CognitoService} from "../../service/cognito.service";

@Injectable()
export class CognitoUserListEffects {

    loadUsers$ = createEffect(() => this.actions$.pipe(
        ofType(cognitoUserActions.loadUsers),
        mergeMap(action =>
            this.cognitoService.listUserCounters(
                action.prefix,
                action.pageSize,
                action.pageIndex,
                action.sortColumns)
                .pipe(map((users: any) => cognitoUserActions.loadUsersSuccess({users})),
                    catchError((error) =>
                        of(cognitoUserActions.loadUsersFailure({error: error.message}))
                    )
                )
        ),
    ));

    addUser$ = createEffect(() => this.actions$.pipe(
        ofType(cognitoUserActions.addUser),
        mergeMap(action =>
            this.cognitoService.createUser(action.userPoolName, action.userName)
                .pipe(map((queues: any) => cognitoUserActions.addUserSuccess()),
                    catchError((error) =>
                        of(cognitoUserActions.addUserFailure({error: error.message}))
                    )
                )
        )));


    confirmUser$ = createEffect(() => this.actions$.pipe(
        ofType(cognitoUserActions.confirmUser),
        mergeMap(action =>
            this.cognitoService.confirmUser(action.userPooId, action.userName)
                .pipe(map((queues: any) => cognitoUserActions.deleteUserSuccess()),
                    catchError((error) =>
                        of(cognitoUserActions.deleteUserFailure({error: error.message}))
                    )
                )
        )));

    deleteUser$ = createEffect(() => this.actions$.pipe(
        ofType(cognitoUserActions.deleteUser),
        mergeMap(action =>
            this.cognitoService.deleteUserPool(action.userPoolName)
                .pipe(map((queues: any) => cognitoUserActions.deleteUserSuccess()),
                    catchError((error) =>
                        of(cognitoUserActions.deleteUserFailure({error: error.message}))
                    )
                )
        )));

    constructor(private actions$: Actions, private cognitoService: CognitoService) {
    }
}