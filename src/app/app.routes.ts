import {Routes} from '@angular/router';
import {NotFoundComponent} from "./pages/not-found/not-found.component";
import {HomeComponent} from "./pages/home/home.component";
import {QueueListComponent} from "./pages/modules/sqs/queues-list/queue-list.component";
import {SqsMessageComponent} from "./pages/modules/sqs/messages/sqs-message.component";
import {TopicListComponent} from "./pages/modules/sns/topic-list/topic-list.component";
import {TopicDetailComponent} from "./pages/modules/sns/topic-detail/topic-detail.component";
import {BucketListComponent} from "./pages/modules/s3/bucket-list/bucket-list.component";
import {ObjectListComponent} from "./pages/modules/s3/object-list/object-list.component";

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
        path: 'sqs-queues',
        component: QueueListComponent,
    },
    {
        path: 'sqs-messages',
        component: SqsMessageComponent,
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
        path: 's3-bucket-list',
        component: BucketListComponent,
    },
    {
        path: 's3-object-list/:bucketName',
        component: ObjectListComponent,
    },
    {
        path: '**',
        component: NotFoundComponent,
    }
];
