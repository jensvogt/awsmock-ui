import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ApiKeyListComponent} from "./api-key-list/api-key-list.component";

const routes: Routes = [
    {
        path: '',
        title: 'ApplicationList',
        component: ApiKeyListComponent
    }
    // },
    // {
    //     path: 'details/:name',
    //     title: 'ApplicationDetails',
    //     component: ApiKeyDetailsComponent
    // }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ApiGatewayRoutingModule {
}
