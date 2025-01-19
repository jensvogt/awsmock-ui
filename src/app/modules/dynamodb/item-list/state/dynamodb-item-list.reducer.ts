import {createReducer, on} from "@ngrx/store";
import {dynamodbItemListActions} from './dynamodb-item-list.actions';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {ItemCountersResponse} from "../../model/item-item";

export const dynamodbItemListFeatureKey = 'dynamodb-item-list';

export interface DynamodbItemListState {
    listItemResponse: ItemCountersResponse;
    prefix: string;
    pageSize: number;
    pageIndex: number;
    loading: boolean;
    sortColumns: SortColumn[];
    error: unknown;
}

export const initialState: DynamodbItemListState = {
    listItemResponse: {total: 0, itemCounters: []},
    prefix: '',
    pageSize: 10,
    pageIndex: 0,
    loading: false,
    sortColumns: [{column: 'itemName', sortDirection: -1}],
    error: {}
};

export const dynamodbItemListReducer = createReducer(
    initialState,

    // Initialize
    on(dynamodbItemListActions.initialize, (state: DynamodbItemListState): DynamodbItemListState => ({...state, pageIndex: 0, pageSize: 10, loading: true})),

    // Queue list
    on(dynamodbItemListActions.loadItems, (state: DynamodbItemListState) => ({...state, loading: true})),
    on(dynamodbItemListActions.loadItemsSuccess, (state: DynamodbItemListState, {items}) => ({
        ...state,
        listItemResponse: items,
        loading: false
    })),
    on(dynamodbItemListActions.loadItemsFailure, (state: DynamodbItemListState, {error}) => ({...state, error: error, loading: false})),

    // Add queue
    // on(dynamodbItemListActions.addItem, (state: DynamodbItemListState) => ({...state, loading: true})),
    // on(dynamodbItemListActions.addItemSuccess, (state: DynamodbItemListState) => ({...state, loading: false})),
    // on(dynamodbItemListActions.addItemFailure, (state: DynamodbItemListState, {error}) => ({...state, error: error, loading: false})),

    // Delete queue
    // on(dynamodbItemListActions.deleteItem, (state: DynamodbItemListState) => ({...state, loading: true})),
    // on(dynamodbItemListActions.deleteItemSuccess, (state: DynamodbItemListState) => ({...state, loading: false})),
    // on(dynamodbItemListActions.deleteItemFailure, (state: DynamodbItemListState, {error}) => ({...state, error: error, loading: false})),
);