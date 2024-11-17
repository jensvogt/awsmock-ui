import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from "@ngrx/store";
import {sqsMessageListFeatureKey, SQSMessageListState} from "./sqs-message-list.reducer";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {ListMessageCountersResponse} from "../../model/sqs-message-item";

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
    (state: SQSMessageListState) => state?.prefix
);

export const selectPageSize: SelectorType<number> = createSelector(
    selectMessageListFeature,
    (state: SQSMessageListState) => state?.pageSize
);

export const selectPageIndex: SelectorType<number> = createSelector(
    selectMessageListFeature,
    (state: SQSMessageListState) => state?.pageIndex
);

export const selectSortColumns: SelectorType<SortColumn[]> = createSelector(
    selectMessageListFeature,
    (state: SQSMessageListState) => state?.sortColumns
);

export const selectMessageCounters: SelectorType<ListMessageCountersResponse> = createSelector(
    selectMessageListFeature,
    (state: SQSMessageListState) => state?.listMessageCountersResponse
);
