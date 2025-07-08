import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ApplicationListComponent} from "./application-list/application-list.component";
import {ApplicationDetailsComponent} from "./application-details/application-detail.component";

const routes: Routes = [
    {
        path: '',
        title: 'ApplicationList',
        component: ApplicationListComponent
    },
    {
        path: 'details/:name',
        title: 'ApplicationDetails',
        component: ApplicationDetailsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ApplicationRoutingModule {
}
