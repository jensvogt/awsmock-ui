import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from "@ngrx/store";
import {sqsQueueDetailsFeatureKey, SqsQueueDetailsState} from "./sqs-queue-detail.reducer";
import {SqsQueueDetails} from "../../model/sqs-queue-details";

export type SelectorType<T> = MemoizedSelector<object, T, DefaultProjectorFn<T>>;
export type SelectorFeatureType<T> = MemoizedSelector<object, T>;

const selectQueueDetailsFeature: SelectorFeatureType<SqsQueueDetailsState> =
    createFeatureSelector<SqsQueueDetailsState>(sqsQueueDetailsFeatureKey);

export const selectDetails: SelectorType<SqsQueueDetails> = createSelector(
    selectQueueDetailsFeature,
    (state: SqsQueueDetailsState) => state?.sqsQueueDetails
);

export const selectError: SelectorType<any> = createSelector(
    selectQueueDetailsFeature,
    (state: SqsQueueDetailsState) => state?.error
);
