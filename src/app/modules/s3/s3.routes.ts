import {Routes} from '@angular/router';
import {provideState} from "@ngrx/store";
import {provideEffects} from "@ngrx/effects";
import {s3BucketListFeatureKey, s3BucketListReducer} from "./bucket-list/state/s3-bucket-list.reducer";
import {S3BucketListEffects} from "./bucket-list/state/s3-bucket-list.effects";
import {s3ObjectListFeatureKey, s3ObjectListReducer} from "./object-list/state/s3-object-list.reducer";
import {S3ObjectListEffects} from "./object-list/state/s3-object-list.effects";
import {S3Service} from "./service/s3-service.component";
import {AwsMockHttpService} from "../../services/awsmock-http.service";

export const s3Routes: Routes = [
    {
        path: '',
        providers: [
            provideState(s3BucketListFeatureKey, s3BucketListReducer),
            provideState(s3ObjectListFeatureKey, s3ObjectListReducer),
            provideEffects([S3BucketListEffects, S3ObjectListEffects]),
            S3Service,
            AwsMockHttpService,
        ],
        children: [
            {
                path: '',
                title: 'S3BucketList',
                loadComponent: () => import('./bucket-list/bucket-list.component').then(m => m.S3BucketListComponent)
            },
            {
                path: 'details/:bucketName',
                loadComponent: () => import('./bucket-detail/bucket-detail.component').then(m => m.S3BucketDetailComponent)
            },
            {
                path: 'objects/:bucketName',
                loadComponent: () => import('./object-list/object-list.component').then(m => m.S3ObjectListComponent)
            },
            {
                path: 'objects/:bucketName/details/:id',
                loadComponent: () => import('./object-detail/object-detail.component').then(m => m.S3ObjectDetailComponent)
            }
        ]
    }
];
