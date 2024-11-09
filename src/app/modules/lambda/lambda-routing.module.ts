import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LambdaFunctionListComponent} from "./function-list/function-list.component";

const routes: Routes = [
    {
        path: '',
        title: 'LambdaFunctionList',
        component: LambdaFunctionListComponent
    },
    // {
    //     path: 'details/:functionName',
    //     component: S3BucketDetailComponent
    // },
    // {
    //     path: 'objects/:bucketName',
    //     component: S3ObjectListComponent
    // },
    // {
    //     path: 'objects/details/:id',
    //     component: S3ObjectViewDialog
    // }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LambdaRoutingModule {
}
