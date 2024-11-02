import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from "@ngrx/store";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {snsTopicListFeatureKey, SNSTopicListState} from "./sns-topic-list.reducer";
import {ListTopicCountersResponse} from "../../model/sns-topic-item";

export type SelectorType<T> = MemoizedSelector<object, T, DefaultProjectorFn<T>>;
export type SelectorFeatureType<T> = MemoizedSelector<object, T>;

const selectQueueListFeature: SelectorFeatureType<SNSTopicListState> =
    createFeatureSelector<SNSTopicListState>(snsTopicListFeatureKey);

export const selectIsLoading: SelectorType<boolean> = createSelector(
    selectQueueListFeature,
    (state: SNSTopicListState) => state.loading
);

export const selectPrefix: SelectorType<string> = createSelector(
    selectQueueListFeature,
    (state: SNSTopicListState) => state?.prefix
);

export const selectPageSize: SelectorType<number> = createSelector(
    selectQueueListFeature,
    (state: SNSTopicListState) => state?.pageSize
);

export const selectPageIndex: SelectorType<number> = createSelector(
    selectQueueListFeature,
    (state: SNSTopicListState) => state?.pageIndex
);

export const selectSortColumns: SelectorType<SortColumn[]> = createSelector(
    selectQueueListFeature,
    (state: SNSTopicListState) => state?.sortColumns
);

export const selectTopicCounters: SelectorType<ListTopicCountersResponse> = createSelector(
    selectQueueListFeature,
    (state: SNSTopicListState) => state?.listTopicResponse
);
