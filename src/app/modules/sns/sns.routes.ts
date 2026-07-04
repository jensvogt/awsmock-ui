import {Routes} from '@angular/router';
import {provideState} from "@ngrx/store";
import {provideEffects} from "@ngrx/effects";
import {snsTopicListFeatureKey, snsTopicListReducer} from "./topic-list/state/sns-topic-list.reducer";
import {SnsTopicListEffects} from "./topic-list/state/sns-topic-list.effects";
import {snsTopicDetailsFeatureKey, snsTopicDetailReducer} from "./topic-detail/state/sns-topic-detail.reducer";
import {SnsTopicDetailEffects} from "./topic-detail/state/sns-topic-detail.effects";
import {snsMessageListFeatureKey, snsMessageListReducer} from "./message-list/state/sns-message-list.reducer";
import {SnsMessageListEffects} from "./message-list/state/sns-message-list.effects";
import {SnsService} from "./service/sns-service.component";

export const snsRoutes: Routes = [
    {
        path: '',
        providers: [
            provideState(snsTopicListFeatureKey, snsTopicListReducer),
            provideState(snsTopicDetailsFeatureKey, snsTopicDetailReducer),
            provideState(snsMessageListFeatureKey, snsMessageListReducer),
            provideEffects([SnsTopicListEffects, SnsTopicDetailEffects, SnsMessageListEffects]),
            SnsService,
        ],
        children: [
            {
                path: '',
                title: 'SNSTopicList',
                loadComponent: () => import('./topic-list/topic-list.component').then(m => m.SnsTopicListComponent)
            },
            {
                path: 'details/:topicArn',
                title: 'SNSTopicDetails',
                loadComponent: () => import('./topic-detail/topic-detail.component').then(m => m.SnsTopicDetailComponent)
            },
            {
                path: 'messages/:topicArn',
                title: 'SNSMessages',
                loadComponent: () => import('./message-list/sns-message-list.component').then(m => m.SnsMessageListComponent)
            }
        ]
    }
];
