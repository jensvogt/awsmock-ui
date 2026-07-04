import {Routes} from '@angular/router';
import {provideState} from "@ngrx/store";
import {provideEffects} from "@ngrx/effects";
import {dynamodbTableListFeatureKey, dynamodbTableListReducer} from "./table-list/state/dynamodb-table-list.reducer";
import {DynamodbTableListEffects} from "./table-list/state/dynamodb-table-list.effects";
import {dynamodbItemListFeatureKey, dynamodbItemListReducer} from "./item-list/state/dynamodb-item-list.reducer";
import {DynamodbItemListEffects} from "./item-list/state/dynamodb-item-list.effects";
import {dynamodbTableDetailFeatureKey, dynamodbTableDetailReducer} from "./table-details/state/table-details.reducer";
import {DynamodbTableDetailEffects} from "./table-details/state/table-details.effects";
import {DynamodbService} from "./service/dynamodb.service";

export const dynamodbRoutes: Routes = [
    {
        path: '',
        providers: [
            provideState(dynamodbTableListFeatureKey, dynamodbTableListReducer),
            provideState(dynamodbItemListFeatureKey, dynamodbItemListReducer),
            provideState(dynamodbTableDetailFeatureKey, dynamodbTableDetailReducer),
            provideEffects([DynamodbTableListEffects, DynamodbItemListEffects, DynamodbTableDetailEffects]),
            DynamodbService,
        ],
        children: [
            {
                path: '',
                title: 'DynamodbTableList',
                loadComponent: () => import('./table-list/table-list.component').then(m => m.DynamodbTableListComponent)
            },
            {
                path: 'items/:tableName',
                title: 'DynamodbItemList',
                loadComponent: () => import('./item-list/item-list.component').then(m => m.DynamodbItemListComponent)
            },
            {
                path: 'details/:tableName',
                title: 'TableDetails',
                loadComponent: () => import('./table-details/table-detail.component').then(m => m.TableDetailsComponent)
            },
        ]
    }
];
