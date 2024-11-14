import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {createAction, props} from "@ngrx/store";
import {UserCountersResponse} from "../../model/user-item";

export const cognitoUserActions = {
    initialize: createAction('[cognito-user-list] initialize'),

    // Load users
    loadUsers: createAction('[cognito-user-list] Load users', props<{ prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    loadUsersSuccess: createAction('[cognito-user-list] Load users success', props<{ users: UserCountersResponse }>()),
    loadUsersFailure: createAction('[cognito-user-list] Load users error', props<{ error: string }>()),

    // Add user
    addUser: createAction('[cognito-user-list] Add user', props<{ userPoolName: string, userName: string }>()),
    addUserSuccess: createAction('[cognito-user-list] Add user success'),
    addUserFailure: createAction('[cognito-user-list] Add user error', props<{ error: string }>()),

    // Confirm user
    confirmUser: createAction('[cognito-user-list] Confirm user', props<{ userPooId: string, userName: string }>()),
    confirmUserSuccess: createAction('[cognito-user-list] Confirm user success'),
    confirmUserFailure: createAction('[cognito-user-list] Confirm user error', props<{ error: string }>()),

    // Delete user pool
    deleteUser: createAction('[cognito-user-list] Delete user', props<{ userPoolName: string }>()),
    deleteUserSuccess: createAction('[cognito-user-list] Delete user success'),
    deleteUserFailure: createAction('[cognito-user-list] Delete user error', props<{ error: string }>()),
}