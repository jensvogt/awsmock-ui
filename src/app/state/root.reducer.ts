import {ActionReducer, ActionReducerMap, createReducer, on} from '@ngrx/store';
import {routerReducer, RouterState} from '@ngrx/router-store';

export const rootFeatureName: string = 'root';

export interface GlobalState {
    root: RootState;
    router: RouterState;
}

export interface RootState {
}

export const initialState: RootState = {
};

export const rootReducer: ActionReducer<RootState> = createReducer(
    initialState,
);

export const reducers: ActionReducerMap<GlobalState> = {
    root: rootReducer,
    router: routerReducer
};
