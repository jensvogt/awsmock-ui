import {Component, OnInit, ViewChild} from '@angular/core';
import {
    ApexAxisChartSeries,
    ApexChart,
    ApexDataLabels,
    ApexGrid,
    ApexStroke,
    ApexTitleSubtitle,
    ApexTooltip,
    ApexXAxis,
    ApexYAxis,
    ChartComponent
} from "ng-apexcharts";
import {AwsMockMonitoringService} from "../../../services/monitoring.service";
import {ChartService, TimeRange} from "../../../services/chart-service.component";
import {DashboardModule} from "../../dashboard/dashboard.module";

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
    selector: 'threads-chart-component',
    templateUrl: './threads-chart.component.html',
    providers: [AwsMockMonitoringService, DashboardModule],
    styleUrls: ['./threads-chart.component.scss']
})
export class ThreadsChartComponent implements OnInit {

    public threadsChartOptions: Partial<ChartOptions> | undefined;

    ranges: TimeRange[] = [];
    selectedTimeRange: string = '';
    @ViewChild("threadsChart") threadsChart: ChartComponent | undefined;

    constructor(private monitoringService: AwsMockMonitoringService, private chartService: ChartService) {
    }

    ngOnInit(): void {
        this.ranges = this.chartService.getRanges();
        this.selectedTimeRange = this.chartService.getDefaultRange();
        this.loadThreadChart();
    }

    loadThreadChart() {

        let start = this.chartService.getStartTime(this.selectedTimeRange);
        let end = this.chartService.getEndTime();
        this.monitoringService.getCounters('total_threads', start, end, 5)
            .subscribe((data: any) => {
                if (data) {
                    this.threadsChartOptions = {
                        series: [{name: "Threads", data: data.counters}],
                        chart: {height: 350, type: "line", animations: this.chartService.getAnimation()},
                        dataLabels: {enabled: false},
                        stroke: {show: true, curve: "smooth", width: 2},
                        tooltip: {shared: true, x: {format: "dd/MM HH:mm:ss"}},
                        title: {text: "Threads", align: "center"},
                        grid: {row: {colors: ["#f3f3f3", "transparent"], opacity: 0.5}, column: {colors: ["#f3f3f3", "transparent"], opacity: 0.5}},
                        xaxis: {type: "datetime", title: {text: "Time"}, labels: {datetimeUTC: false}, min: start.getTime(), max: end.getTime()},
                        yaxis: {min: 0, decimalsInFloat: 0, title: {text: "CPU [%]"}, labels: {offsetX: 10}}
                    };
                }
            });
    }
}
