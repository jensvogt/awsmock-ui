import {Component, OnInit} from '@angular/core';
import {ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexGrid, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis, ChartComponent} from "ng-apexcharts";
import {MonitoringService} from "../../../../services/monitoring.service";
import {ChartService, TimeRange} from "../../../../services/chart-service.component";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatOption, MatSelect} from "@angular/material/select";
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
    selector: 'gateway-requests-chart-component',
    templateUrl: './gateway-requests.component.html',
    styleUrls: ['./gateway-requests.component.scss'],
    imports: [
        MatCardHeader,
        MatCard,
        MatCardActions,
        MatSelect,
        FormsModule,
        MatOption,
        MatCardContent,
        ChartComponent
    ],
    standalone: true
})
export class GatewayRequestsComponent implements OnInit {

    public httpTimeChartOptions!: Partial<ChartOptions> | any;

    ranges: TimeRange[] = [];
    selectedTimeRange: string = '';

    constructor(private readonly monitoringService: MonitoringService, private readonly chartService: ChartService) {
    }

    ngOnInit(): void {
        this.ranges = this.chartService.getRanges();
        this.selectedTimeRange = this.chartService.getDefaultRange();
        this.loadHttpRequestsChart();
    }

    loadHttpRequestsChart() {

        let start = this.chartService.getStartTime(this.selectedTimeRange);
        let end = this.chartService.getEndTime();
        this.monitoringService.getMultiCounters('gateway_http_counter', 'method', start, end, 5)
            .subscribe((data: any) => {
                if (data) {
                    let types = Object.getOwnPropertyNames(data);
                    const series: any[] = [];
                    types.forEach((t) => {
                        series.push({name: t, data: data[t]});
                    });
                    this.httpTimeChartOptions = {
                        series: series,
                        chart: {height: 350, type: "line", animations: this.chartService.getAnimation()},
                        dataLabels: {enabled: false},
                        stroke: {show: true, curve: "smooth", width: 2},
                        title: {text: "HTTP Requests", align: "center"},
                        tooltip: {x: {format: "dd/MM HH:mm:ss"}},
                        grid: {row: {colors: ["#f3f3f3", "transparent"], opacity: 0.5}, column: {colors: ["#f3f3f3", "transparent"], opacity: 0.5}},
                        xaxis: {type: "datetime", title: {text: "Time"}, labels: {datetimeUTC: false}, min: start.getTime(), max: end.getTime()},
                        yaxis: {min: 0, forceNiceScale: true, decimalsInFloat: 3, title: {text: "HTTP Requests/s"}, labels: {offsetX: 10}}
                    };
                }
            });
    }
}
