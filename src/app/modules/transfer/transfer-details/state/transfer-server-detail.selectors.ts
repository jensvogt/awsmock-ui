import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from "@ngrx/store";
import {transferServerDetailsFeatureKey, TransferServerDetailsState} from "./transfer-server-detail.reducer";
import {TransferServerDetailsResponse} from "../../model/transfer-server-details";
import {TransferServerUsersResponse} from "../../model/transfer-server-users";
import {TransferServerProtocolsResponse} from "../../model/transfer-server-protocols";
import {TransferServerTagsResponse} from "../../model/transfer-server-tags";

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

export const selectProtocols: SelectorType<TransferServerProtocolsResponse> = createSelector(
    selectTransferServerDetailsFeature,
    (state: TransferServerDetailsState) => state?.protocols
);

export const selectProtocolPageSize: SelectorType<number> = createSelector(
    selectTransferServerDetailsFeature,
    (state: TransferServerDetailsState) => state?.protocolPageSize
);

export const selectProtocolPageIndex: SelectorType<number> = createSelector(
    selectTransferServerDetailsFeature,
    (state: TransferServerDetailsState) => state?.protocolPageIndex
);

export const selectTags: SelectorType<TransferServerTagsResponse> = createSelector(
    selectTransferServerDetailsFeature,
    (state: TransferServerDetailsState) => state?.tags
);

export const selectTagPageSize: SelectorType<number> = createSelector(
    selectTransferServerDetailsFeature,
    (state: TransferServerDetailsState) => state?.tagPageSize
);

export const selectTagPageIndex: SelectorType<number> = createSelector(
    selectTransferServerDetailsFeature,
    (state: TransferServerDetailsState) => state?.tagPageIndex
);

export const selectError: SelectorType<any> = createSelector(
    selectTransferServerDetailsFeature,
    (state: TransferServerDetailsState) => state?.error
);
