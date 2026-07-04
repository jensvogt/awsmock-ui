import {Routes} from '@angular/router';
import {provideState} from "@ngrx/store";
import {provideEffects} from "@ngrx/effects";
import {ssmParameterListFeatureKey, ssmParameterListReducer} from "./parameter-list/state/ssm-parameter-list.reducer";
import {SsmParameterListEffects} from "./parameter-list/state/ssm-parameter-list.effects";
import {ssmParameterDetailsFeatureKey, ssmParameterDetailReducer} from "./parameter-detail/state/ssm-parameter-detail.reducer";
import {SsmParameterDetailEffects} from "./parameter-detail/state/ssm-parameter-detail.effects";
import {SsmService} from "./service/ssm-service.component";

export const ssmRoutes: Routes = [
    {
        path: '',
        providers: [
            provideState(ssmParameterListFeatureKey, ssmParameterListReducer),
            provideState(ssmParameterDetailsFeatureKey, ssmParameterDetailReducer),
            provideEffects([SsmParameterListEffects, SsmParameterDetailEffects]),
            SsmService,
        ],
        children: [
            {
                path: '',
                title: 'SSMParameterList',
                loadComponent: () => import('./parameter-list/ssm-parameter-list.component').then(m => m.SsmParameterListComponent)
            },
            {
                path: 'details/:name',
                title: 'SSMParameterDetails',
                loadComponent: () => import('./parameter-detail/ssm-parameter-detail.component').then(m => m.SsmParameterDetailComponent)
            },
        ]
    }
];
