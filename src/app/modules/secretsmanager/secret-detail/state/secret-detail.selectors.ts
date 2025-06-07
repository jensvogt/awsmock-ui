import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from "@ngrx/store";
import {secretDetailsFeatureKey, SecretDetailsState} from "./secret-detail.reducer";
import {LoadLambdaArnsResponse, SecretDetails} from "../../model/secret-detail-item";
import {SecretTagCountersResponse} from "../../model/secret-tag-item";
import {SecretVersionCountersResponse} from "../../model/secret-version-item";

export type SelectorType<T> = MemoizedSelector<object, T, DefaultProjectorFn<T>>;
export type SelectorFeatureType<T> = MemoizedSelector<object, T>;

const selectSecretDetailsFeature: SelectorFeatureType<SecretDetailsState> =
    createFeatureSelector<SecretDetailsState>(secretDetailsFeatureKey);

export const selectDetails: SelectorType<SecretDetails> = createSelector(
    selectSecretDetailsFeature,
    (state: SecretDetailsState) => state?.secretDetails
);

export const selectVersions: SelectorType<SecretVersionCountersResponse> = createSelector(
    selectSecretDetailsFeature,
    (state: SecretDetailsState) => state?.secretVersions
);

export const selectRotationLambdaARNs: SelectorType<LoadLambdaArnsResponse> = createSelector(
    selectSecretDetailsFeature,
    (state: SecretDetailsState) => state?.rotationLambdaARNs
);

export const selectVersionPageSize: SelectorType<number> = createSelector(
    selectSecretDetailsFeature,
    (state: SecretDetailsState) => state?.versionPageSize
);

export const selectVersionPageIndex: SelectorType<number> = createSelector(
    selectSecretDetailsFeature,
    (state: SecretDetailsState) => state?.versionPageIndex
);

export const selectTags: SelectorType<SecretTagCountersResponse> = createSelector(
    selectSecretDetailsFeature,
    (state: SecretDetailsState) => state?.secretTags
);

export const selectTagPageSize: SelectorType<number> = createSelector(
    selectSecretDetailsFeature,
    (state: SecretDetailsState) => state?.tagPageSize
);

export const selectTagPageIndex: SelectorType<number> = createSelector(
    selectSecretDetailsFeature,
    (state: SecretDetailsState) => state?.tagPageIndex
);

export const selectError: SelectorType<any> = createSelector(
    selectSecretDetailsFeature,
    (state: SecretDetailsState) => state?.error
);
