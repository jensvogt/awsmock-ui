import {createReducer, on} from "@ngrx/store";
import {ApiKeyDetailsResponse} from "../../model/api-key-item";
import {apiKeyDetailsActions} from "./api-key-detail.actions";

export const apiKeyDetailsFeatureKey = 'api-key-details';

export interface ApiKeyDetailsState {
    apiKeyDetails: ApiKeyDetailsResponse;
    // Tags
    // apiKeyTags: ApiTagCountersResponse;
    // tagPageSize: number,
    // tagPageIndex: number,
    // tagSortColumns: SortColumn[],
    // Attributes
    loading: boolean;
    error: unknown;
}

export const initialState: ApiKeyDetailsState = {
    apiKeyDetails: {} as ApiKeyDetailsResponse,
    // Tags
    // apiKeyTags: {} as ApiTagCountersResponse,
    // tagPageSize: 10,
    // tagPageIndex: 0,
    // tagSortColumns: [{column: 'endpoint', sortDirection: -1}],
    // Attributes
    loading: false,
    error: {}
};

export const apiApiKeyDetailReducer = createReducer(
    initialState,

    // Initialize
    on(apiKeyDetailsActions.initialize, (state: ApiKeyDetailsState): ApiKeyDetailsState => ({...state, loading: false})),

    // Key details
    on(apiKeyDetailsActions.loadDetails, (state: ApiKeyDetailsState) => ({...state, loading: true})),
    on(apiKeyDetailsActions.loadDetailsSuccess, (state: ApiKeyDetailsState, {keyDetails}) => ({...state, apiKeyDetails: keyDetails, loading: false})),
    on(apiKeyDetailsActions.loadDetailsFailure, (state: ApiKeyDetailsState, {error}) => ({...state, error: error, loading: false})),
);