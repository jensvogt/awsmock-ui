import {createAction, props} from '@ngrx/store';
import {SsmParameterDetailsResponse} from "../../model/ssm-parameter-item";

export const ssmParameterDetailsActions = {
    initialize: createAction('[ssm-parameter-details] initialize'),

    // Load details
    loadDetails: createAction('[ssm-parameter-details] Load parameter details', props<{ name: string }>()),
    loadDetailsSuccess: createAction('[ssm-parameter-details] Load parameter details success', props<{ parameterDetails: SsmParameterDetailsResponse }>()),
    loadDetailsFailure: createAction('[ssm-parameter-details] Load parameter details error', props<{ error: string }>()),

    // Load tags
    // loadTags: createAction('[sns-parameter-details] Load parameter tags', props<{ parameterArn: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    // loadTagsSuccess: createAction('[sns-parameter-details] Load parameter tags success', props<{ tags: SsmTagCountersResponse }>()),
    // loadTagsFailure: createAction('[sns-parameter-details] Load parameter tags error', props<{ error: string }>()),

}