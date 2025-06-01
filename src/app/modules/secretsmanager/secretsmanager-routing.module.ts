import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SecretListComponent} from "./secret-list/secret-list.component";
import {SecretDetailComponent} from "./secret-detail/secret-detail.component";

const routes: Routes = [
    {
        path: '',
        title: 'SecretList',
        component: SecretListComponent
    },
    {
        path: 'details/:secretId',
        title: 'SecretDetails',
        component: SecretDetailComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SecretsmanagerRoutingModule {
}
