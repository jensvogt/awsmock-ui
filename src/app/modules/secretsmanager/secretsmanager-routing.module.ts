import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SecretListComponent} from "./secret-list/secret-list.component";

const routes: Routes = [
    {
        path: '',
        title: 'SQSQueueList',
        component: SecretListComponent
    },
    /*{
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
export class SecretsmanagerRoutingModule {
}
