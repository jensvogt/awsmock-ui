import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ApiKeyListComponent} from "./api-key-list/api-key-list.component";
import {ApiKeyDetailComponent} from "./api-key-detail/api-key-detail.component";
import {RestApiListComponent} from "./rest-api-list/rest-api-list.component";

const routes: Routes = [
    {
        path: '',
        title: 'REST API List',
        component: RestApiListComponent
    },
    {
        path: './rest-api-list',
        title: 'REST API List',
        component: RestApiListComponent
    },
    {
        path: './api-key-list',
        title: 'API Key List',
        component: ApiKeyListComponent
    },
    {
        path: './details/:id',
        title: 'API Key Details',
        component: ApiKeyDetailComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ApiGatewayRoutingModule {
}
