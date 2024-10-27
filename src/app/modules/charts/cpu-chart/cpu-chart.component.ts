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
import {MonitoringService} from "../../../services/monitoring.service";
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
    selector: 'cpu-chart-component',
    templateUrl: './cpu-chart.component.html',
    providers: [MonitoringService, DashboardModule],
    styleUrls: ['./cpu-chart.component.scss']
})
export class CpuChartComponent implements OnInit {

    public cpuChartOptions: Partial<ChartOptions> | undefined;

    ranges: TimeRange[] = [];
    selectedTimeRange: string = '';
    @ViewChild("cpuChart") cpuChart: ChartComponent | undefined;

    constructor(private monitoringService: MonitoringService, private chartService: ChartService) {
    }

    ngOnInit(): void {
        this.ranges = this.chartService.getRanges();
        this.selectedTimeRange = this.chartService.getDefaultRange();
        this.loadCpuChart();
    }

    loadCpuChart() {

        let start = this.chartService.getStartTime(this.selectedTimeRange);
        let end = this.chartService.getEndTime();
        this.monitoringService.getCounters('total_cpu', start, end, 5)
            .subscribe((data: any) => {
                if (data) {
                    this.cpuChartOptions = {
                        series: [{name: "CPU Usage", data: data.counters}],
                        chart: {height: 350, type: "line", animations: this.chartService.getAnimation()},
                        dataLabels: {enabled: false},
                        stroke: {show: true, curve: "smooth", width: 2},
                        tooltip: {shared: true, x: {format: "dd/MM HH:mm:ss"}},
                        title: {text: "CPU", align: "center"},
                        grid: {row: {colors: ["#f3f3f3", "transparent"], opacity: 0.5}, column: {colors: ["#f3f3f3", "transparent"], opacity: 0.5}},
                        xaxis: {type: "datetime", title: {text: "Time"}, labels: {datetimeUTC: false}, min: start.getTime(), max: end.getTime()},
                        yaxis: {min: 0, decimalsInFloat: 3, title: {text: "CPU [%]"}, labels: {offsetX: 10}}
                    };
                }
            });
    }
}
