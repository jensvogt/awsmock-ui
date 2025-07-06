import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ApplicationListComponent} from "./application-list/application-list.component";

const routes: Routes = [
    {
        path: '',
        title: 'ApplicationList',
        component: ApplicationListComponent
    }/*,
    {
        path: 'details/:name',
        title: 'SSMParameterDetails',
        component: SsmParameterDetailComponent
    },
    {
        path: 'messages/:queueArn',
        title: 'SQSQueueMessages',
        component: SqsMessageListComponent
    }*/
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ApplicationRoutingModule {
}
