import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from "@ngrx/store";
import {snsMessageListFeatureKey, SNSMessageListState} from "./sns-message-list.reducer";
import {SnsMessageCountersResponse} from "../../model/sns-message-item";

export type SelectorType<T> = MemoizedSelector<object, T, DefaultProjectorFn<T>>;
export type SelectorFeatureType<T> = MemoizedSelector<object, T>;

const selectMessageListFeature: SelectorFeatureType<SNSMessageListState> =
    createFeatureSelector<SNSMessageListState>(snsMessageListFeatureKey);

export const selectIsLoading: SelectorType<boolean> = createSelector(
    selectMessageListFeature,
    (state: SNSMessageListState) => state.loading
);

export const selectPageSize: SelectorType<number> = createSelector(
    selectMessageListFeature,
    (state: SNSMessageListState) => state?.pageSize
);

export const selectPageIndex: SelectorType<number> = createSelector(
    selectMessageListFeature,
    (state: SNSMessageListState) => state?.pageIndex
);

export const selectMessageCounters: SelectorType<SnsMessageCountersResponse> = createSelector(
    selectMessageListFeature,
    (state: SNSMessageListState) => state?.snsMessageCountersResponse
);
