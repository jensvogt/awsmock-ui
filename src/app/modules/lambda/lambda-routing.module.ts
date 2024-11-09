import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LambdaFunctionListComponent} from "./function-list/function-list.component";
import {LambdaFunctionDetailsComponent} from "./function-details/function-detail.component";

const routes: Routes = [
    {
        path: '',
        title: 'LambdaFunctionList',
        component: LambdaFunctionListComponent
    },
    {
        path: 'details/:functionName',
        title: 'LambdaFunctionDetails',
        component: LambdaFunctionDetailsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LambdaRoutingModule {
}
