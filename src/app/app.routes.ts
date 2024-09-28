import {Routes} from '@angular/router';
import {NotFoundComponent} from "./pages/not-found/not-found.component";
import {HomeComponent} from "./pages/home/home.component";
import {QueueListComponent} from "./pages/modules/sqs/queues-list/queue-list-component";
import {SqsMessageComponent} from "./pages/modules/sqs/messages/sqs-message.component";
import {TopicListComponent} from "./pages/modules/sns/topic-list/topic-list.component";
import {TopicDetailComponent} from "./pages/modules/sns/topic-detail/topic-detail.component";

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/home',
    },
    {
        path: 'home',
        component: HomeComponent,
        data: {
            breadcrumb: {
                label: 'Home',
            },
        },
        children: [
            {
                path: 'sqs-queues',
                component: QueueListComponent,
                data: {
                    breadcrumb: {
                        label: 'SQS Queue List',
                    },
                },
            },
            {
                path: 'sns-topic-list',
                component: TopicListComponent,
                data: {
                    breadcrumb: {
                        label: 'SNS Topic List',
                    },
                },
                children: [
                    {
                        path: 'sns-topic-details',
                        component: TopicDetailComponent,
                        data: {
                            breadcrumb: {
                                label: 'SNS Topic Details',
                            },
                        }
                    }
                ]
            }
        ],
    },
    {
        path: 'sqs-queues',
        component: QueueListComponent,
        data: {
            breadcrumb: {
                label: 'SQS Queue List',
            },
        },
        children: [
            {
                path: 'sqs-queues',
                component: QueueListComponent,
                data: {
                    breadcrumb: {
                        label: 'SQS Queue List',
                    },
                },
            }
        ]
    },
    {
        path: 'sqs-messages',
        component: SqsMessageComponent,
    },
    {
        path: 'sns-topic-list',
        component: TopicListComponent,
        data: {
            breadcrumb: {
                label: 'SNS Topic List',
            },
        },
        children: [
            {
                path: 'sqs-queues-detail',
                component: TopicDetailComponent,
                data: {
                    breadcrumb: {
                        label: 'SQS Queue List',
                    },
                },
            }
        ]
    },
    {
        path: 'sns-topic-detail/:topicArn',
        component: TopicDetailComponent,
        data: {
            breadcrumb: {
                label: 'SNS Topic Details',
            },
        },
    },
    {
        path: 's3-buckets',
        component: QueueListComponent,
    },
    {
        path: '**',
        component: NotFoundComponent,
    }
];
