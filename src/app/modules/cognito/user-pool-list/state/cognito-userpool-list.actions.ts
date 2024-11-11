import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {createAction, props} from "@ngrx/store";
import {UserPoolCountersResponse} from "../../model/user-pool-item";

export const cognitoUserpoolListActions = {
    initialize: createAction('[cognito-userpool-list] initialize'),

    // Load user pool
    loadUserPools: createAction('[cognito-userpool-list] Load userpools', props<{ prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    loadUserPoolsSuccess: createAction('[cognito-userpool-list] Load userpools success', props<{ queues: UserPoolCountersResponse }>()),
    loadUserPoolsFailure: createAction('[cognito-userpool-list] Load userpools error', props<{ error: string }>()),

    // Add user pool
    addUserPool: createAction('[cognito-userpool-list] Add userpool', props<{ userPoolName: string }>()),
    addUserPoolSuccess: createAction('[cognito-userpool-list] Add userpool success'),
    addUserPoolFailure: createAction('[cognito-userpool-list] Add userpool error', props<{ error: string }>()),

    // Delete user pool
    deleteUserPool: createAction('[cognito-userpool-list] Delete userpool', props<{ userPoolName: string }>()),
    deleteUserPoolSuccess: createAction('[cognito-userpool-list] Delete userpool success'),
    deleteUserPoolFailure: createAction('[cognito-userpool-list] Delete userpool error', props<{ error: string }>()),
}