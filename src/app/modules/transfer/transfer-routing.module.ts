import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TransferServerListComponent} from "./server-list/transfer-server-list.component";
import {TransferServerDetailComponent} from "./transfer-details/transfer-server-detail.component";

const routes: Routes = [
    {
        path: '',
        title: 'TransferServerList',
        component: TransferServerListComponent
    },
    {
        path: 'details/:serverId',
        title: 'TransferServerDetails',
        component: TransferServerDetailComponent
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
export class TransferRoutingModule {
}
