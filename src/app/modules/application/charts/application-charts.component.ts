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
import {MatDialogTitle} from "@angular/material/dialog";
import {CdkDrag, CdkDragHandle} from "@angular/cdk/drag-drop";

@Component({
    selector: 's3-chart-component',
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
        MatDialogTitle,
        CdkDrag,
        CdkDragHandle,
    ],
    providers: [MonitoringService],
    styleUrls: ['./application-charts.component.scss']
})
export class ApplicationChartsComponent implements OnInit, OnDestroy {
    lastUpdate: string = '';

    // Auto-update
    updateSubscription: Subscription | undefined;
    @ViewChild(ApplicationServiceTimeChartComponent) applicationServiceTimeChart: ApplicationServiceTimeChartComponent | undefined;

    constructor(private readonly location: Location) {
        this.updateSubscription = interval(60000).subscribe(() => {
            this.lastUpdate = new Date().toLocaleTimeString('DE-de');
            this.applicationServiceTimeChart?.loadApplicationServiceTimeChart();
        });
    }

    ngOnInit(): void {
        this.lastUpdate = new Date().toLocaleTimeString('DE-de');
    }

    ngOnDestroy(): void {
        this.updateSubscription?.unsubscribe();
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.applicationServiceTimeChart?.loadApplicationServiceTimeChart();
    }
}
