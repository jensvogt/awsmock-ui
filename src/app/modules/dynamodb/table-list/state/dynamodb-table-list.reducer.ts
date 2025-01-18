import {createReducer, on} from "@ngrx/store";
import {dynamodbTableListActions} from './dynamodb-table-list.actions';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {TableCountersResponse} from "../../model/table-item";

export const dynamodbTableListFeatureKey = 'dynamodb-table-list';

export interface DynamodbTableListState {
    listTableResponse: TableCountersResponse;
    prefix: string;
    pageSize: number;
    pageIndex: number;
    loading: boolean;
    sortColumns: SortColumn[];
    error: unknown;
}

export const initialState: DynamodbTableListState = {
    listTableResponse: {total: 0, tableCounters: []},
    prefix: '',
    pageSize: 10,
    pageIndex: 0,
    loading: false,
    sortColumns: [{column: 'tableName', sortDirection: -1}],
    error: {}
};

export const dynamodbTableListReducer = createReducer(
    initialState,

    // Initialize
    on(dynamodbTableListActions.initialize, (state: DynamodbTableListState): DynamodbTableListState => ({...state, pageIndex: 0, pageSize: 10, loading: true})),

    // Queue list
    on(dynamodbTableListActions.loadTables, (state: DynamodbTableListState) => ({...state, loading: true})),
    on(dynamodbTableListActions.loadTablesSuccess, (state: DynamodbTableListState, {tables}) => ({
        ...state,
        listTableResponse: tables,
        loading: false
    })),
    on(dynamodbTableListActions.loadTablesFailure, (state: DynamodbTableListState, {error}) => ({...state, error: error, loading: false})),

    // Add queue
    on(dynamodbTableListActions.addTable, (state: DynamodbTableListState) => ({...state, loading: true})),
    on(dynamodbTableListActions.addTableSuccess, (state: DynamodbTableListState) => ({...state, loading: false})),
    on(dynamodbTableListActions.addTableFailure, (state: DynamodbTableListState, {error}) => ({...state, error: error, loading: false})),

    // Delete queue
    on(dynamodbTableListActions.deleteTable, (state: DynamodbTableListState) => ({...state, loading: true})),
    on(dynamodbTableListActions.deleteTableSuccess, (state: DynamodbTableListState) => ({...state, loading: false})),
    on(dynamodbTableListActions.deleteTableFailure, (state: DynamodbTableListState, {error}) => ({...state, error: error, loading: false})),
);