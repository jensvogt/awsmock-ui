import {createReducer, on} from "@ngrx/store";
import {kmsKeyDetailsActions} from './kms-key-detail.actions';
import {KeyDetailsResponse} from "../../model/key-details";

export const kmsKeyDetailsFeatureKey = 'kms-key-details';

export interface KmsKeyDetailsState {
    kmsKeyDetails: KeyDetailsResponse;
    // Tags
    // kmsKeyTags: KmsTagCountersResponse;
    // tagPageSize: number,
    // tagPageIndex: number,
    // tagSortColumns: SortColumn[],
    // Attributes
    loading: boolean;
    error: unknown;
}

export const initialState: KmsKeyDetailsState = {
    kmsKeyDetails: {} as KeyDetailsResponse,
    // Tags
    // kmsKeyTags: {} as KmsTagCountersResponse,
    // tagPageSize: 10,
    // tagPageIndex: 0,
    // tagSortColumns: [{column: 'endpoint', sortDirection: -1}],
    // Attributes
    loading: false,
    error: {}
};

export const kmsKeyDetailReducer = createReducer(
    initialState,

    // Initialize
    on(kmsKeyDetailsActions.initialize, (state: KmsKeyDetailsState): KmsKeyDetailsState => ({...state, loading: false})),

    // Key details
    on(kmsKeyDetailsActions.loadDetails, (state: KmsKeyDetailsState) => ({...state, loading: true})),
    on(kmsKeyDetailsActions.loadDetailsSuccess, (state: KmsKeyDetailsState, {keyDetails}) => ({...state, kmsKeyDetails: keyDetails, loading: false})),
    on(kmsKeyDetailsActions.loadDetailsFailure, (state: KmsKeyDetailsState, {error}) => ({...state, error: error, loading: false})),
);