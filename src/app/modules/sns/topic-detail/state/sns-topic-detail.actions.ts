import {createAction, props} from '@ngrx/store';
import {SnsTopicDetails} from "../../model/sns-topic-details";

export const snsTopicDetailsActions = {
    initialize: createAction('[sns-topic-details] initialize'),

    // Load details
    loadDetails: createAction('[sns-topic-details] Load Topics Details', props<{ topicArn: string }>()),
    loadDetailsSuccess: createAction('[sns-topic-details] Load Topics Details Success', props<{ topicDetails: SnsTopicDetails }>()),
    loadDetailsFailure: createAction('[sns-topic-details] Load Topics Details Error', props<{ error: string }>()),

    // Load attributes
    loadAttributes: createAction('[sns-topic-details] Load Topics Attributes', props<{ topicArn: string }>()),
    loadAttributesSuccess: createAction('[sns-topic-details] Load Topics Attributes Success', props<{ attributes: SnsTopicDetails }>()),
    loadAttributesFailure: createAction('[sns-topic-details] Load Topics Attributes Error', props<{ error: string }>()),
}