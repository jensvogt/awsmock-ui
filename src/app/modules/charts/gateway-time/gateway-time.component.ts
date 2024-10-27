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
    selector: 'gateway-time-chart-component',
    templateUrl: './gateway-time.component.html',
    providers: [MonitoringService, DashboardModule],
    styleUrls: ['./gateway-time.component.scss']
})
export class GatewayTimeComponent implements OnInit {

    public httpTimeChartOptions: Partial<ChartOptions> | undefined;

    ranges: TimeRange[] = [];
    selectedTimeRange: string = '';
    @ViewChild("httpTimerChart") httpTimerChart: ChartComponent | undefined;

    constructor(private monitoringService: MonitoringService, private chartService: ChartService) {
    }

    ngOnInit(): void {
        this.ranges = this.chartService.getRanges();
        this.selectedTimeRange = this.chartService.getDefaultRange();
        this.loadHttpTimeChart();
    }

    loadHttpTimeChart() {

        let start = this.chartService.getStartTime(this.selectedTimeRange);
        let end = this.chartService.getEndTime();
        this.monitoringService.getCounters('gateway_http_timer', start, end, 5)
            .subscribe((data: any) => {
                if (data) {
                    this.httpTimeChartOptions = {
                        series: [{name: "HTTP Response Time", data: data.counters}],
                        chart: {height: 350, type: "line", animations: this.chartService.getAnimation()},
                        dataLabels: {enabled: false},
                        stroke: {show: true, curve: "smooth", width: 2},
                        title: {text: "HTTP Response Time", align: "center"},
                        tooltip: {x: {format: "dd/MM HH:mm:ss"}},
                        grid: {row: {colors: ["#f3f3f3", "transparent"], opacity: 0.5}, column: {colors: ["#f3f3f3", "transparent"], opacity: 0.5}},
                        xaxis: {type: "datetime", title: {text: "Time"}, labels: {datetimeUTC: false}, min: start.getTime(), max: end.getTime()},
                        yaxis: {
                            min: 0, forceNiceScale: true, decimalsInFloat: 0, title: {text: "HTTP Response Time [ms]"}, labels: {
                                formatter: function (val) {
                                    return val.toFixed(0)
                                },
                                offsetX: 10
                            }
                        }
                    };
                }
            });
    }
}
