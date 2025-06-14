import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatIconButton} from "@angular/material/button";
import {Location} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";
import {interval, Subscription} from "rxjs";
import {MonitoringService} from "../../../services/monitoring.service";
import {SqsServiceTimeChartComponent} from "./service-time/service-time-chart.component";
import {SqsMessageWaitTimeChartComponent} from "./message-wait-time/message-wait-time-chart.component";
import {SqsServiceCountChartComponent} from "./service-count/service-count-chart.component";

@Component({
    selector: 'sqs-charts-component',
    templateUrl: './sqs-charts.component.html',
    standalone: true,
    imports: [
        MatCard,
        MatCardHeader,
        MatCardContent,
        MatIcon,
        FormsModule,
        MatIconButton,
        SqsServiceCountChartComponent,
        SqsMessageWaitTimeChartComponent,
        SqsServiceTimeChartComponent,


    ],
    providers: [MonitoringService],
    styleUrls: ['./sqs-charts.component.scss']
})
export class SqsChartsComponent implements OnInit, OnDestroy {
    lastUpdate: string = '';

    // Auto-update
    updateSubscription: Subscription | undefined;
    @ViewChild(SqsServiceTimeChartComponent) serviceTimeChart: SqsServiceTimeChartComponent | undefined;
    @ViewChild(SqsServiceCountChartComponent) serviceCountChart: SqsServiceCountChartComponent | undefined;
    @ViewChild(SqsMessageWaitTimeChartComponent) messageWaitTimeChart: SqsMessageWaitTimeChartComponent | undefined;

    constructor(private readonly location: Location) {
        this.updateSubscription = interval(60000).subscribe(() => {
            this.refresh();
        });
    }

    ngOnInit(): void {
        this.refresh();
    }

    ngOnDestroy(): void {
        this.updateSubscription?.unsubscribe();
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.lastUpdate = new Date().toLocaleTimeString('DE-de');
        this.serviceTimeChart?.loadServiceTimeChart();
        this.serviceCountChart?.loadServiceCountChart();
        this.messageWaitTimeChart?.loadMessageWaitTimeChart()
    }
}
