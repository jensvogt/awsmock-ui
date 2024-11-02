import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SqsQueueListComponent} from "./queues-list/sqs-queue-list.component";
import {SqsQueueDetailComponent} from "./queue-detail/sqs-queue-detail.component";
import {SqsMessageListComponent} from "./message-list/sqs-message-list.component";

const routes: Routes = [
    {
        path: '',
        title: 'SQSQueueList',
        component: SqsQueueListComponent
    },
    {
        path: 'details/:queueArn',
        title: 'SQSQueueDetails',
        component: SqsQueueDetailComponent
    },
    {
        path: 'messages/:queueArn',
        title: 'SQSQueueMessages',
        component: SqsMessageListComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SQSRoutingModule {
}
