import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SsmParameterListComponent} from "./parameter-list/ssm-parameter-list.component";

const routes: Routes = [
    {
        path: '',
        title: 'SSMParameterList',
        component: SsmParameterListComponent
    }/*,
    {
        path: 'details/:queueArn',
        title: 'SQSQueueDetails',
        component: SqsQueueDetailComponent
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
export class SsmRoutingModule {
}
