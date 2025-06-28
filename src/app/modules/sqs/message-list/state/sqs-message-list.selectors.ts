import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from "@ngrx/store";
import {sqsMessageListFeatureKey, SQSMessageListState} from "./sqs-message-list.reducer";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {ListMessageAttributeCountersResponse, ListMessageCountersResponse} from "../../model/sqs-message-item";

export type SelectorType<T> = MemoizedSelector<object, T, DefaultProjectorFn<T>>;
export type SelectorFeatureType<T> = MemoizedSelector<object, T>;

const selectMessageListFeature: SelectorFeatureType<SQSMessageListState> =
    createFeatureSelector<SQSMessageListState>(sqsMessageListFeatureKey);

export const selectIsLoading: SelectorType<boolean> = createSelector(
    selectMessageListFeature,
    (state: SQSMessageListState) => state.loading
);

export const selectPrefix: SelectorType<string> = createSelector(
    selectMessageListFeature,
    (state: SQSMessageListState) => state?.messagePrefix
);

export const selectPageSize: SelectorType<number> = createSelector(
    selectMessageListFeature,
    (state: SQSMessageListState) => state?.messagePageSize
);

export const selectPageIndex: SelectorType<number> = createSelector(
    selectMessageListFeature,
    (state: SQSMessageListState) => state?.messagePageIndex
);

export const selectSortColumns: SelectorType<SortColumn[]> = createSelector(
    selectMessageListFeature,
    (state: SQSMessageListState) => state?.messageSortColumns
);

export const selectMessageCounters: SelectorType<ListMessageCountersResponse> = createSelector(
    selectMessageListFeature,
    (state: SQSMessageListState) => state?.messageCountersResponse
);

export const selectMessageAttributeCounters: SelectorType<ListMessageAttributeCountersResponse> = createSelector(
    selectMessageListFeature,
    (state: SQSMessageListState) => state?.messageAttributeCountersResponse
);

export const selectMessageAttributePrefix: SelectorType<string> = createSelector(
    selectMessageListFeature,
    (state: SQSMessageListState) => state?.messageAttributePrefix
);
