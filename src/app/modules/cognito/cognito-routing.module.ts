import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CognitoUserPoolListComponent} from "./user-pool-list/user-pool-list.component";
import {CognitoUserListComponent} from "./user-list/user-list.component";
import {CognitoUserDetailsComponent} from "./user-detail/user-detail.component";

const routes: Routes = [
    {
        path: '',
        title: 'CognitoUserPoolsList',
        component: CognitoUserPoolListComponent
    },
    {
        path: 'users/:userPoolId',
        title: 'UserList',
        component: CognitoUserListComponent
    },
    {
        path: '/cognito-user/details/:userPoolId/:userName',
        title: 'UserDetails',
        component: CognitoUserDetailsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CognitoRoutingModule {
}
