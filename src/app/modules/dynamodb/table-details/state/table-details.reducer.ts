import {createReducer, on} from "@ngrx/store";
import {tableDetailsActions} from './table-details.actions';
import {GetTableResponse} from "../../model/table-item";

export const dynamodbTableDetailFeatureKey = 'table-details';

export interface TableDetailsState {
    getTableResponse: GetTableResponse;
    error: string;
}

export const initialState: TableDetailsState = {
    getTableResponse: {} as GetTableResponse,
    error: "",
};

export const dynamodbTableDetailReducer = createReducer(
    initialState,

    // TableDetailsState
    on(tableDetailsActions.initialize, (state: TableDetailsState): TableDetailsState => ({...state})),

    // Get table
    on(tableDetailsActions.loadTable, (state: TableDetailsState) => ({...state})),
    on(tableDetailsActions.loadTableSuccess, (state: TableDetailsState, {getTableResponse}) => ({...state, getTableResponse: getTableResponse})),
    on(tableDetailsActions.loadTableFailure, (state: TableDetailsState, {error}) => ({...state, error: error})),

    // Update table
    on(tableDetailsActions.updateTable, (state: TableDetailsState) => ({...state})),
    on(tableDetailsActions.updateTableSuccess, (state: TableDetailsState, {getTableResponse}) => ({...state, getTableResponse: getTableResponse})),
    on(tableDetailsActions.loadTableFailure, (state: TableDetailsState, {error}) => ({...state, error: error})),
);