import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from "@ngrx/store";
import {cognitoUserPoolListFeatureKey, CognitoUserPoolListState} from "./cognito-userpool-list.reducer";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {UserPoolCountersResponse} from "../../model/user-pool-item";

export type SelectorType<T> = MemoizedSelector<object, T, DefaultProjectorFn<T>>;
export type SelectorFeatureType<T> = MemoizedSelector<object, T>;

const selectUserPoolListFeature: SelectorFeatureType<CognitoUserPoolListState> =
    createFeatureSelector<CognitoUserPoolListState>(cognitoUserPoolListFeatureKey);

export const selectIsLoading: SelectorType<boolean> = createSelector(
    selectUserPoolListFeature,
    (state: CognitoUserPoolListState) => state.loading
);

export const selectPrefix: SelectorType<string> = createSelector(
    selectUserPoolListFeature,
    (state: CognitoUserPoolListState) => state?.prefix
);

export const selectPageSize: SelectorType<number> = createSelector(
    selectUserPoolListFeature,
    (state: CognitoUserPoolListState) => state?.pageSize
);

export const selectPageIndex: SelectorType<number> = createSelector(
    selectUserPoolListFeature,
    (state: CognitoUserPoolListState) => state?.pageIndex
);

export const selectSortColumns: SelectorType<SortColumn[]> = createSelector(
    selectUserPoolListFeature,
    (state: CognitoUserPoolListState) => state?.sortColumns
);

export const selectQueueCounters: SelectorType<UserPoolCountersResponse> = createSelector(
    selectUserPoolListFeature,
    (state: CognitoUserPoolListState) => state?.listQueueResponse
);
