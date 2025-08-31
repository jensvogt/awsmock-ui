import {Component, OnInit, ViewChild} from '@angular/core';
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
    selector: 'sqs-message-wait-time-chart-component',
    templateUrl: './message-wait-time-chart.component.html',
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
    styleUrls: ['./message-wait-time-chart.component.scss']
})
export class SqsMessageWaitTimeChartComponent implements OnInit {

    public serviceTimeChartOptions!: Partial<ChartOptions> | any;

    ranges: TimeRange[] = [];
    selectedTimeRange: string = '';
    topx: Topx[] = [];
    selectedTopx: number = -1;
    @ViewChild(`sqs-message-wait-time-chart-component`) waitTimeChart: ChartComponent | undefined;

    constructor(private readonly monitoringService: MonitoringService, private readonly chartService: ChartService) {
    }

    ngOnInit(): void {
        this.ranges = this.chartService.getRanges();
        this.selectedTimeRange = this.chartService.getDefaultRange();
        this.topx = this.chartService.getTopxs();
        this.selectedTopx = this.chartService.getDefaultTopx();
        this.loadMessageWaitTimeChart();
    }

    loadMessageWaitTimeChart() {

        let start = this.chartService.getStartTime(this.selectedTimeRange);
        let end = this.chartService.getEndTime();
        this.monitoringService.getMultiCounters('sqs_message_wait_time', 'queue', start, end, 5, this.selectedTopx)
            .subscribe((data: any) => {
                if (data) {
                    let functions = Object.getOwnPropertyNames(data);
                    const series: any[] = [];
                    functions.forEach((f) => {
                        series.push({name: f, data: data[f]});
                    });
                    for (const serie of series) {
                        for (const element of serie.data) {
                            element[1] /= 3600000.0;
                        }
                    }
                    this.serviceTimeChartOptions = {
                        series: series,
                        chart: {height: 350, type: "line"},
                        dataLabels: {enabled: false},
                        legend: {showForSingleSeries: true},
                        stroke: {show: true, curve: "smooth", width: 2},
                        tooltip: {shared: true, x: {format: "dd/MM HH:mm:ss"}},
                        title: {text: "SQS Wait Time [s]", align: "center"},
                        grid: {row: {colors: ["#f3f3f3", "transparent"], opacity: 0.5}, column: {colors: ["#f3f3f3", "transparent"], opacity: 0.5}},
                        xaxis: {type: "datetime", title: {text: "Time"}, labels: {datetimeUTC: false}, min: start.getTime(), max: end.getTime()},
                        yaxis: {min: 0, decimalsInFloat: 3, title: {text: "Time [h]"}, labels: {offsetX: 10}}
                    };
                }
            });
    }
}
