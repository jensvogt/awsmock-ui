import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from "./modules/not-found/not-found.component";
import {UserPoolListComponent} from "./modules/cognito/user-pool-list/user-pool-list.component";
import {UserListComponent} from "./modules/cognito/user-list/user-list.component";
import {SqsChartsComponent} from "./modules/sqs/charts/sqs-charts.component";
import {SnsChartsComponent} from "./modules/sns/charts/sns-charts.component";
import {S3ChartsComponent} from "./modules/s3/charts/s3-charts.component";
import {BrowserModule} from "@angular/platform-browser";

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
                component: UserPoolListComponent,
            },
            {
                path: 'cognito-user-list/:userPoolId',
                component: UserListComponent,
            },
            //=========================================================================
            // Lambda functions
            //=========================================================================
            {
                path: 'lambda-function-list',
                loadChildren: () => import('./modules/lambda/lambda.module').then(module => module.LambdaModule),
            },
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