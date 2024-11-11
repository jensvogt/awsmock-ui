import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {createAction, props} from "@ngrx/store";
import {UserPoolCountersResponse} from "../../model/user-pool-item";

export const cognitoUserListActions = {
    initialize: createAction('[cognito-user-list] initialize'),

    // Load user pool
    loadUsers: createAction('[cognito-user-list] Load users', props<{ prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    loadUsersSuccess: createAction('[cognito-user-list] Load users success', props<{ queues: UserPoolCountersResponse }>()),
    loadUsersFailure: createAction('[cognito-user-list] Load users error', props<{ error: string }>()),

    // Add user pool
    addUser: createAction('[cognito-user-list] Add user', props<{ userPoolName: string }>()),
    addUserSuccess: createAction('[cognito-user-list] Add user success'),
    addUserFailure: createAction('[cognito-user-list] Add user error', props<{ error: string }>()),

    // Delete user pool
    deleteUser: createAction('[cognito-user-list] Delete user', props<{ userPoolName: string }>()),
    deleteUserSuccess: createAction('[cognito-user-list] Delete user success'),
    deleteUserFailure: createAction('[cognito-user-list] Delete user error', props<{ error: string }>()),
}