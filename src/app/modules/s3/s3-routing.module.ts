import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {S3BucketListComponent} from "./bucket-list/bucket-list.component";
import {S3BucketDetailComponent} from "./bucket-detail/bucket-detail.component";
import {S3ObjectListComponent} from "./object-list/object-list.component";
import {S3ObjectViewDialog} from "./object-list/view/object-view.component";

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
        path: 'objects/details/:id',
        component: S3ObjectViewDialog
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class S3RoutingModule {
}
