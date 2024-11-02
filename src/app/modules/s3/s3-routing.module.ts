import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {S3BucketListComponent} from "./bucket-list/bucket-list.component";
import {S3BucketDetailComponent} from "./bucket-detail/bucket-detail.component";
import {S3ObjectListComponent} from "./object-list/object-list.component";

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
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class S3RoutingModule {
}
