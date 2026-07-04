import {Routes} from '@angular/router';
import {provideState} from "@ngrx/store";
import {provideEffects} from "@ngrx/effects";
import {transferServerListFeatureKey, transferServerListReducer} from "./server-list/state/transfer-server-list.reducer";
import {TransferServerListEffects} from "./server-list/state/transfer-server-list.effects";
import {transferServerDetailsFeatureKey, transferServerDetailReducer} from "./transfer-details/state/transfer-server-detail.reducer";
import {TransferServerDetailEffects} from "./transfer-details/state/transfer-server-detail.effects";
import {TransferService} from "./service/transfer.service";

export const transferRoutes: Routes = [
    {
        path: '',
        providers: [
            provideState(transferServerListFeatureKey, transferServerListReducer),
            provideState(transferServerDetailsFeatureKey, transferServerDetailReducer),
            provideEffects([TransferServerListEffects, TransferServerDetailEffects]),
            TransferService,
        ],
        children: [
            {
                path: '',
                title: 'TransferServerList',
                loadComponent: () => import('./server-list/transfer-server-list.component').then(m => m.TransferServerListComponent)
            },
            {
                path: 'details/:serverId',
                title: 'TransferServerDetails',
                loadComponent: () => import('./transfer-details/transfer-server-detail.component').then(m => m.TransferServerDetailComponent)
            },
        ]
    }
];
