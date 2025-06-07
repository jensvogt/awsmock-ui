import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatIconButton} from "@angular/material/button";
import {Location} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";
import {interval, Subscription} from "rxjs";
import {MonitoringService} from "../../../services/monitoring.service";
import {S3ServiceTimeChartComponent} from "./service-time/s3-service-time-chart.component";

@Component({
    selector: 's3-chart-component',
    templateUrl: './s3-charts.component.html',
    standalone: true,
    imports: [
        MatCard,
        MatCardHeader,
        MatCardContent,
        MatIcon,
        FormsModule,
        MatIconButton,
        S3ServiceTimeChartComponent,
    ],
    providers: [MonitoringService],
    styleUrls: ['./s3-charts.component.scss']
})
export class S3ChartsComponent implements OnInit, OnDestroy {
    lastUpdate: string = '';

    // Auto-update
    updateSubscription: Subscription | undefined;
    @ViewChild(S3ServiceTimeChartComponent) s3ServiceTimeChart: S3ServiceTimeChartComponent | undefined;

    constructor(private readonly location: Location) {
        this.updateSubscription = interval(60000).subscribe(() => {
            this.lastUpdate = new Date().toLocaleTimeString('DE-de');
            this.s3ServiceTimeChart?.loadS3ServiceTimeChart();
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
