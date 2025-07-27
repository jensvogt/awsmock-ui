import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatIconButton} from "@angular/material/button";
import {Location} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";
import {interval, Subscription} from "rxjs";
import {MonitoringService} from "../../../services/monitoring.service";
import {ApplicationServiceTimeChartComponent} from "./service-time/application-service-time-chart.component";
import {ApplicationCounterChartComponent} from "./application-counter/application-counter-chart.component";
import {ApplicationServiceCountChartComponent} from "./service-count/application-service-count-chart.component";
import {ApplicationCpuChartComponent} from "./application-cpu/application-cpu-chart.component";
import {FooterComponent} from "../../../shared/footer/footer.component";
import {ApplicationMemoryChartComponent} from "./application-memory/application-memory-chart.component";

@Component({
    selector: 'application-chart-component',
    templateUrl: './application-charts.component.html',
    standalone: true,
    imports: [
        MatCard,
        MatCardHeader,
        MatCardContent,
        MatIcon,
        FormsModule,
        MatIconButton,
        ApplicationServiceTimeChartComponent,
        ApplicationCounterChartComponent,
        ApplicationServiceCountChartComponent,
        ApplicationCpuChartComponent,
        FooterComponent,
        ApplicationMemoryChartComponent
    ],
    providers: [MonitoringService],
    styleUrls: ['./application-charts.component.scss']
})
export class ApplicationChartsComponent implements OnInit, OnDestroy {

    // Last update
    lastUpdate: Date = new Date();

    // Auto-update
    updateSubscription: Subscription | undefined;
    @ViewChild(ApplicationServiceTimeChartComponent) applicationServiceTimeChart: ApplicationServiceTimeChartComponent | undefined;
    @ViewChild(ApplicationServiceCountChartComponent) applicationServiceCountChart: ApplicationServiceCountChartComponent | undefined;
    @ViewChild(ApplicationCounterChartComponent) applicationCountChart: ApplicationCounterChartComponent | undefined;
    @ViewChild(ApplicationCpuChartComponent) applicationCpuChart: ApplicationCpuChartComponent | undefined;
    @ViewChild(ApplicationMemoryChartComponent) applicationMemoryChart: ApplicationMemoryChartComponent | undefined;

    constructor(private readonly location: Location) {
        this.updateSubscription = interval(60000).subscribe(() => {
            this.refresh();
        });
    }

    ngOnInit(): void {
        this.lastUpdate = new Date();
    }

    ngOnDestroy(): void {
        this.updateSubscription?.unsubscribe();
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.applicationServiceTimeChart?.loadApplicationServiceTimeChart();
        this.applicationServiceCountChart?.loadServiceCountChart();
        this.applicationCountChart?.loadApplicationCountChart();
        this.applicationCpuChart?.loadApplicationCpuChart();
        this.applicationMemoryChart?.loadApplicationMemoryChart();
        this.lastUpdate = new Date();
    }
}
