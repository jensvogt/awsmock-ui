import {Routes} from '@angular/router';
import {NotFoundComponent} from "./pages/not-found/not-found.component";
import {HomeComponent} from "./pages/home/home.component";
import {QueueListComponent} from "./pages/modules/sqs/queues-list/queue-list.component";
import {SqsMessageListComponent} from "./pages/modules/sqs/message-list/sqs-message-list.component";
import {TopicListComponent} from "./pages/modules/sns/topic-list/topic-list.component";
import {TopicDetailComponent} from "./pages/modules/sns/topic-detail/topic-detail.component";
import {BucketListComponent} from "./pages/modules/s3/bucket-list/bucket-list.component";
import {ObjectListComponent} from "./pages/modules/s3/object-list/object-list.component";
import {SnsMessageListComponent} from "./pages/modules/sns/message-list/sns-message-list.component";
import {BucketDetailComponent} from "./pages/modules/s3/bucket-detail/bucket-detail.component";
import {UserPoolListComponent} from "./pages/modules/cognito/user-pool-list/user-pool-list.component";
import {UserListComponent} from "./pages/modules/cognito/user-list/user-list.component";
import {QueueDetailComponent} from "./pages/modules/sqs/queue-detail/queue-detail.component";

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/home',
    },
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'sqs-queue-list',
        component: QueueListComponent,
    },
    {
        path: 'sqs-queue-detail/:queueArn',
        component: QueueDetailComponent,
    },
    {
        path: 'sqs-message-list/:queueArn',
        component: SqsMessageListComponent,
    },
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
];
