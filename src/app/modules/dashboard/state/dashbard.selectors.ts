import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from "@ngrx/store";
import {sqsQueueListFeatureKey, SQSQueueListState} from "./dashboard.reducer";

export type SelectorType<T> = MemoizedSelector<object, T, DefaultProjectorFn<T>>;
export type SelectorFeatureType<T> = MemoizedSelector<object, T>;

const selectQueueListFeature: SelectorFeatureType<SQSQueueListState> =
    createFeatureSelector<SQSQueueListState>(sqsQueueListFeatureKey);

export const selectIsLoading: SelectorType<boolean> = createSelector(
    selectQueueListFeature,
    (state: SQSQueueListState) => state.loading
);

export const selectPageSize: SelectorType<number> = createSelector(
    selectQueueListFeature,
    (state: SQSQueueListState) => state.pageSize
);