import {Component, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardImage, MatCardTitle} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {registerLocaleData} from "@angular/common";
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
import localeDECH from '@angular/common/locales/de';
import {AwsMockExportService} from "../../../services/export.service";
import {FormsModule} from "@angular/forms";

interface Range {
    value: string;
    viewValue: string;
}

registerLocaleData(localeDECH);

const Ranges: Array<Range> = [
    {value: 'Today', viewValue: 'Today'},
    {value: 'LastHour', viewValue: 'Last Hour'},
    {value: 'Last3Hours', viewValue: 'Last 3 Hours'},
    {value: 'Last6Hours', viewValue: 'Last 6 Hours'},
    {value: 'Last12Hours', viewValue: 'Last 12 Hours'},
];

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
    standalone: true,
    imports: [
        ChartComponent,
        MatCard,
        MatCardHeader,
        MatCardContent,
        MatCardActions,
        MatCardImage,
        MatCardTitle,
        MatButton,
        MatSelect,
        MatOption,
        FormsModule,
    ],
    providers: [AwsMockMonitoringService, AwsMockExportService, {provide: LOCALE_ID, useValue: 'de-CH'}],
    styleUrls: ['./cpu-chart.component.scss']
})
export class CpuChartComponent implements OnInit {

    public cpuChartOptions: Partial<ChartOptions> | undefined;

    ranges: Range[] = Ranges;
    selectedCpuChoice: string = this.ranges[0].value;
    @ViewChild("cpuChart") cpuChart: ChartComponent | undefined;

    constructor(private monitoringService: AwsMockMonitoringService) {
    }

    ngOnInit(): void {
        this.loadCpuChart();
    }

    loadCpuChart() {

        let start = this.getStartTime(this.selectedCpuChoice);
        let end = this.getEndTime();
        this.monitoringService.getCounters('total_cpu', start, end, 5)
            .subscribe((data: any) => {
                if (data) {
                    this.cpuChartOptions = {
                        series: [{name: "CPU Usage", data: data.counters}],
                        chart: {height: 350, type: "line"},
                        dataLabels: {enabled: false},
                        stroke: {show: true, curve: "smooth", width: 2},
                        tooltip: {shared: true, x: {format: "dd/MM HH:mm:ss"}},
                        title: {text: "CPU", align: "center"},
                        grid: {row: {colors: ["#f3f3f3", "transparent"], opacity: 0.5}, column: {colors: ["#f3f3f3", "transparent"], opacity: 0.5}},
                        xaxis: {type: "datetime", title: {text: "Time"}, labels: {datetimeUTC: false}, min: start.getTime(), max: end.getTime()},
                        yaxis: {min: 0, decimalsInFloat: 3, title: {text: "CPU [%]"}}
                    };
                }
            });
    }

    getStartTime(choice: string): Date {
        let startTime = new Date();
        if (choice == 'Today') {
            startTime.setHours(0, 0, 0, 0);
        } else if (choice == 'LastHour') {
            startTime.setHours(startTime.getHours() - 1);
        } else if (choice == 'Last3Hours') {
            startTime.setHours(startTime.getHours() - 3);
        } else if (choice == 'Last6Hours') {
            startTime.setHours(startTime.getHours() - 6);
        } else if (choice == 'Last12Hours') {
            startTime.setHours(startTime.getHours() - 12);
        }
        startTime.setSeconds(0);
        startTime.setMilliseconds(0);
        return startTime;
    }

    getEndTime(): Date {
        let endTime = new Date();
        endTime.setSeconds(0);
        endTime.setMilliseconds(0);
        return endTime;
    }
}
