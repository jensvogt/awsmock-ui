import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from "@ngrx/store";
import {sqsQueueDetailsFeatureKey, SqsQueueDetailsState} from "./sqs-queue-detail.reducer";
import {SqsQueueDetails} from "../../model/sqs-queue-details";
import {SqsAttributeCountersResponse} from "../../model/sqs-attribute-item";
import {SqsLambdaTriggerCountersResponse} from "../../model/sqs-lambda-trigger-item";
import {SqsTagCountersResponse} from "../../model/sqs-tag-item";

export type SelectorType<T> = MemoizedSelector<object, T, DefaultProjectorFn<T>>;
export type SelectorFeatureType<T> = MemoizedSelector<object, T>;

const selectQueueDetailsFeature: SelectorFeatureType<SqsQueueDetailsState> =
    createFeatureSelector<SqsQueueDetailsState>(sqsQueueDetailsFeatureKey);

export const selectDetails: SelectorType<SqsQueueDetails> = createSelector(
    selectQueueDetailsFeature,
    (state: SqsQueueDetailsState) => state?.sqsQueueDetails
);

export const selectAttributes: SelectorType<SqsAttributeCountersResponse> = createSelector(
    selectQueueDetailsFeature,
    (state: SqsQueueDetailsState) => state?.sqsQueueAttributes
);

export const selectAttributePageSize: SelectorType<number> = createSelector(
    selectQueueDetailsFeature,
    (state: SqsQueueDetailsState) => state?.attributePageSize
);

export const selectAttributePageIndex: SelectorType<number> = createSelector(
    selectQueueDetailsFeature,
    (state: SqsQueueDetailsState) => state?.attributePageIndex
);

export const selectLambdaTriggers: SelectorType<SqsLambdaTriggerCountersResponse> = createSelector(
    selectQueueDetailsFeature,
    (state: SqsQueueDetailsState) => state?.sqsLambdaTriggers
);

export const selectLambdaTriggerPageSize: SelectorType<number> = createSelector(
    selectQueueDetailsFeature,
    (state: SqsQueueDetailsState) => state?.lambdaTriggerPageSize
);

export const selectLambdaTriggerPageIndex: SelectorType<number> = createSelector(
    selectQueueDetailsFeature,
    (state: SqsQueueDetailsState) => state?.lambdaTriggerPageIndex
);

export const selectTags: SelectorType<SqsTagCountersResponse> = createSelector(
    selectQueueDetailsFeature,
    (state: SqsQueueDetailsState) => state?.sqsQueueTags
);

export const selectTagPageSize: SelectorType<number> = createSelector(
    selectQueueDetailsFeature,
    (state: SqsQueueDetailsState) => state?.tagPageSize
);

export const selectTagPageIndex: SelectorType<number> = createSelector(
    selectQueueDetailsFeature,
    (state: SqsQueueDetailsState) => state?.tagPageIndex
);

export const selectError: SelectorType<any> = createSelector(
    selectQueueDetailsFeature,
    (state: SqsQueueDetailsState) => state?.error
);
