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
    selector: 'threads-chart-component',
    templateUrl: './threads-chart.component.html',
    styleUrls: ['./threads-chart.component.scss'],
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
export class ThreadsChartComponent implements OnInit {

    public threadsChartOptions!: Partial<ChartOptions> | any;

    ranges: TimeRange[] = [];
    selectedTimeRange: string = '';

    constructor(private readonly monitoringService: MonitoringService, private readonly chartService: ChartService) {
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
                        yaxis: {min: 0, decimalsInFloat: 0, title: {text: "Threads"}, labels: {offsetX: 10}}
                    };
                }
            });
    }
}
