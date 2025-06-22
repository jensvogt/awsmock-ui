import {createAction, props} from '@ngrx/store';
import {KeyDetailsResponse} from "../../model/key-details";

export const kmsKeyDetailsActions = {
    initialize: createAction('[kms-key-details] initialize'),

    // Load details
    loadDetails: createAction('[kms-key-details] Load keys details', props<{ keyId: string }>()),
    loadDetailsSuccess: createAction('[kms-key-details] Load keys details success', props<{ keyDetails: KeyDetailsResponse }>()),
    loadDetailsFailure: createAction('[kms-key-details] Load keys details error', props<{ error: string }>()),

    // Load tags
    // loadTags: createAction('[kms-key-details] Load keys tags', props<{ keyArn: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    // loadTagsSuccess: createAction('[kms-key-details] Load keys tags success', props<{ tags: KmsTagCountersResponse }>()),
    // loadTagsFailure: createAction('[kms-key-details] Load keys tags error', props<{ error: string }>()),
}