import {createReducer, on} from "@ngrx/store";
import {ssmParameterDetailsActions} from "./ssm-parameter-detail.actions";
import {SsmParameterDetailsResponse} from "../../model/ssm-parameter-item";

export const ssmParameterDetailsFeatureKey = 'ssm-parameter-details';

export interface SsmParameterDetailsState {
    ssmParameterDetails: SsmParameterDetailsResponse;

    // Tags
    // ssmParameterTags: SsmTagCountersResponse;
    // tagPageSize: number,
    // tagPageIndex: number,
    // tagSortColumns: SortColumn[],

    loading: boolean;
    error: unknown;
}

export const initialState: SsmParameterDetailsState = {
    ssmParameterDetails: {} as SsmParameterDetailsResponse,

    // Tags
    // ssmParameterTags: {} as SsmTagCountersResponse,
    // tagPageSize: 10,
    // tagPageIndex: 0,
    // tagSortColumns: [{column: 'endpoint', sortDirection: -1}],

    loading: false,
    error: {}
};

export const ssmParameterDetailReducer = createReducer(
    initialState,

    // Initialize
    on(ssmParameterDetailsActions.initialize, (state: SsmParameterDetailsState): SsmParameterDetailsState => ({...state, loading: false})),

    // Parameter details
    on(ssmParameterDetailsActions.loadDetails, (state: SsmParameterDetailsState) => ({...state, loading: true})),
    on(ssmParameterDetailsActions.loadDetailsSuccess, (state: SsmParameterDetailsState, {parameterDetails}) => ({...state, ssmParameterDetails: parameterDetails, loading: false})),
    on(ssmParameterDetailsActions.loadDetailsFailure, (state: SsmParameterDetailsState, {error}) => ({...state, error: error, loading: false})),
    //
    // // Parameter attributes
    // on(ssmParameterDetailsActions.loadAttributes, (state: SsmParameterDetailsState) => ({...state, loading: true})),
    // on(ssmParameterDetailsActions.loadAttributesSuccess, (state: SsmParameterDetailsState, {attributes}) => ({...state, ssmParameterAttributes: attributes, loading: false})),
    // on(ssmParameterDetailsActions.loadAttributesFailure, (state: SsmParameterDetailsState, {error}) => ({...state, error: error, loading: false})),
    //
    // // Parameter attributes
    // on(ssmParameterDetailsActions.loadLambdaTriggers, (state: SsmParameterDetailsState) => ({...state, loading: true})),
    // on(ssmParameterDetailsActions.loadLambdaTriggersSuccess, (state: SsmParameterDetailsState, {lambdaTriggers}) => ({...state, ssmLambdaTriggers: lambdaTriggers, loading: false})),
    // on(ssmParameterDetailsActions.loadLambdaTriggersFailure, (state: SsmParameterDetailsState, {error}) => ({...state, error: error, loading: false})),
    //
    // // Parameter tags
    // on(ssmParameterDetailsActions.loadTags, (state: SsmParameterDetailsState) => ({...state, loading: true})),
    // on(ssmParameterDetailsActions.loadTagsSuccess, (state: SsmParameterDetailsState, {tags}) => ({...state, ssmParameterTags: tags, loading: false})),
    // on(ssmParameterDetailsActions.loadTagsFailure, (state: SsmParameterDetailsState, {error}) => ({...state, error: error, loading: false})),
    //
    // // List parameter default message attributes
    // on(ssmParameterDetailsActions.loadDefaultMessageAttributes, (state: SsmParameterDetailsState) => ({...state, loading: true})),
    // on(ssmParameterDetailsActions.loadDefaultMessageAttributesSuccess, (state: SsmParameterDetailsState, {defaultMessageAttributes}) => ({...state, ssmParameterDefaultMessageAttributes: defaultMessageAttributes, loading: false})),
    // on(ssmParameterDetailsActions.loadDefaultMessageAttributesFailure, (state: SsmParameterDetailsState, {error}) => ({...state, error: error, loading: false})),
    //
    // // Add parameter default message attributes
    // on(ssmParameterDetailsActions.addDefaultMessageAttributes, (state: SsmParameterDetailsState) => ({...state, loading: true})),
    // on(ssmParameterDetailsActions.addDefaultMessageAttributesSuccess, (state: SsmParameterDetailsState, {defaultMessageAttributes}) => ({...state, ssmParameterDefaultMessageAttributes: defaultMessageAttributes, loading: false})),
    // on(ssmParameterDetailsActions.addDefaultMessageAttributesFailure, (state: SsmParameterDetailsState, {error}) => ({...state, error: error, loading: false})),
    //
    // // Update parameter default message attributes
    // on(ssmParameterDetailsActions.updateDefaultMessageAttributes, (state: SsmParameterDetailsState) => ({...state, loading: true})),
    // on(ssmParameterDetailsActions.updateDefaultMessageAttributesSuccess, (state: SsmParameterDetailsState, {defaultMessageAttributes}) => ({...state, ssmParameterDefaultMessageAttributes: defaultMessageAttributes, loading: false})),
    // on(ssmParameterDetailsActions.updateDefaultMessageAttributesFailure, (state: SsmParameterDetailsState, {error}) => ({...state, error: error, loading: false})),
    //
    // // Delete parameter default message attributes
    // on(ssmParameterDetailsActions.deleteDefaultMessageAttributes, (state: SsmParameterDetailsState) => ({...state, loading: true})),
    // on(ssmParameterDetailsActions.deleteDefaultMessageAttributesSuccess, (state: SsmParameterDetailsState, {defaultMessageAttributes}) => ({...state, ssmParameterDefaultMessageAttributes: defaultMessageAttributes, loading: false})),
    // on(ssmParameterDetailsActions.deleteDefaultMessageAttributesFailure, (state: SsmParameterDetailsState, {error}) => ({...state, error: error, loading: false})),
);