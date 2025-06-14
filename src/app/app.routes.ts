import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from "./modules/not-found/not-found.component";
import {SnsChartsComponent} from "./modules/sns/charts/sns-charts.component";
import {S3ChartsComponent} from "./modules/s3/charts/s3-charts.component";
import {BrowserModule} from "@angular/platform-browser";
import {LambdaChartsComponent} from "./modules/lambda/charts/lambda-charts.component";
import {CognitoUserDetailsComponent} from "./modules/cognito/user-detail/user-detail.component";
import {SqsChartsComponent} from "./modules/sqs/charts/sqs-charts.component";
import {CognitoChartsComponent} from "./modules/cognito/charts/cognito-charts.component";

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: '/dashboard',
            },
            {
                path: 'dashboard',
                loadChildren: () => import('./modules/dashboard/dashboard.module').then(module => module.DashboardModule)
            },
            //=========================================================================
            // SQS
            //=========================================================================
            {
                path: 'sqs-queue-list',
                loadChildren: () => import('./modules/sqs/sqs.module').then(module => module.SQSModule),
            },
            {
                path: 'sqs-charts',
                component: SqsChartsComponent,
            },
            {
                path: 'sqs',
                loadChildren: () => import('./modules/sqs/sqs.module').then(module => module.SQSModule),
            },
            //=========================================================================
            // SNS
            //=========================================================================
            {
                path: 'sns-topic-list',
                loadChildren: () => import('./modules/sns/sns.module').then(module => module.SnsModule),
            },
            {
                path: 'sns-charts',
                component: SnsChartsComponent,
            },
            {
                path: 'sns',
                loadChildren: () => import('./modules/sns/sns.module').then(module => module.SnsModule),
            },
            //=========================================================================
            // S3
            //=========================================================================
            {
                path: 's3-bucket-list',
                loadChildren: () => import('./modules/s3/s3.module').then(module => module.S3Module),
            },
            {
                path: 's3-charts',
                component: S3ChartsComponent,
            },
            {
                path: 's3',
                loadChildren: () => import('./modules/s3/s3.module').then(module => module.S3Module),
            },
            //=========================================================================
            // Cognito
            //=========================================================================
            {
                path: 'cognito-user-pool-list',
                loadChildren: () => import('./modules/cognito/cognito.module').then(module => module.CognitoModule),
            },
            {
                path: 'cognito',
                loadChildren: () => import('./modules/cognito/cognito.module').then(module => module.CognitoModule),
            },
            {
                path: 'cognito-charts',
                component: CognitoChartsComponent,
            },
            {
                path: 'cognito-user/details/:userPoolId/:userName',
                title: 'UserDetails',
                component: CognitoUserDetailsComponent
            },
            //=========================================================================
            // Lambda functions
            //=========================================================================
            {
                path: 'lambda-function-list',
                loadChildren: () => import('./modules/lambda/lambda.module').then(module => module.LambdaModule),
            },
            {
                path: 'lambda',
                loadChildren: () => import('./modules/lambda/lambda.module').then(module => module.LambdaModule),
            },
            {
                path: 'lambda-charts',
                component: LambdaChartsComponent,
            },
            //=========================================================================
            // DynamoDB tables
            //=========================================================================
            {
                path: 'dynamodb-table-list',
                loadChildren: () => import('./modules/dynamodb/dynamodb-module').then(module => module.DynamodbModule),
            },
            //=========================================================================
            // Transfer server
            //=========================================================================
            {
                path: 'transfer-server-list',
                loadChildren: () => import('./modules/transfer/transfer.module').then(module => module.TransferModule),
            },
            //=========================================================================
            // Secrets manager
            //=========================================================================
            {
                path: 'secret-list',
                loadChildren: () => import('./modules/secretsmanager/secretsmanager.module').then(module => module.SecretsmanagerModule),
            },
            //=========================================================================
            // Not found
            //=========================================================================
            {
                path: '**',
                component: NotFoundComponent,
            }
        ]
    }
];

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes, {
            enableTracing: false,
            useHash: false,
            onSameUrlNavigation: 'reload'
        })
    ],
    exports: [RouterModule],
    declarations: []
})
export class AppRoutingModule {
}