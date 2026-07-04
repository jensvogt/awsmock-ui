import {Routes} from '@angular/router';
import {provideState} from "@ngrx/store";
import {provideEffects} from "@ngrx/effects";
import {secretListFeatureKey, secretListReducer} from "./secret-list/state/secret-list.reducer";
import {SecretListEffects} from "./secret-list/state/secret-list.effects";
import {secretDetailsFeatureKey, secretDetailReducer} from "./secret-detail/state/secret-detail.reducer";
import {SecretDetailEffects} from "./secret-detail/state/secret-detail.effects";
import {SecretsmanagerService} from "./service/secretsmanager-service.component";

export const secretsmanagerRoutes: Routes = [
    {
        path: '',
        providers: [
            provideState(secretListFeatureKey, secretListReducer),
            provideState(secretDetailsFeatureKey, secretDetailReducer),
            provideEffects([SecretListEffects, SecretDetailEffects]),
            SecretsmanagerService,
        ],
        children: [
            {
                path: '',
                title: 'SecretList',
                loadComponent: () => import('./secret-list/secret-list.component').then(m => m.SecretListComponent)
            },
            {
                path: 'details/:secretId',
                title: 'SecretDetails',
                loadComponent: () => import('./secret-detail/secret-detail.component').then(m => m.SecretDetailComponent)
            },
        ]
    }
];
