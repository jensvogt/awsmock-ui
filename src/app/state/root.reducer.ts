import {ActionReducer, ActionReducerMap, createReducer, on} from '@ngrx/store';
import {routerReducer, RouterState} from '@ngrx/router-store';
import {environment} from "../../environments/environment";
import {lambdaFunctionListActions} from "../modules/lambda/function-list/state/lambda-function-list.actions";
import {LambdaFunctionListState} from "../modules/lambda/function-list/state/lambda-function-list.reducer";
import {rootActions} from "./root.actions";

export const rootFeatureName: string = 'root';

export interface GlobalState {
    root: RootState;
    router: RouterState;
}

export interface RootState {
    backendServer: string;
}

export const initialState: RootState = {
    backendServer: environment.gatewayEndpoint
};

export const rootReducer: ActionReducer<RootState> = createReducer(
    initialState,

    on(rootActions.setBackendServer, (state: RootState) => ({...state, loading: true})),
    on(rootActions.setBackendServerSuccess, (state: RootState, {server}) => ({...state, backendServer: server, loading: false})),
    on(rootActions.setBackendServerFailure, (state: RootState, {error}) => ({...state, error: error, loading: false})),
);

export const reducers: ActionReducerMap<GlobalState> = {
    root: rootReducer,
    router: routerReducer
};
