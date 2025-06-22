import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {KmsKeyListComponent} from "./key-list/key-list.component";
import {KmsKeyDetailComponent} from "./key-detail/key-detail.component";

const routes: Routes = [
    {
        path: '',
        title: 'KMSKeyList',
        component: KmsKeyListComponent
    },
    {
        path: 'details/:keyId',
        title: 'KMSKeyDetails',
        component: KmsKeyDetailComponent
    }/*,
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
