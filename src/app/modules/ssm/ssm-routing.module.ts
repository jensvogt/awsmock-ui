import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SsmParameterListComponent} from "./parameter-list/ssm-parameter-list.component";
import {SsmParameterDetailComponent} from "./parameter-detail/ssm-parameter-detail.component";

const routes: Routes = [
    {
        path: '',
        title: 'SSMParameterList',
        component: SsmParameterListComponent
    },
    {
        path: 'details/:name',
        title: 'SSMParameterDetails',
        component: SsmParameterDetailComponent
    }/*,
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
export class SsmRoutingModule {
}
