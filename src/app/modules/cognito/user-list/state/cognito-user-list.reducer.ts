import {createReducer, on} from "@ngrx/store";
import {cognitoUserListActions} from './cognito-user-list.actions';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {UserCountersResponse} from "../../model/user-item";

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
    on(cognitoUserListActions.initialize, (state: CognitoUserListState): CognitoUserListState => ({...state, pageIndex: 0, pageSize: 10, loading: true})),

    // Queue list
    on(cognitoUserListActions.loadUsers, (state: CognitoUserListState) => ({...state, loading: true})),
    on(cognitoUserListActions.loadUsersSuccess, (state: CognitoUserListState, {queues}) => ({...state, listQueueResponse: queues, loading: false})),
    on(cognitoUserListActions.loadUsersFailure, (state: CognitoUserListState, {error}) => ({...state, error: error, loading: false})),

    // Add queue
    on(cognitoUserListActions.addUser, (state: CognitoUserListState) => ({...state, loading: true})),
    on(cognitoUserListActions.addUserSuccess, (state: CognitoUserListState) => ({...state, loading: false})),
    on(cognitoUserListActions.addUserFailure, (state: CognitoUserListState, {error}) => ({...state, error: error, loading: false})),

    // Delete queue
    on(cognitoUserListActions.deleteUser, (state: CognitoUserListState) => ({...state, loading: true})),
    on(cognitoUserListActions.deleteUserSuccess, (state: CognitoUserListState) => ({...state, loading: false})),
    on(cognitoUserListActions.deleteUserFailure, (state: CognitoUserListState, {error}) => ({...state, error: error, loading: false})),
);