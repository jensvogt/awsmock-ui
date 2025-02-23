import {Component, OnInit, ViewChild} from '@angular/core';
import {ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexGrid, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis, ChartComponent} from "ng-apexcharts";
import {MonitoringService} from "../../../../services/monitoring.service";
import {ChartService, TimeRange} from "../../../../services/chart-service.component";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatOption, MatSelect} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

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
    styleUrls: ['./cpu-chart.component.scss'],
    imports: [
        MatCard,
        MatCardHeader,
        MatCardActions,
        MatSelect,
        FormsModule,
        MatOption,
        MatCardContent,
        ChartComponent,
        NgIf
    ],
    standalone: true
})
export class CpuChartComponent implements OnInit {

    public cpuChartOptions!: Partial<ChartOptions> | any;

    ranges: TimeRange[] = [];
    selectedTimeRange: string = '';
    @ViewChild("cpuChart") cpuChart: ChartComponent = new ChartComponent();

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
        this.monitoringService.getMultiCounters('cpu_usage', 'cpu_type', start, end, 5)
            .subscribe((data: any) => {
                if (data) {
                    let types = Object.getOwnPropertyNames(data);
                    const series: any[] = [];
                    types.forEach((t) => {
                        series.push({name: t, data: data[t]});
                    });
                    this.cpuChartOptions = {
                        series: series,
                        chart: {height: 350, type: "line", animations: this.chartService.getAnimation()},
                        dataLabels: {enabled: false},
                        stroke: {show: true, curve: "smooth", width: 2},
                        tooltip: {shared: true, x: {format: "dd/MM HH:mm:ss"}},
                        title: {text: "CPU Usage", align: "center"},
                        grid: {row: {colors: ["#f3f3f3", "transparent"], opacity: 0.5}, column: {colors: ["#f3f3f3", "transparent"], opacity: 0.5}},
                        xaxis: {type: "datetime", title: {text: "Time"}, labels: {datetimeUTC: false}, min: start.getTime(), max: end.getTime()},
                        yaxis: {min: 0, decimalsInFloat: 3, title: {text: "CPU [%]"}, labels: {offsetX: 10}}
                    };
                }
            });
    }
}
