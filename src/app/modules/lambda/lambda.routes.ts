import {Routes} from '@angular/router';
import {provideState} from "@ngrx/store";
import {provideEffects} from "@ngrx/effects";
import {lambdaFunctionListFeatureKey, lambdaFunctionListReducer} from "./function-list/state/lambda-function-list.reducer";
import {LambdaFunctionListEffects} from "./function-list/state/lambda-function-list.effects";
import {lambdaFunctionDetailsFeatureKey, lambdaFunctionDetailsReducer} from "./function-details/state/lambda-function-details.reducer";
import {LambdaFunctionDetailsEffects} from "./function-details/state/lambda-function-details.effects";
import {LambdaService} from "./service/lambda-service.component";
import {SqsService} from "../sqs/service/sqs-service.component";
import {SnsService} from "../sns/service/sns-service.component";
import {S3Service} from "../s3/service/s3-service.component";
import {DynamodbService} from "../dynamodb/service/dynamodb.service";

export const lambdaRoutes: Routes = [
    {
        path: '',
        providers: [
            provideState(lambdaFunctionListFeatureKey, lambdaFunctionListReducer),
            provideState(lambdaFunctionDetailsFeatureKey, lambdaFunctionDetailsReducer),
            provideEffects([LambdaFunctionListEffects, LambdaFunctionDetailsEffects]),
            LambdaService,
            SqsService,
            SnsService,
            S3Service,
            DynamodbService,
        ],
        children: [
            {
                path: '',
                title: 'LambdaFunctionList',
                loadComponent: () => import('./function-list/function-list.component').then(m => m.LambdaFunctionListComponent)
            },
            {
                path: 'details/:functionArn',
                title: 'LambdaFunctionDetails',
                loadComponent: () => import('./function-details/function-detail.component').then(m => m.LambdaFunctionDetailsComponent)
            },
        ]
    }
];
