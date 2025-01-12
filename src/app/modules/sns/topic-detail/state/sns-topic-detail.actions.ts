import {createAction, props} from '@ngrx/store';
import {SnsTopicDetails} from "../../model/sns-topic-details";
import {SnsSubscriptionCountersResponse, SnsTagCountersResponse} from "../../model/sns-subscription-item";
import {SortColumn} from "../../../../shared/sorting/sorting.component";

export const snsTopicDetailsActions = {
    initialize: createAction('[sns-topic-details] initialize'),

    // Load details
    loadDetails: createAction('[sns-topic-details] Load topics details', props<{ topicArn: string }>()),
    loadDetailsSuccess: createAction('[sns-topic-details] Load topics details success', props<{ topicDetails: SnsTopicDetails }>()),
    loadDetailsFailure: createAction('[sns-topic-details] Load topics details error', props<{ error: string }>()),

    // Load attributes
    loadAttributes: createAction('[sns-topic-details] Load topics attributes', props<{ topicArn: string }>()),
    loadAttributesSuccess: createAction('[sns-topic-details] Load topics attributes success', props<{ attributes: SnsTopicDetails }>()),
    loadAttributesFailure: createAction('[sns-topic-details] Load topics attributes error', props<{ error: string }>()),

    // Load subscriptions
    loadSubscriptions: createAction('[sns-topic-details] Load topics subscriptions', props<{ topicArn: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    loadSubscriptionsSuccess: createAction('[sns-topic-details] Load topics subscriptions success', props<{ subscriptions: SnsSubscriptionCountersResponse }>()),
    loadSubscriptionsFailure: createAction('[sns-topic-details] Load topics subscriptions error', props<{ error: string }>()),

    // Load tags
    loadTags: createAction('[sns-topic-details] Load topics tags', props<{ topicArn: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    loadTagsSuccess: createAction('[sns-topic-details] Load topics tags success', props<{ tags: SnsTagCountersResponse }>()),
    loadTagsFailure: createAction('[sns-topic-details] Load topics tags error', props<{ error: string }>()),
}