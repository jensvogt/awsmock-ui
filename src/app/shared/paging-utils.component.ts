import {SortColumn} from "./sorting/sorting.component";
import {MatTableDataSource} from "@angular/material/table";
import {Environment} from "../modules/application/model/application-item";

export function convertObjectToArray(obj: any, pageSize: number, pageIndex: number, sortColumn: SortColumn): MatTableDataSource<Environment> {
    let array: Environment[] = [];
    for (let key of Object.getOwnPropertyNames(obj)) {
        array.push({key: key, value: obj[key]});
    }

    array = array.sort((a: any, b: any) => a[sortColumn.column].localeCompare(b[sortColumn.column]));
    if (sortColumn.sortDirection === 1) {
        array = array.reverse();
    }
    if (array.length > pageSize) {
        array = array.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
    }
    return new MatTableDataSource<Environment>(array);
}