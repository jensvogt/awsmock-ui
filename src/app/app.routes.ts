import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from "./modules/not-found/not-found.component";
import {SqsMessageListComponent} from "./modules/sqs/message-list/sqs-message-list.component";
import {TopicListComponent} from "./modules/sns/topic-list/topic-list.component";
import {TopicDetailComponent} from "./modules/sns/topic-detail/topic-detail.component";
import {BucketListComponent} from "./modules/s3/bucket-list/bucket-list.component";
import {ObjectListComponent} from "./modules/s3/object-list/object-list.component";
import {SnsMessageListComponent} from "./modules/sns/message-list/sns-message-list.component";
import {BucketDetailComponent} from "./modules/s3/bucket-detail/bucket-detail.component";
import {UserPoolListComponent} from "./modules/cognito/user-pool-list/user-pool-list.component";
import {UserListComponent} from "./modules/cognito/user-list/user-list.component";
import {SqsChartsComponent} from "./modules/sqs/charts/sqs-charts.component";
import {SnsChartsComponent} from "./modules/sns/charts/sns-charts.component";
import {S3ChartsComponent} from "./modules/s3/charts/s3-charts.component";
import {BrowserModule} from "@angular/platform-browser";

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: '/dashboard',
            },
            {
                path: 'dashboard',
                loadChildren: () => import('./modules/dashboard/dashboard.module').then(module => module.DashboardModule)
            },
            //=========================================================================
            // SQS
            //=========================================================================
            {
                path: 'sqs-queue-list',
                loadChildren: () => import('./modules/sqs/sqs.module').then(module => module.SQSModule),
            },
            {
                path: 'sqs-message-list/:queueArn',
                component: SqsMessageListComponent,
            },
            {
                path: 'sqs-charts',
                component: SqsChartsComponent,
            },
            //=========================================================================
            // SNS
            //=========================================================================
            {
                path: 'sns-topic-list',
                component: TopicListComponent,
            },
            {
                path: 'sns-topic-detail/:topicArn',
                component: TopicDetailComponent,
            },
            {
                path: 'sns-message-list/:topicArn',
                component: SnsMessageListComponent,
            },
            {
                path: 'sns-charts',
                component: SnsChartsComponent,
            },
            //=========================================================================
            // S3
            //=========================================================================
            {
                path: 's3-bucket-list',
                component: BucketListComponent,
            },
            {
                path: 's3-object-list/:bucketName',
                component: ObjectListComponent,
            },
            {
                path: 's3-bucket-detail/:bucketName',
                component: BucketDetailComponent,
            },
            {
                path: 's3-charts',
                component: S3ChartsComponent,
            },
            //=========================================================================
            // Cognito
            //=========================================================================
            {
                path: 'cognito-user-pool-list',
                component: UserPoolListComponent,
            },
            {
                path: 'cognito-user-list/:userPoolId',
                component: UserListComponent,
            },
            {
                path: '**',
                component: NotFoundComponent,
            }
        ]
    }
];

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes, {
            enableTracing: false,
            useHash: false,
            //onSameUrlNavigation: 'reload'
        })
    ],
    exports: [RouterModule],
    declarations: []
})
export class AppRoutingModule {
}