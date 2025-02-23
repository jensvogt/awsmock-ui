import {Component, OnInit, ViewChild} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader} from "@angular/material/card";
import {ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexGrid, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis, ChartComponent} from "ng-apexcharts";
import {MatOption, MatSelect} from "@angular/material/select";
import {MonitoringService} from "../../../../services/monitoring.service";
import {ChartService, TimeRange} from "../../../../services/chart-service.component";
import {FormsModule} from "@angular/forms";

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    dataLabels: ApexDataLabels;
    grid: ApexGrid;
    stroke: ApexStroke;
    title: ApexTitleSubtitle;
    tooltip: ApexTooltip;
};

@Component({
    selector: 'lambda-invocation-count-chart-component',
    templateUrl: './lambda-function-invocation-count-chart.component.html',
    standalone: true,
    imports: [
        ChartComponent,
        MatCard,
        MatCardHeader,
        MatCardContent,
        MatCardActions,
        MatSelect,
        MatOption,
        FormsModule,
    ],
    providers: [MonitoringService],
    styleUrls: ['./lambda-function-invocation-count-chart.component.scss']
})
export class LambdaFunctionInvocationCountChartComponent implements OnInit {

    public lambdaFunctionCounterChartOptions!: Partial<ChartOptions> | any;

    ranges: TimeRange[] = [];
    selectedTimeRange: string = '';
    @ViewChild("LambdaServiceTimeChart") lambdaServiceTimeChart: ChartComponent | undefined;

    constructor(private monitoringService: MonitoringService, private chartService: ChartService) {
    }

    ngOnInit(): void {
        this.ranges = this.chartService.getRanges();
        this.selectedTimeRange = this.chartService.getDefaultRange();
        this.loadLambdaInvocationCountChart();
    }

    loadLambdaInvocationCountChart() {

        let start = this.chartService.getStartTime(this.selectedTimeRange);
        let end = this.chartService.getEndTime();
        this.monitoringService.getMultiCounters('lambda_invocation_counter', 'function_name', start, end, 5)
            .subscribe((data: any) => {
                if (data) {
                    let functions = Object.getOwnPropertyNames(data);
                    const series: any[] = [];
                    functions.forEach((f) => {
                        series.push({name: f, data: data[f]});
                    })
                    this.lambdaFunctionCounterChartOptions = {
                        series: series,
                        chart: {height: 350, type: "line"},
                        dataLabels: {enabled: false},
                        stroke: {show: true, curve: "smooth", width: 2},
                        tooltip: {shared: true, x: {format: "dd/MM HH:mm:ss"}},
                        title: {text: "Invocation Count", align: "center"},
                        grid: {row: {colors: ["#f3f3f3", "transparent"], opacity: 0.5}, column: {colors: ["#f3f3f3", "transparent"], opacity: 0.5}},
                        xaxis: {type: "datetime", title: {text: "Time"}, labels: {datetimeUTC: false}, min: start.getTime(), max: end.getTime()},
                        yaxis: {min: 0, decimalsInFloat: 0, title: {text: "Invocations"}, labels: {offsetX: 10}}
                    };
                }
            });
    }
}
