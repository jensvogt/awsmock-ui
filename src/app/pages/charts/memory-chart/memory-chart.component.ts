import {Component, OnInit, ViewChild} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader} from "@angular/material/card";
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
import {MatOption, MatSelect} from "@angular/material/select";
import {AwsMockMonitoringService} from "../../../services/monitoring.service";
import {FormsModule} from "@angular/forms";
import {ChartService, TimeRange} from "../../../services/chart-service.component";

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
    selector: 'memory-chart-component',
    templateUrl: './memory-chart.component.html',
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
    providers: [AwsMockMonitoringService],
    styleUrls: ['./memory-chart.component.scss']
})
export class MemoryChartComponent implements OnInit {

    public memChartOptions: Partial<ChartOptions> | undefined;

    ranges: TimeRange[] = [];
    selectedTimeRange: string = '';
    @ViewChild("memoryChart") memoryChart: ChartComponent | undefined;

    constructor(private monitoringService: AwsMockMonitoringService, private chartService: ChartService) {
    }

    ngOnInit(): void {
        this.ranges = this.chartService.getRanges();
        this.selectedTimeRange = this.chartService.getDefaultRange();
        this.loadMemoryChart();
    }

    loadMemoryChart() {

        let start = this.chartService.getStartTime(this.selectedTimeRange);
        let end = this.chartService.getEndTime();
        this.monitoringService.getCounters('real_memory_used', start, end, 5)
            .subscribe((data: any) => {
                if (data) {
                    this.memChartOptions = {
                        series: [{name: "memoryChart", data: data.counters}],
                        chart: {height: 350, type: "line", animations: this.chartService.getAnimation()},
                        dataLabels: {enabled: false},
                        stroke: {show: true, curve: "smooth", width: 2},
                        title: {text: "Memory", align: "center"},
                        tooltip: {x: {format: "dd/MM HH:mm:ss"}},
                        grid: {row: {colors: ["#f3f3f3", "transparent"], opacity: 0.5}, column: {colors: ["#f3f3f3", "transparent"], opacity: 0.5}},
                        xaxis: {type: "datetime", title: {text: "Time"}, labels: {datetimeUTC: false}, min: start.getTime(), max: end.getTime()},
                        yaxis: {
                            min: 0, forceNiceScale: true, decimalsInFloat: 0, title: {text: "Memory [MB]"}, labels: {
                                formatter: function (val) {
                                    val /= 1024;
                                    return val.toFixed(0);
                                },
                                offsetX: 10
                            }
                        }
                    };
                }
            });
    }
}
