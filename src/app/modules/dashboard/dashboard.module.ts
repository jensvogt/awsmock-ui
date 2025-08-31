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
import {CpuChartAwsmockComponent} from "./charts/cpu-chart-awsmock/cpu-chart-awsmock.component";
import {MatSelectModule} from "@angular/material/select";
import {ChartComponent} from "ng-apexcharts";
import {MatOptionModule} from "@angular/material/core";
import {DashboardRoutingModule} from "./dashboard-routing.module";
import {MonitoringService} from "../../services/monitoring.service";
import {ModuleService} from "../../services/module.service";
import {GatewayTimeComponent} from "./charts/gateway-time/gateway-time.component";
import {ThreadsChartComponent} from "./charts/thread-chart/threads-chart.component";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {GatewayRequestsComponent} from "./charts/gateway-requests/gateway-requests.component";
import {FooterComponent} from "../../shared/footer/footer.component";
import {CpuChartTotalComponent} from "./charts/cpu-chart-total/cpu-chart-total.component";
import {MemoryChartTotalComponent} from "./charts/memory-chart-total/memory-chart-total.component";
import {MemoryChartAwsmockComponent} from "./charts/memory-chart-awsmock/memory-chart-awsmock.component";
import {NgxEchartsModule} from "ngx-echarts";
import * as echarts from 'echarts/core';
// import necessary echarts components
import {BarChart, LineChart} from 'echarts/charts';
import {GridComponent} from 'echarts/components';
import {CanvasRenderer} from 'echarts/renderers';

echarts.use([LineChart, BarChart, GridComponent, CanvasRenderer]);

@NgModule({
    declarations: [DashboardComponent],
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
        DashboardRoutingModule,
        CpuChartAwsmockComponent,
        MemoryChartTotalComponent,
        GatewayTimeComponent,
        ThreadsChartComponent,
        StoreModule.forFeature(dashboardFeatureKey, dashboardReducer),
        EffectsModule.forFeature([DashboardEffects]),
        MatGridList,
        MatGridTile,
        GatewayRequestsComponent,
        FooterComponent,
        CpuChartTotalComponent,
        MemoryChartTotalComponent,
        MemoryChartTotalComponent,
        MemoryChartTotalComponent,
        MemoryChartTotalComponent,
        MemoryChartAwsmockComponent,
        NgxEchartsModule.forRoot({echarts})
    ],
    exports: [DashboardComponent],
    providers: [MonitoringService, ModuleService],
})
export class DashboardModule {
}
