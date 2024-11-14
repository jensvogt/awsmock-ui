import {createReducer, on} from "@ngrx/store";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {UserCountersResponse} from "../../model/user-item";
import {cognitoUserActions} from "./cognito-user-list.actions";

export const cognitoUserListFeatureKey = 'cognito-user-list';

export interface CognitoUserListState {
    listUsersResponse: UserCountersResponse;
    prefix: string;
    pageSize: number;
    pageIndex: number;
    loading: boolean;
    sortColumns: SortColumn[];
    error: unknown;
}

export const initialState: CognitoUserListState = {
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
    on(cognitoUserActions.initialize, (state: CognitoUserListState): CognitoUserListState => ({...state, pageIndex: 0, pageSize: 10, loading: true})),

    // User list
    on(cognitoUserActions.loadUsers, (state: CognitoUserListState) => ({...state, loading: true})),
    on(cognitoUserActions.loadUsersSuccess, (state: CognitoUserListState, {users}) => ({...state, listUsersResponse: users, loading: false})),
    on(cognitoUserActions.loadUsersFailure, (state: CognitoUserListState, {error}) => ({...state, error: error, loading: false})),

    // Add user
    on(cognitoUserActions.addUser, (state: CognitoUserListState) => ({...state, loading: true})),
    on(cognitoUserActions.addUserSuccess, (state: CognitoUserListState) => ({...state, loading: false})),
    on(cognitoUserActions.addUserFailure, (state: CognitoUserListState, {error}) => ({...state, error: error, loading: false})),

    // Confirm user
    on(cognitoUserActions.confirmUser, (state: CognitoUserListState) => ({...state, loading: true})),
    on(cognitoUserActions.confirmUserSuccess, (state: CognitoUserListState) => ({...state, loading: false})),
    on(cognitoUserActions.confirmUserFailure, (state: CognitoUserListState, {error}) => ({...state, error: error, loading: false})),

    // Delete user
    on(cognitoUserActions.deleteUser, (state: CognitoUserListState) => ({...state, loading: true})),
    on(cognitoUserActions.deleteUserSuccess, (state: CognitoUserListState) => ({...state, loading: false})),
    on(cognitoUserActions.deleteUserFailure, (state: CognitoUserListState, {error}) => ({...state, error: error, loading: false})),
);