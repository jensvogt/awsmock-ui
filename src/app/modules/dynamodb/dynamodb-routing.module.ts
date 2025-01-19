import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DynamodbTableListComponent} from "./table-list/table-list.component";
import {DynamodbItemListComponent} from "./item-list/item-list.component";

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
    }/*,
    {
        path: '/cognito-user/details/:userPoolId/:userName',
        title: 'UserDetails',
        component: CognitoUserDetailsComponent
    }*/
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DynamodbRoutingModule {
}
