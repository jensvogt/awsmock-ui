import {createAction, props} from '@ngrx/store';
import {GetTableRequest, GetTableResponse, UpdateTableRequest} from "../../model/table-item";

export const tableDetailsActions = {
    initialize: createAction('[table-details] initialize'),

    // Load tables
    loadTable: createAction('[table-details] Load table', props<{ request: GetTableRequest }>()),
    loadTableSuccess: createAction('[table-details] Load table success', props<{ getTableResponse: GetTableResponse }>()),
    loadTableFailure: createAction('[table-details] Load table error', props<{ error: string }>()),

    // Update tables
    updateTable: createAction('[table-details] Update table', props<{ request: UpdateTableRequest }>()),
    updateTableSuccess: createAction('[table-details] Update table success', props<{ getTableResponse: GetTableResponse }>()),
    updateTableFailure: createAction('[table-details] Update table error', props<{ error: string }>()),
}