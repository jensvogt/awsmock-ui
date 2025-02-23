import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatIconButton} from "@angular/material/button";
import {Location} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";
import {interval, Subscription} from "rxjs";
import {MonitoringService} from "../../../services/monitoring.service";
import {LambdaServiceTimeChartComponent} from "./service-time/lambda-service-time-chart.component";
import {MatAccordion, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle} from "@angular/material/expansion";
import {LambdaFunctionCounterChartComponent} from "./function-counter/lambda-function-counter-chart.component";
import {LambdaFunctionInvocationCountChartComponent} from "./function-invocation-count/lambda-function-invocation-count-chart.component";
import {LambdaFunctionInvocationTimeChartComponent} from "./function-invocation-time/lambda-function-invocation-time-chart.component";

@Component({
    selector: 'lambda-chart-component',
    templateUrl: './lambda-charts.component.html',
    standalone: true,
    imports: [
        MatCard,
        MatCardHeader,
        MatCardContent,
        MatIcon,
        FormsModule,
        MatIconButton,
        MatAccordion,
        MatExpansionPanel,
        MatExpansionPanelTitle,
        MatExpansionPanelDescription,
        MatExpansionPanelHeader,
        LambdaFunctionCounterChartComponent,
        LambdaServiceTimeChartComponent,
        LambdaFunctionInvocationTimeChartComponent,
        LambdaFunctionInvocationCountChartComponent,
    ],
    providers: [MonitoringService],
    styleUrls: ['./lambda-charts.component.scss']
})
export class LambdaChartsComponent implements OnInit, OnDestroy {
    lastUpdate: string = '';

    // Auto-update
    updateSubscription: Subscription | undefined;
    @ViewChild(LambdaServiceTimeChartComponent) lambdaServiceTimeChart: LambdaServiceTimeChartComponent | undefined;
    @ViewChild(LambdaFunctionCounterChartComponent) lambdaCounterTimeChart: LambdaFunctionCounterChartComponent | undefined;
    @ViewChild(LambdaFunctionInvocationCountChartComponent) lambdaInvocationCountChart: LambdaFunctionInvocationCountChartComponent | undefined;
    @ViewChild(LambdaFunctionInvocationTimeChartComponent) lambdaInvocationTimeChart: LambdaFunctionInvocationTimeChartComponent | undefined;

    constructor(private location: Location) {
        this.updateSubscription = interval(60000).subscribe(() => {
            this.refresh();
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
        this.lastUpdate = new Date().toLocaleTimeString('DE-de');
        this.lambdaServiceTimeChart?.loadLambdaServiceTimeChart();
        this.lambdaCounterTimeChart?.loadLambdaFunctionCounterChart();
        this.lambdaInvocationCountChart?.loadLambdaInvocationCountChart();
        this.lambdaInvocationTimeChart?.loadLambdaInvocationTimeChart();
    }
}
