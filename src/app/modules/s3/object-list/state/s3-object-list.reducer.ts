// Hinzufügen:
import {createReducer, on} from "@ngrx/store";
import {s3ObjectListActions} from './s3-object-list.actions';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {S3ObjectCounterResponse} from "../../model/s3-object-item"

export const s3ObjectListFeatureKey = 's3-object-list';

export interface S3ObjectListState {
    s3ObjectCounters: S3ObjectCounterResponse;
    prefix: string;
    pageSize: number;
    pageIndex: number;
    loading: boolean;
    sortColumns: SortColumn[];
    error: unknown;
}

export const initialState: S3ObjectListState = {
    s3ObjectCounters: {total: 0, objectCounters: []},
    prefix: '',
    pageSize: 10,
    pageIndex: 0,
    loading: false,
    sortColumns: [{column: 'keys', sortDirection: -1}],
    error: {}
};

export const s3ObjectListReducer = createReducer(
    initialState,

    // Initialize
    on(s3ObjectListActions.initialize, (state: S3ObjectListState): S3ObjectListState => ({...state, pageIndex: 0, pageSize: 10, loading: true})),

    // Object list
    on(s3ObjectListActions.loadObjects, (state: S3ObjectListState) => ({...state, loading: true})),
    on(s3ObjectListActions.loadObjectsSuccess, (state: S3ObjectListState, {objects}) => ({...state, s3ObjectCounters: objects, loading: false})),
    on(s3ObjectListActions.loadObjectsFailure, (state: S3ObjectListState, {error}) => ({...state, error: error, loading: false})),

    // Add object
    //on(s3ObjectListActions.addObject, (state: S3ObjectListState) => ({...state, loading: true})),
    //on(s3ObjectListActions.addObjectSuccess, (state: S3ObjectListState) => ({...state, loading: false})),
    //on(s3ObjectListActions.addObjectFailure, (state: S3ObjectListState, {error}) => ({...state, error: error, loading: false})),

    // Delete object
    on(s3ObjectListActions.deleteObject, (state: S3ObjectListState) => ({...state, loading: true})),
    on(s3ObjectListActions.deleteObjectSuccess, (state: S3ObjectListState) => ({...state, loading: false})),
    on(s3ObjectListActions.deleteObjectFailure, (state: S3ObjectListState, {error}) => ({...state, error: error, loading: false})),
);