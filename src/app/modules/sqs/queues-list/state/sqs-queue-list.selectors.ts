import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from "@ngrx/store";
import {sqsQueueListFeatureKey, SQSQueueListState} from "./sqs-queue-list.reducer";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {ListQueueCountersResponse} from "../../model/sqs-queue-item";

export type SelectorType<T> = MemoizedSelector<object, T, DefaultProjectorFn<T>>;
export type SelectorFeatureType<T> = MemoizedSelector<object, T>;

const selectQueueListFeature: SelectorFeatureType<SQSQueueListState> =
    createFeatureSelector<SQSQueueListState>(sqsQueueListFeatureKey);

export const selectIsLoading: SelectorType<boolean> = createSelector(
    selectQueueListFeature,
    (state: SQSQueueListState) => state.loading
);

export const selectPrefix: SelectorType<string> = createSelector(
    selectQueueListFeature,
    (state: SQSQueueListState) => state?.prefix
);

export const selectPageSize: SelectorType<number> = createSelector(
    selectQueueListFeature,
    (state: SQSQueueListState) => state?.pageSize
);

export const selectPageIndex: SelectorType<number> = createSelector(
    selectQueueListFeature,
    (state: SQSQueueListState) => state?.pageIndex
);

export const selectSortColumns: SelectorType<SortColumn[]> = createSelector(
    selectQueueListFeature,
    (state: SQSQueueListState) => state?.sortColumns
);

export const selectQueueCounters: SelectorType<ListQueueCountersResponse> = createSelector(
    selectQueueListFeature,
    (state: SQSQueueListState) => state?.listQueueResponse
);
