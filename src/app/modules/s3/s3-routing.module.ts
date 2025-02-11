import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {S3BucketListComponent} from "./bucket-list/bucket-list.component";
import {S3BucketDetailComponent} from "./bucket-detail/bucket-detail.component";
import {S3ObjectListComponent} from "./object-list/object-list.component";
import {S3ObjectDetailComponent} from "./object-detail/object-detail.component";

const routes: Routes = [
    {
        path: '',
        title: 'S3BucketList',
        component: S3BucketListComponent
    },
    {
        path: 'details/:bucketName',
        component: S3BucketDetailComponent
    },
    {
        path: 'objects/:bucketName',
        component: S3ObjectListComponent
    },
    {
        path: 'objects/:bucketName/details/:id',
        component: S3ObjectDetailComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class S3RoutingModule {
}
