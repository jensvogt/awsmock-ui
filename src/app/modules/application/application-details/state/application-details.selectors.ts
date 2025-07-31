import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from "@ngrx/store";
import {applicationDetailFeatureKey, ApplicationDetailsState} from "./application-details.reducer";
import {ApplicationItem} from "../../model/application-item";

export type SelectorType<T> = MemoizedSelector<object, T, DefaultProjectorFn<T>>;
export type SelectorFeatureType<T> = MemoizedSelector<object, T>;

const selectApplicationDetailsFeature: SelectorFeatureType<ApplicationDetailsState> =
    createFeatureSelector<ApplicationDetailsState>(applicationDetailFeatureKey);

export const selectApplicationItem: SelectorType<ApplicationItem> = createSelector(
    selectApplicationDetailsFeature,
    (state: ApplicationDetailsState) => state?.getApplicationResponse.application
);
