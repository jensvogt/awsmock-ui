import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ApiKeyListComponent} from "./api-key-list/api-key-list.component";
import {ApiKeyDetailComponent} from "./api-key-detail/api-key-detail.component";

const routes: Routes = [
    {
        path: '',
        title: 'API Key List',
        component: ApiKeyListComponent
    },
    {
        path: 'details/:id',
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
