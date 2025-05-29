import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatIconButton} from "@angular/material/button";
import {Location} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";
import {interval, Subscription} from "rxjs";
import {MonitoringService} from "../../../services/monitoring.service";
import {SqsServiceTimeChartComponent} from "../../sqs/charts/service-time/service-time-chart.component";
import {SnsServiceTimeChartComponent} from "./service-time/service-time-chart.component";
import {SnsMessageCountChartComponent} from "./message-count-time/message-count-chart.component";

@Component({
    selector: 'sns-charts-component',
    templateUrl: './sns-charts.component.html',
    standalone: true,
    imports: [
        MatCard,
        MatCardHeader,
        MatCardContent,
        MatIcon,
        FormsModule,
        MatIconButton,
        SnsServiceTimeChartComponent,
        SnsMessageCountChartComponent,

    ],
    providers: [MonitoringService],
    styleUrls: ['./sns-charts.component.scss']
})
export class SnsChartsComponent implements OnInit, OnDestroy {

    // Last update
    lastUpdate: string = '';

    // Auto-update
    updateSubscription: Subscription | undefined;
    @ViewChild(SqsServiceTimeChartComponent) serviceTimeChart: SqsServiceTimeChartComponent | undefined;

    constructor(private location: Location) {
        this.updateSubscription = interval(60000).subscribe(() => {
            this.lastUpdate = new Date().toLocaleTimeString('DE-de');
            this.serviceTimeChart?.loadServiceTimeChart();
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
    }
}
