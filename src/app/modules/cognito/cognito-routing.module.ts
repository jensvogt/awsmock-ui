import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CognitoUserPoolListComponent} from "./user-pool-list/user-pool-list.component";
import {CognitoUserListComponent} from "./user-list/user-list.component";

const routes: Routes = [
    {
        path: '',
        title: 'CognitoUserPoolsList',
        component: CognitoUserPoolListComponent
    },
    // {
    //     path: 'details/:queueArn',
    //     title: 'SQSQueueDetails',
    //     component: SqsQueueDetailComponent
    // },
    {
        path: 'users/:userPoolId',
        title: 'SQSQueueMessages',
        component: CognitoUserListComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CognitoRoutingModule {
}
