import {createReducer, on} from "@ngrx/store";
import {applicationDetailsActions} from './application-details.actions';
import {GetApplicationResponse} from "../../model/application-item";

export const applicationDetailFeatureKey = 'application-details';

export interface ApplicationDetailsState {
    getApplicationResponse: GetApplicationResponse;
    error: unknown;
}

export const initialState: ApplicationDetailsState = {
    getApplicationResponse: {} as GetApplicationResponse,
    error: {},
};

export const applicationDetailReducer = createReducer(
    initialState,

    // ApplicationDetailsState
    on(applicationDetailsActions.initialize, (state: ApplicationDetailsState): ApplicationDetailsState => ({...state})),

    // Get application
    on(applicationDetailsActions.loadApplication, (state: ApplicationDetailsState) => ({...state})),
    on(applicationDetailsActions.loadApplicationSuccess, (state: ApplicationDetailsState, {getApplicationResponse}) => ({
        ...state,
        getApplicationResponse: getApplicationResponse,
        loading: false
    })),
    on(applicationDetailsActions.loadApplicationFailure, (state: ApplicationDetailsState, {error}) => ({...state, error: error})),

    // Update application
    on(applicationDetailsActions.updateApplication, (state: ApplicationDetailsState) => ({...state})),
    on(applicationDetailsActions.updateApplicationSuccess, (state: ApplicationDetailsState, {getApplicationResponse}) => ({
        ...state, getApplicationResponse: getApplicationResponse
    })),
    on(applicationDetailsActions.loadApplicationFailure, (state: ApplicationDetailsState, {error}) => ({...state, error: error})),
);