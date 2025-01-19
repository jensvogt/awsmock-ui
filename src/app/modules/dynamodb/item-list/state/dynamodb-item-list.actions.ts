import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {createAction, props} from "@ngrx/store";
import {ItemCountersResponse} from "../../model/item-item";

export const dynamodbItemListActions = {
    initialize: createAction('[dynamodb-item-list] initialize'),

    // Load user pool
    loadItems: createAction('[dynamodb-item-list] Load items', props<{ tableName: string, prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    loadItemsSuccess: createAction('[dynamodb-item-list] Load items success', props<{ items: ItemCountersResponse }>()),
    loadItemsFailure: createAction('[dynamodb-item-list] Load items error', props<{ error: string }>()),

}
