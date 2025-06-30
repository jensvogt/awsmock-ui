import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from "@ngrx/store";
import {ssmParameterDetailsFeatureKey, SsmParameterDetailsState} from "./ssm-parameter-detail.reducer";
import {SsmParameterDetailsResponse} from "../../model/ssm-parameter-item";

export type SelectorType<T> = MemoizedSelector<object, T, DefaultProjectorFn<T>>;
export type SelectorFeatureType<T> = MemoizedSelector<object, T>;

const selectParameterDetailsFeature: SelectorFeatureType<SsmParameterDetailsState> =
    createFeatureSelector<SsmParameterDetailsState>(ssmParameterDetailsFeatureKey);

export const selectDetails: SelectorType<SsmParameterDetailsResponse> = createSelector(
    selectParameterDetailsFeature,
    (state: SsmParameterDetailsState) => state?.ssmParameterDetails
);

export const selectError: SelectorType<any> = createSelector(
    selectParameterDetailsFeature,
    (state: SsmParameterDetailsState) => state?.error
);
