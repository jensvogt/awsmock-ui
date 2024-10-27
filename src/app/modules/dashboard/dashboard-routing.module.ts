import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard.component';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const KLAERFAELLE_DETAIL_PATH: string = 'detail';

const routes: Routes = [
    {
        path: '',
        title: 'Dashboard',
        component: DashboardComponent
    },
    // {
    //     path: KLAERFAELLE_DETAIL_PATH,
    //     title: 'Einzelansicht Klärfälle',
    //     component: KlaerfaelleDetailComponent
    // }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule {
}
