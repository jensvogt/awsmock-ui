import {createAction, props} from '@ngrx/store';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {AddRestApiRequest, ListRestApiCountersResponse} from "../../model/rest-api-item";

export const restApiListActions = {
    initialize: createAction('[rest-api-list] initialize'),

    // Load API keys
    loadRestApis: createAction('[rest-api-list] Load rest apis', props<{ prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    loadRestApisSuccess: createAction('[rest-api-list] Load rest apis success', props<{ restApis: ListRestApiCountersResponse }>()),
    loadRestApisFailure: createAction('[rest-api-list] Load rest apis error', props<{ error: string }>()),

    // Add API key
    addRestApi: createAction('[rest-api-list] Add rest apis', props<{ request: AddRestApiRequest }>()),
    addRestApiSuccess: createAction('[rest-api-list] Add rest apis success'),
    addRestApiFailure: createAction('[rest-api-list] Add rest apis error', props<{ error: string }>()),

    // Delete API key
    deleteRestApi: createAction('[rest-api-list] Delete rest apis', props<{ id: string }>()),
    deleteRestApiSuccess: createAction('[rest-api-list] Delete rest apis success'),
    deleteRestApiFailure: createAction('[rest-api-list] Delete rest apis error', props<{ error: string }>()),
}