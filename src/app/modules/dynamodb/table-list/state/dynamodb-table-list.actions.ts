import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {createAction, props} from "@ngrx/store";
import {TableCountersResponse} from "../../model/table-item";

export const dynamodbTableListActions = {
    initialize: createAction('[dynamodb-table-list] initialize'),

    // Load user pool
    loadTables: createAction('[dynamodb-table-list] Load tables', props<{ prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    loadTablesSuccess: createAction('[dynamodb-table-list] Load tables success', props<{ tables: TableCountersResponse }>()),
    loadTablesFailure: createAction('[dynamodb-table-list] Load tables error', props<{ error: string }>()),

    // Add user pool
    addTable: createAction('[dynamodb-table-list] Add table', props<{ tableName: string }>()),
    addTableSuccess: createAction('[dynamodb-table-list] Add table success'),
    addTableFailure: createAction('[dynamodb-table-list] Add table error', props<{ error: string }>()),

    // Delete user pool
    deleteTable: createAction('[dynamodb-table-list] Delete table', props<{ tableName: string }>()),
    deleteTableSuccess: createAction('[dynamodb-table-list] Delete table success'),
    deleteTableFailure: createAction('[dynamodb-table-list] Delete table error', props<{ error: string }>()),
}
