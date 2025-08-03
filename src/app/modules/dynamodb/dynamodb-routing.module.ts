import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DynamodbTableListComponent} from "./table-list/table-list.component";
import {DynamodbItemListComponent} from "./item-list/item-list.component";
import {TableDetailsComponent} from "./table-details/table-detail.component";

const routes: Routes = [
    {
        path: '',
        title: 'DynamodbTableList',
        component: DynamodbTableListComponent
    },
    {
        path: 'items/:tableName',
        title: 'DynamodbItemList',
        component: DynamodbItemListComponent
    },
    {
        path: 'details/:tableName',
        title: 'TableDetails',
        component: TableDetailsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DynamodbRoutingModule {
}
