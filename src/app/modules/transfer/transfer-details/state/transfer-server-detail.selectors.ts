import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from "@ngrx/store";
import {transferServerDetailsFeatureKey, TransferServerDetailsState} from "./transfer-server-detail.reducer";
import {TransferServerDetailsResponse} from "../../model/transfer-server-details";
import {TransferServerUsersResponse} from "../../model/transfer-server-users";

export type SelectorType<T> = MemoizedSelector<object, T, DefaultProjectorFn<T>>;
export type SelectorFeatureType<T> = MemoizedSelector<object, T>;

const selectTransferServerDetailsFeature: SelectorFeatureType<TransferServerDetailsState> =
    createFeatureSelector<TransferServerDetailsState>(transferServerDetailsFeatureKey);

export const selectIsLoading: SelectorType<boolean> = createSelector(
    selectTransferServerDetailsFeature,
    (state: TransferServerDetailsState) => state.loading
);

export const selectDetails: SelectorType<TransferServerDetailsResponse> = createSelector(
    selectTransferServerDetailsFeature,
    (state: TransferServerDetailsState) => state?.transferServerDetails
);

export const selectUsers: SelectorType<TransferServerUsersResponse> = createSelector(
    selectTransferServerDetailsFeature,
    (state: TransferServerDetailsState) => state?.users
);

export const selectUserPageSize: SelectorType<number> = createSelector(
    selectTransferServerDetailsFeature,
    (state: TransferServerDetailsState) => state?.userPageSize
);

export const selectUserPageIndex: SelectorType<number> = createSelector(
    selectTransferServerDetailsFeature,
    (state: TransferServerDetailsState) => state?.userPageIndex
);

export const selectError: SelectorType<any> = createSelector(
    selectTransferServerDetailsFeature,
    (state: TransferServerDetailsState) => state?.error
);
