import {createAction, props} from '@ngrx/store';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {AddApiKeyRequest, ListApiKeyCountersResponse} from "../../model/api-key-item";

export const apiKeyListActions = {
    initialize: createAction('[api-key-list] initialize'),

    // Load API keys
    loadApiKeys: createAction('[api-key-list] Load keys', props<{ prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    loadApiKeysSuccess: createAction('[api-key-list] Load keys success', props<{ apiKeys: ListApiKeyCountersResponse }>()),
    loadApiKeysFailure: createAction('[api-key-list] Load keys error', props<{ error: string }>()),

    // Add API key
    addApiKey: createAction('[api-key-list] Add key', props<{ request: AddApiKeyRequest }>()),
    addApiKeySuccess: createAction('[api-key-list] Add key success'),
    addApiKeyFailure: createAction('[api-key-list] Add key error', props<{ error: string }>()),

    // Delete API key
    deleteApiKey: createAction('[api-key-list] Delete key', props<{ id: string }>()),
    deleteApiKeySuccess: createAction('[api-key-list] Delete key success'),
    deleteApiKeyFailure: createAction('[api-key-list] Delete key error', props<{ error: string }>()),
}