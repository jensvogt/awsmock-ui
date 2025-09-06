import {createAction, props} from '@ngrx/store';
import {ApiKeyDetailsResponse, ApiKeyUpdateRequest} from "../../model/api-key-item";

export const apiKeyDetailsActions = {
    initialize: createAction('[api-key-details] initialize'),

    // Load details
    loadDetails: createAction('[api-key-details] Load keys details', props<{ keyId: string }>()),
    loadDetailsSuccess: createAction('[api-key-details] Load keys details success', props<{ keyDetails: ApiKeyDetailsResponse }>()),
    loadDetailsFailure: createAction('[api-key-details] Load keys details error', props<{ error: string }>()),

    // Load tags
    // loadTags: createAction('[api-key-details] Load keys tags', props<{ keyArn: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    // loadTagsSuccess: createAction('[api-key-details] Load keys tags success', props<{ tags: ApiTagCountersResponse }>()),
    // loadTagsFailure: createAction('[api-key-details] Load keys tags error', props<{ error: string }>()),

    // Update API key
    updateApiKey: createAction('[api-key-details] Update api key', props<{ request: ApiKeyUpdateRequest }>()),
    updateApiKeySuccess: createAction('[api-key-details] Update api key success'),
    updateApiKeyFailure: createAction('[api-key-details] Update api key error', props<{ error: string }>()),
}