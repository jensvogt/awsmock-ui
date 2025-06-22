import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {KmsKeyListComponent} from "./key-list/key-list.component";

const routes: Routes = [
    {
        path: '',
        title: 'KMSKeyList',
        component: KmsKeyListComponent
    }/*,
    {
        path: 'details/:topicArn',
        title: 'SNSTopicDetails',
        component: SnsTopicDetailComponent
    },
    {
        path: 'messages/:topicArn',
        title: 'SNSMessages',
        component: SnsMessageListComponent
    }*/
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class KmsRoutingModule {
}
