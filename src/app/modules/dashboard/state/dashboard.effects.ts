import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {dashboardActions} from "./dashboard.actions";
import {catchError, mergeMap, of} from "rxjs";
import {map} from "rxjs/operators";
import {MonitoringService} from "../../../services/monitoring.service";

@Injectable()
export class DashboardEffects {

    sortColumns: SortColumn[] = [];

    loadCpuChart$ = createEffect(() => this.actions$.pipe(
        ofType(dashboardActions.loadCpuChart),
        mergeMap(() =>
            this.monitoringService.getCounters(
                dashboardActions.loadCpuChart.arguments.name,
                dashboardActions.loadCpuChart.arguments.start,
                dashboardActions.loadCpuChart.arguments.end,
                dashboardActions.loadCpuChart.arguments.step)
                .pipe(map((counters: any) => dashboardActions.loadCpuChartSuccess(counters)),
                    catchError((error) =>
                        of(dashboardActions.loadCpuChartFailure({error: error.message}))
                    )
                )
        ),
    ));

    constructor(private actions$: Actions, private monitoringService: MonitoringService) {
    }
}