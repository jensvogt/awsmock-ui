import {Component, OnInit} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader} from "@angular/material/card";
import {ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexGrid, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis, ChartComponent} from "ng-apexcharts";
import {MatOption, MatSelect} from "@angular/material/select";
import {MonitoringService} from "../../../../services/monitoring.service";
import {ChartService, TimeRange, Topx} from "../../../../services/chart-service.component";
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
    selector: 's3-service-time-chart-component',
    templateUrl: './s3-service-time-chart.component.html',
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
    styleUrls: ['./s3-service-time-chart.component.scss']
})
export class S3ServiceTimeChartComponent implements OnInit {

    public s3ServiceTimeChartOptions!: Partial<ChartOptions> | any;

    ranges: TimeRange[] = [];
    selectedTimeRange: string = '';
    topx: Topx[] = [];
    selectedTopx: number = -1;

    constructor(private readonly monitoringService: MonitoringService, private readonly chartService: ChartService) {
    }

    ngOnInit(): void {
        this.ranges = this.chartService.getRanges();
        this.selectedTimeRange = this.chartService.getDefaultRange();
        this.topx = this.chartService.getTopxs();
        this.selectedTopx = this.chartService.getDefaultTopx();
        this.loadS3ServiceTimeChart();
    }

    loadS3ServiceTimeChart() {

        let start = this.chartService.getStartTime(this.selectedTimeRange);
        let end = this.chartService.getEndTime();
        this.monitoringService.getMultiCounters('s3_service_timer', 'action', start, end, 5, this.selectedTopx)
            .subscribe((data: any) => {
                if (data) {
                    let functions = Object.getOwnPropertyNames(data);
                    const series: any[] = [];
                    functions.forEach((f) => {
                        series.push({name: f, data: data[f]});
                    });
                    this.s3ServiceTimeChartOptions = {
                        series: series,
                        chart: {height: 350, type: "line"},
                        dataLabels: {enabled: false},
                        legend: {showForSingleSeries: true},
                        stroke: {show: true, curve: "smooth", width: 2},
                        tooltip: {shared: true, x: {format: "dd/MM HH:mm:ss"}},
                        title: {text: "S3 Service Time [s]", align: "center"},
                        grid: {row: {colors: ["#f3f3f3", "transparent"], opacity: 0.5}, column: {colors: ["#f3f3f3", "transparent"], opacity: 0.5}},
                        xaxis: {type: "datetime", title: {text: "Time"}, labels: {datetimeUTC: false}, min: start.getTime(), max: end.getTime()},
                        yaxis: {min: 0, decimalsInFloat: 0, title: {text: "Time [ms]"}, labels: {offsetX: 10}}
                    };
                }
            });
    }
}
