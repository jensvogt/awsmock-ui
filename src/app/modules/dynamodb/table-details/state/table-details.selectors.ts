import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from "@ngrx/store";
import {dynamodbTableDetailFeatureKey, TableDetailsState} from "./table-details.reducer";
import {TableItem} from "../../model/table-item";

export type SelectorType<T> = MemoizedSelector<object, T, DefaultProjectorFn<T>>;
export type SelectorFeatureType<T> = MemoizedSelector<object, T>;

const selectTableDetailsFeature: SelectorFeatureType<TableDetailsState> =
    createFeatureSelector<TableDetailsState>(dynamodbTableDetailFeatureKey);

export const selectTableItem: SelectorType<TableItem> = createSelector(
    selectTableDetailsFeature,
    (state: TableDetailsState) => state?.getTableResponse.tableCounters
);

export const selectError: SelectorType<string> = createSelector(
    selectTableDetailsFeature,
    (state: TableDetailsState) => state?.error
);
