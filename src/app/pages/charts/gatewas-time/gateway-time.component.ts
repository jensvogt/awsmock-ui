import {Component, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardImage, MatCardTitle} from "@angular/material/card";
import {registerLocaleData} from "@angular/common";
import {MatSelectionList} from "@angular/material/list";
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
    selector: 'gateway-time-chart-component',
    templateUrl: './gateway-time.component.html',
    standalone: true,
    imports: [
        ChartComponent,
        MatCard,
        MatCardHeader,
        MatCardContent,
        MatCardActions,
        MatCardImage,
        MatCardTitle,
        MatSelect,
        MatSelectionList,
        MatOption,
        FormsModule
    ],
    providers: [AwsMockMonitoringService, AwsMockExportService, {provide: LOCALE_ID, useValue: 'de-CH'}],
    styleUrls: ['./gateway-time.component.scss']
})
export class GatewayTimeComponent implements OnInit {

    public httpTimeChartOptions: Partial<ChartOptions> | undefined;

    ranges: Range[] = Ranges;
    selectedHttpTimeChoice: string = this.ranges[0].value;
    @ViewChild("httpTimerChart") httpTimerChart: ChartComponent | undefined;

    constructor(private monitoringService: AwsMockMonitoringService) {
    }

    ngOnInit(): void {
        this.loadHttpTimeChart();
    }

    loadHttpTimeChart() {

        let start = this.getStartTime(this.selectedHttpTimeChoice);
        let end = this.getEndTime();
        this.monitoringService.getCounters('gateway_http_timer', start, end, 5)
            .subscribe((data: any) => {
                if (data) {
                    this.httpTimeChartOptions = {
                        series: [{name: "HTTP Response Time", data: data.counters}],
                        chart: {height: 350, type: "line"},
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
                                }
                            }
                        }
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
