import {Routes} from '@angular/router';
import {provideState} from "@ngrx/store";
import {provideEffects} from "@ngrx/effects";
import {kmsKeyListFeatureKey, kmsKeyListReducer} from "./key-list/state/key-list.reducer";
import {KMSKeyListEffects} from "./key-list/state/key-list.effects";
import {kmsKeyDetailsFeatureKey, kmsKeyDetailReducer} from "./key-detail/state/kms-key-detail.reducer";
import {KmsKeyDetailEffects} from "./key-detail/state/kms-key-detail.effects";
import {KmsService} from "./service/kms-service.component";

export const kmsRoutes: Routes = [
    {
        path: '',
        providers: [
            provideState(kmsKeyListFeatureKey, kmsKeyListReducer),
            provideState(kmsKeyDetailsFeatureKey, kmsKeyDetailReducer),
            provideEffects([KMSKeyListEffects, KmsKeyDetailEffects]),
            KmsService,
        ],
        children: [
            {
                path: '',
                title: 'KMSKeyList',
                loadComponent: () => import('./key-list/key-list.component').then(m => m.KmsKeyListComponent)
            },
            {
                path: 'details/:keyId',
                title: 'KMSKeyDetails',
                loadComponent: () => import('./key-detail/key-detail.component').then(m => m.KmsKeyDetailComponent)
            },
        ]
    }
];
