import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatIconButton} from "@angular/material/button";
import {Location} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";
import {interval, Subscription} from "rxjs";
import {MonitoringService} from "../../../services/monitoring.service";
import {CognitoServiceTimeChartComponent} from "./service-time/cognito-service-time-chart.component";
import {CognitoUserPoolsCounterChartComponent} from "./user-pools-counter/cognito-user-pools-counter-chart.component";
import {CognitoUsersCounterChartComponent} from "./users-counter/cognito-users-counter-chart.component";
import {SqsServiceCountChartComponent} from "./service-count/cognito-service-count-chart.component";

@Component({
    selector: 's3-chart-component',
    templateUrl: './cognito-charts.component.html',
    standalone: true,
    imports: [
        MatCard,
        MatCardHeader,
        MatCardContent,
        MatIcon,
        FormsModule,
        MatIconButton,
        CognitoServiceTimeChartComponent,
        CognitoUserPoolsCounterChartComponent,
        CognitoUsersCounterChartComponent,
        SqsServiceCountChartComponent,

    ],
    providers: [MonitoringService],
    styleUrls: ['./cognito-charts.component.scss']
})
export class CognitoChartsComponent implements OnInit, OnDestroy {
    lastUpdate: string = '';

    // Auto-update
    updateSubscription: Subscription | undefined;
    @ViewChild(CognitoServiceTimeChartComponent) cognitoServiceTimeChart: CognitoServiceTimeChartComponent | undefined;

    constructor(private readonly location: Location) {
        this.updateSubscription = interval(60000).subscribe(() => {
            this.lastUpdate = new Date().toLocaleTimeString('DE-de');
            this.cognitoServiceTimeChart?.loadCognitoServiceTimeChart();
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
        this.cognitoServiceTimeChart?.loadCognitoServiceTimeChart();
    }
}
