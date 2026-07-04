import {Routes} from '@angular/router';
import {provideState} from "@ngrx/store";
import {provideEffects} from "@ngrx/effects";
import {sqsQueueListFeatureKey, sqsQueueListReducer} from "./queues-list/state/sqs-queue-list.reducer";
import {SqsQueueListEffects} from "./queues-list/state/sqs-queue-list.effects";
import {sqsQueueDetailsFeatureKey, sqsQueueDetailReducer} from "./queue-detail/state/sqs-queue-detail.reducer";
import {SqsQueueDetailEffects} from "./queue-detail/state/sqs-queue-detail.effects";
import {sqsMessageListFeatureKey, sqsMessageListReducer} from "./message-list/state/sqs-message-list.reducer";
import {SqsMessageListEffects} from "./message-list/state/sqs-message-list.effects";
import {SqsService} from "./service/sqs-service.component";

export const sqsRoutes: Routes = [
    {
        path: '',
        providers: [
            provideState(sqsQueueListFeatureKey, sqsQueueListReducer),
            provideState(sqsQueueDetailsFeatureKey, sqsQueueDetailReducer),
            provideState(sqsMessageListFeatureKey, sqsMessageListReducer),
            provideEffects([SqsQueueListEffects, SqsQueueDetailEffects, SqsMessageListEffects]),
            SqsService,
        ],
        children: [
            {
                path: '',
                title: 'SQSQueueList',
                loadComponent: () => import('./queues-list/sqs-queue-list.component').then(m => m.SqsQueueListComponent)
            },
            {
                path: 'details/:queueArn',
                title: 'SQSQueueDetails',
                loadComponent: () => import('./queue-detail/sqs-queue-detail.component').then(m => m.SqsQueueDetailComponent)
            },
            {
                path: 'messages/:queueArn',
                title: 'SQSQueueMessages',
                loadComponent: () => import('./message-list/sqs-message-list.component').then(m => m.SqsMessageListComponent)
            }
        ]
    }
];
