import {NgModule} from '@angular/core';
import {AsyncPipe, DatePipe, NgIf} from '@angular/common';

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle
} from "@angular/material/card";
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatNoDataRow,
    MatRow,
    MatRowDef,
    MatTable
} from "@angular/material/table";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {MatIconButton} from "@angular/material/button";
import {MatPaginator} from "@angular/material/paginator";
import {MatTooltip} from "@angular/material/tooltip";
import {RouterLink} from "@angular/router";
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {DashboardComponent} from "./dashboard.component";
import {dashboardFeatureKey, dashboardReducer} from "./state/dashboard.reducer";
import {DashboardEffects} from "./state/dashboard.effects";
import {MemoryChartComponent} from "../charts/memory-chart/memory-chart.component";
import {CpuChartComponent} from "../charts/cpu-chart/cpu-chart.component";
import {GatewayTimeComponent} from "../charts/gatewas-time/gateway-time.component";
import {ThreadsChartComponent} from "../charts/thread-chart/threads-chart.component";
import {MatOption, MatSelect} from "@angular/material/select";
import {ChartComponent} from "ng-apexcharts";

@NgModule({
    declarations: [DashboardComponent, ThreadsChartComponent, GatewayTimeComponent, MemoryChartComponent, CpuChartComponent],
    imports: [
        MatCard,
        MatCardHeader,
        MatCardContent,
        MatCardActions,
        MatCardTitle,
        MatCardSubtitle,
        MatTable,
        MatHeaderCellDef,
        MatCellDef,
        MatColumnDef,
        MatIcon,
        MatIconModule,
        MatHeaderCell,
        MatCell,
        MatHeaderRowDef,
        MatHeaderRow,
        MatSortHeader,
        MatRowDef,
        MatNoDataRow,
        MatIconButton,
        MatRow,
        MatPaginator,
        MatSort,
        MatTooltip,
        RouterLink,
        MatListItem,
        MatNavList,
        DatePipe,
        MatFormField,
        MatInput,
        MatLabel,
        MatSuffix,
        NgIf,
        ReactiveFormsModule,
        FormsModule,
        AsyncPipe,
        MatSelect,
        MatOption,
        ChartComponent,
        StoreModule.forFeature(dashboardFeatureKey, dashboardReducer),
        EffectsModule.forFeature([DashboardEffects]),
    ],
    exports: [DashboardComponent, ThreadsChartComponent, GatewayTimeComponent, MemoryChartComponent, CpuChartComponent]
})
export class DashboardModule {}
