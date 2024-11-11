import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from "@ngrx/store";
import {cognitoUserListFeatureKey, CognitoUserListState} from "./cognito-user-list.reducer";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {UserCountersResponse} from "../../model/user-item";

export type SelectorType<T> = MemoizedSelector<object, T, DefaultProjectorFn<T>>;
export type SelectorFeatureType<T> = MemoizedSelector<object, T>;

const selectUserListFeature: SelectorFeatureType<CognitoUserListState> =
    createFeatureSelector<CognitoUserListState>(cognitoUserListFeatureKey);

export const selectIsLoading: SelectorType<boolean> = createSelector(
    selectUserListFeature,
    (state: CognitoUserListState) => state.loading
);

export const selectPrefix: SelectorType<string> = createSelector(
    selectUserListFeature,
    (state: CognitoUserListState) => state?.prefix
);

export const selectPageSize: SelectorType<number> = createSelector(
    selectUserListFeature,
    (state: CognitoUserListState) => state?.pageSize
);

export const selectPageIndex: SelectorType<number> = createSelector(
    selectUserListFeature,
    (state: CognitoUserListState) => state?.pageIndex
);

export const selectSortColumns: SelectorType<SortColumn[]> = createSelector(
    selectUserListFeature,
    (state: CognitoUserListState) => state?.sortColumns
);

export const selectUsersCounters: SelectorType<UserCountersResponse> = createSelector(
    selectUserListFeature,
    (state: CognitoUserListState) => state?.listUsersResponse
);
