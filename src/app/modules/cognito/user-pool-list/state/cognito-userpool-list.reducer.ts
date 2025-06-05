import {UserPoolCountersResponse} from "../../model/user-pool-item";
import {createReducer, on} from "@ngrx/store";
import {cognitoUserpoolListActions} from './cognito-userpool-list.actions';
import {SortColumn} from "../../../../shared/sorting/sorting.component";

export const cognitoUserPoolListFeatureKey = 'cognito-userpool-list';

export interface CognitoUserPoolListState {
    listUserPoolResponse: UserPoolCountersResponse;
    prefix: string;
    pageSize: number;
    pageIndex: number;
    loading: boolean;
    sortColumns: SortColumn[];
    error: unknown;
}

export const initialState: CognitoUserPoolListState = {
    listUserPoolResponse: {total: 0, userPoolCounters: []},
    prefix: '',
    pageSize: 10,
    pageIndex: 0,
    loading: false,
    sortColumns: [{column: 'userPoolName', sortDirection: -1}],
    error: {}
};

export const cognitoUserPoolListReducer = createReducer(
    initialState,

    // Initialize
    on(cognitoUserpoolListActions.initialize, (state: CognitoUserPoolListState): CognitoUserPoolListState => ({...state, pageIndex: 0, pageSize: 10, loading: true})),

    // Queue list
    on(cognitoUserpoolListActions.loadUserPools, (state: CognitoUserPoolListState) => ({...state, loading: true})),
    on(cognitoUserpoolListActions.loadUserPoolsSuccess, (state: CognitoUserPoolListState, {userPools}) => ({
        ...state,
        listUserPoolResponse: userPools,
        loading: false
    })),
    on(cognitoUserpoolListActions.loadUserPoolsFailure, (state: CognitoUserPoolListState, {error}) => ({...state, error: error, loading: false})),

    // Add queue
    on(cognitoUserpoolListActions.addUserPool, (state: CognitoUserPoolListState) => ({...state, loading: true})),
    on(cognitoUserpoolListActions.addUserPoolSuccess, (state: CognitoUserPoolListState) => ({...state, loading: false})),
    on(cognitoUserpoolListActions.addUserPoolFailure, (state: CognitoUserPoolListState, {error}) => ({...state, error: error, loading: false})),

    // Delete queue
    on(cognitoUserpoolListActions.deleteUserPool, (state: CognitoUserPoolListState) => ({...state, loading: true})),
    on(cognitoUserpoolListActions.deleteUserPoolSuccess, (state: CognitoUserPoolListState) => ({...state, loading: false})),
    on(cognitoUserpoolListActions.deleteUserPoolFailure, (state: CognitoUserPoolListState, {error}) => ({...state, error: error, loading: false})),
);