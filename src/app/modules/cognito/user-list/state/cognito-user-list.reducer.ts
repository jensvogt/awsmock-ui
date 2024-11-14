import {createReducer, on} from "@ngrx/store";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {UserCountersResponse} from "../../model/user-item";
import {cognitoUserActions} from "./cognito-user-list.actions";

export const cognitoUserListFeatureKey = 'cognito-user-list';

export interface CognitoUseState {
    listUsersResponse: UserCountersResponse;
    prefix: string;
    pageSize: number;
    pageIndex: number;
    loading: boolean;
    sortColumns: SortColumn[];
    error: unknown;
}

export const initialState: CognitoUseState = {
    listUsersResponse: {total: 0, users: []},
    prefix: '',
    pageSize: 10,
    pageIndex: 0,
    loading: false,
    sortColumns: [{column: 'userPoolName', sortDirection: -1}],
    error: {}
};

export const cognitoUserListReducer = createReducer(
    initialState,

    // Initialize
    on(cognitoUserActions.initialize, (state: CognitoUseState): CognitoUseState => ({...state, pageIndex: 0, pageSize: 10, loading: true})),

    // User list
    on(cognitoUserActions.loadUsers, (state: CognitoUseState) => ({...state, loading: true})),
    on(cognitoUserActions.loadUsersSuccess, (state: CognitoUseState, {users}) => ({...state, listQueueResponse: users, loading: false})),
    on(cognitoUserActions.loadUsersFailure, (state: CognitoUseState, {error}) => ({...state, error: error, loading: false})),

    // Add user
    on(cognitoUserActions.addUser, (state: CognitoUseState) => ({...state, loading: true})),
    on(cognitoUserActions.addUserSuccess, (state: CognitoUseState) => ({...state, loading: false})),
    on(cognitoUserActions.addUserFailure, (state: CognitoUseState, {error}) => ({...state, error: error, loading: false})),

    // Delete user
    on(cognitoUserActions.deleteUser, (state: CognitoUseState) => ({...state, loading: true})),
    on(cognitoUserActions.deleteUserSuccess, (state: CognitoUseState) => ({...state, loading: false})),
    on(cognitoUserActions.deleteUserFailure, (state: CognitoUseState, {error}) => ({...state, error: error, loading: false})),
);