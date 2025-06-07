import {createReducer, on} from "@ngrx/store";
import {secretDetailsActions} from './secret-detail.actions';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {LoadLambdaArnsResponse, SecretDetails} from "../../model/secret-detail-item";
import {SqsTagCountersResponse} from "../../../sqs/model/sqs-tag-item";
import {SecretVersionCountersResponse} from "../../model/secret-version-item";

export const secretDetailsFeatureKey = 'secret-details';

export interface SecretDetailsState {

    secretDetails: SecretDetails;

    // Versions
    secretVersions: SecretVersionCountersResponse;
    versionPageSize: number,
    versionPageIndex: number,
    versionSortColumns: SortColumn[],

    // Tags
    secretTags: SqsTagCountersResponse;
    tagPageSize: number,
    tagPageIndex: number,
    tagSortColumns: SortColumn[],

    // Rotation lambda
    rotationLambdaARNs: LoadLambdaArnsResponse;

    loading: boolean;
    error: unknown;
}

export const initialState: SecretDetailsState = {
    secretDetails: {} as SecretDetails,

    // Versions
    secretVersions: {} as SecretVersionCountersResponse,
    versionPageSize: 10,
    versionPageIndex: 0,
    versionSortColumns: [{column: 'name', sortDirection: -1}],

    // Tags
    secretTags: {} as SqsTagCountersResponse,
    tagPageSize: 10,
    tagPageIndex: 0,
    tagSortColumns: [{column: 'endpoint', sortDirection: -1}],

    // Rotation lambdas
    rotationLambdaARNs: {} as LoadLambdaArnsResponse,

    loading: false,
    error: {}
};

export const secretDetailReducer = createReducer(
    initialState,

    // Initialize
    on(secretDetailsActions.initialize, (state: SecretDetailsState): SecretDetailsState => ({...state, loading: false})),

    // Secret details
    on(secretDetailsActions.loadDetails, (state: SecretDetailsState) => ({...state, loading: true})),
    on(secretDetailsActions.loadDetailsSuccess, (state: SecretDetailsState, {secretDetails}) => ({...state, secretDetails: secretDetails, loading: false})),
    on(secretDetailsActions.loadDetailsFailure, (state: SecretDetailsState, {error}) => ({...state, error: error, loading: false})),

    // Secret versions
    on(secretDetailsActions.loadVersions, (state: SecretDetailsState) => ({...state, loading: true})),
    on(secretDetailsActions.loadVersionsSuccess, (state: SecretDetailsState, {secretVersions}) => ({...state, secretVersions: secretVersions, loading: false})),
    on(secretDetailsActions.loadVersionsFailure, (state: SecretDetailsState, {error}) => ({...state, error: error, loading: false})),

    // Load lambda ARNs
    on(secretDetailsActions.loadLambdasARNs, (state: SecretDetailsState) => ({...state, loading: true})),
    on(secretDetailsActions.loadLambdasARNsSuccess, (state: SecretDetailsState, {loadLambdaArnsResponse}) => ({...state, rotationLambdaARNs: loadLambdaArnsResponse, loading: false})),
    on(secretDetailsActions.loadLambdasARNsFailure, (state: SecretDetailsState, {error}) => ({...state, error: error, loading: false})),

    // Secret tags
    // on(secretDetailsActions.loadTags, (state: SecretDetailsState) => ({...state, loading: true})),
    // on(secretDetailsActions.loadTagsSuccess, (state: SecretDetailsState, {tags}) => ({...state, secretTags: tags, loading: false})),
    // on(secretDetailsActions.loadTagsFailure, (state: SecretDetailsState, {error}) => ({...state, error: error, loading: false})),
);