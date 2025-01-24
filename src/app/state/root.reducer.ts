import {ActionReducer, ActionReducerMap, createReducer} from '@ngrx/store';
import {routerReducer, RouterState} from '@ngrx/router-store';
import {environment} from "../../environments/environment";

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
);

export const reducers: ActionReducerMap<GlobalState> = {
    root: rootReducer,
    router: routerReducer
};
