import {NgModule} from '@angular/core';
import {AsyncPipe, DatePipe, NgIf} from '@angular/common';

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {MatCardModule} from "@angular/material/card";
import {MatTableModule} from "@angular/material/table";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {RouterLink} from "@angular/router";
import {MatListModule} from "@angular/material/list";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {DashboardComponent} from "./dashboard.component";
import {dashboardFeatureKey, dashboardReducer} from "./state/dashboard.reducer";
import {DashboardEffects} from "./state/dashboard.effects";
import {MemoryChartComponent} from "../charts/memory-chart/memory-chart.component";
import {CpuChartComponent} from "../charts/cpu-chart/cpu-chart.component";
import {GatewayTimeComponent} from "../charts/gateway-time/gateway-time.component";
import {ThreadsChartComponent} from "../charts/thread-chart/threads-chart.component";
import {MatSelectModule} from "@angular/material/select";
import {ChartComponent} from "ng-apexcharts";
import {MonitoringService} from "../../services/monitoring.service";
import {ModuleService} from "../../services/module.service";
import {MatOptionModule} from "@angular/material/core";

@NgModule({
    declarations: [DashboardComponent, ThreadsChartComponent, GatewayTimeComponent, MemoryChartComponent, CpuChartComponent],
    imports: [
        MatCardModule,
        MatTableModule,
        MatIconModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatListModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        NgIf,
        MatIcon,
        RouterLink,
        DatePipe,
        ReactiveFormsModule,
        FormsModule,
        AsyncPipe,
        ChartComponent,
        StoreModule.forFeature(dashboardFeatureKey, dashboardReducer),
        EffectsModule.forFeature([DashboardEffects])
    ],
    exports: [DashboardComponent, ThreadsChartComponent, GatewayTimeComponent, MemoryChartComponent, CpuChartComponent],
    providers: [MonitoringService, ModuleService],
})
export class DashboardModule {
}
