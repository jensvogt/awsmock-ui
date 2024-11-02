import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SnsTopicListComponent} from "./topic-list/topic-list.component";
import {SnsTopicDetailComponent} from "./topic-detail/topic-detail.component";
import {SnsMessageListComponent} from "./message-list/sns-message-list.component";

const routes: Routes = [
    {
        path: '',
        title: 'SNSTopicList',
        component: SnsTopicListComponent
    },
    {
        path: 'details/:topicArn',
        title: 'SNSTopicDetails',
        component: SnsTopicDetailComponent
    },
    {
        path: 'messages/:topicArn',
        title: 'SNSTopicMessages',
        component: SnsMessageListComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SnsRoutingModule {
}
