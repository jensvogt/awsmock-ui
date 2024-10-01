import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardImage,
    MatCardTitle
} from "@angular/material/card";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatToolbar} from "@angular/material/toolbar";
import {NgForOf, NgIf} from "@angular/common";
import {MatList, MatListItem, MatListOption, MatNavList, MatSelectionList} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
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
import {PrometheusHttpService} from "../../shared/performance/prometheus-http.service";
import {MatOption, MatSelect} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {interval, Subscription} from "rxjs";

interface Range {
    value: string;
    viewValue: string;
}

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
    selector: 'app-home',
    templateUrl: './home.component.html',
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
        MatToolbar,
        NgIf,
        NgForOf,
        MatList,
        MatIcon,
        MatListItem,
        RouterLink,
        MatSelect,
        FormsModule,
        MatOption,
        MatIconButton,
        MatListOption,
        MatSelectionList,
        MatNavList,
    ],
    providers: [PrometheusHttpService],
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

    @ViewChild("chart") chart: ChartComponent | undefined;
    public cpuChartOptions: ChartOptions | undefined;
    public memChartOptions: ChartOptions | undefined;
    public httpTimeChartOptions: ChartOptions | undefined;

    // Auto-update
    updateSubscription: Subscription | undefined;

    ranges: Range[] = Ranges;
    selectedCpuChoice: string = this.ranges[0].value;
    selectedMemoryChoice: string = this.ranges[0].value;
    selectedHttpTimeChoice: string = this.ranges[0].value;

    constructor(private prometheusHttp: PrometheusHttpService) {
        this.updateSubscription = interval(60000).subscribe(() => {
            this.loadCpuChart();
            this.loadMemoryChart();
            this.loadHttpTimeChart();
        });
    }

    ngOnInit(): void {
        this.loadCpuChart();
        this.loadMemoryChart();
        this.loadHttpTimeChart();
    }

    ngOnDestroy(): void {
        this.updateSubscription?.unsubscribe();
    }

    // ===================================================================================================================
    // Cpu Performance
    // ===================================================================================================================
    loadCpuChart() {

        let url = this.getCpuUrl('total_cpu');
        this.prometheusHttp.get(url).subscribe((data: any) => {
            let performanceData = data.data.result[0].values;
            performanceData.forEach((e: number[]) => {
                e[0] = e[0] * 1000;
                e[1] = Number(parseFloat(String(e[1])).toFixed(3));
            });
            this.cpuChartOptions = {
                series: [
                    {
                        name: "CPU Usage",
                        data: performanceData,
                    }
                ],
                chart: {
                    height: 350,
                    type: "line",
                    zoom: {
                        enabled: false
                    },
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: "monotoneCubic",
                    width: 1
                },
                tooltip: {
                    x: {
                        format: "dd/MM HH:mm:ss"
                    }
                },
                title: {
                    text: "CPU",
                    align: "center"
                },
                grid: {
                    row: {
                        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                        opacity: 0.5
                    },
                    column: {
                        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                        opacity: 0.5
                    }
                },
                xaxis: {
                    type: "datetime",
                    title: {
                        text: "Time (UTC)"
                    },
                    min: this.getStartTime(this.selectedCpuChoice).getTime(),
                    max: this.getEndTime().getTime(),
                },
                yaxis: {
                    min: 0,
                    decimalsInFloat: 3,
                    title: {
                        text: "CPU [%]"
                    }
                }
            };
        });
    }

    updateCpuChart() {
        this.loadCpuChart();
    }

    getCpuUrl(query: string) {
        let start = this.getStartTime(this.selectedCpuChoice);
        let end = this.getEndTime();
        let step = this.getSteps(this.selectedCpuChoice);
        return 'http://localhost:9090/api/v1/query_range?query=' + query + '&start=' + start.toISOString() + '&end=' + end.toISOString() + '&step=' + step;
    }

    // ===================================================================================================================
    // Memory Performance
    // ===================================================================================================================
    loadMemoryChart() {

        let url = this.getMemoryUrl('real_memory_used');
        this.prometheusHttp.get(url).subscribe((data: any) => {
            let performanceData = data.data.result[0].values;

            performanceData.forEach((e: number[]) => {
                e[0] = e[0] * 1000;
                e[1] = Number(parseFloat(String(e[1])).toFixed(0)) / 1000;
            });
            this.memChartOptions = {
                series: [
                    {
                        name: "Memory Usage",
                        data: performanceData,
                    }
                ],
                chart: {
                    height: 350,
                    type: "line",
                    zoom: {
                        enabled: false
                    },
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: "monotoneCubic",
                    width: 1
                },
                title: {
                    text: "Memory",
                    align: "center"
                },
                tooltip: {
                    x: {
                        format: "dd/MM HH:mm:ss"
                    }
                },
                grid: {
                    row: {
                        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                        opacity: 0.5
                    },
                    column: {
                        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                        opacity: 0.5
                    }
                },
                xaxis: {
                    type: "datetime",
                    title: {
                        text: "Time (UTC)"
                    },
                    min: this.getStartTime(this.selectedMemoryChoice).getTime(),
                    max: this.getEndTime().getTime(),
                },
                yaxis: {
                    min: 0,
                    forceNiceScale: true,
                    decimalsInFloat: 0,
                    title: {
                        text: "Memory [MB]"
                    }
                }
            };
        });
    }

    updateMemoryChart() {
        this.loadMemoryChart();
    }

    getMemoryUrl(query: string) {
        let start = this.getStartTime(this.selectedMemoryChoice);
        let end = this.getEndTime();
        let step = this.getSteps(this.selectedMemoryChoice);
        return 'http://localhost:9090/api/v1/query_range?query=' + query + '&start=' + start.toISOString() + '&end=' + end.toISOString() + '&step=' + step;
    }

    // ===================================================================================================================
    // HTTP response time performance
    // ===================================================================================================================
    loadHttpTimeChart() {

        let url = this.getHttpTimeUrl('gateway_http_timer');
        this.prometheusHttp.get(url).subscribe((data: any) => {
            let performanceData = data.data.result[0].values;

            performanceData.forEach((e: number[]) => {
                e[0] = e[0] * 1000;
                e[1] = Number(parseFloat(String(e[1])).toFixed(0));
            });
            this.httpTimeChartOptions = {
                series: [
                    {
                        name: "HTTP Response Time",
                        data: performanceData,
                    }
                ],
                chart: {
                    height: 350,
                    type: "line",
                    zoom: {
                        enabled: false
                    },
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: "monotoneCubic",
                    width: 1
                },
                title: {
                    text: "HTTP Response Time",
                    align: "center"
                },
                tooltip: {
                    x: {
                        format: "dd/MM HH:mm:ss"
                    }
                },
                grid: {
                    row: {
                        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                        opacity: 0.5
                    },
                    column: {
                        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                        opacity: 0.5
                    }
                },
                xaxis: {
                    type: "datetime",
                    title: {
                        text: "Time (UTC)"
                    },
                    min: this.getStartTime(this.selectedHttpTimeChoice).getTime(),
                    max: this.getEndTime().getTime(),
                },
                yaxis: {
                    min: 0,
                    forceNiceScale: true,
                    decimalsInFloat: 0,
                    title: {
                        text: "HTTP Response Time [ms]"
                    }
                }
            };
        });
    }

    getHttpTimeUrl(query: string) {
        let start = this.getStartTime(this.selectedHttpTimeChoice);
        let end = this.getEndTime();
        let step = this.getSteps(this.selectedHttpTimeChoice);
        return 'http://localhost:9090/api/v1/query_range?query=' + query + '&start=' + start.toISOString() + '&end=' + end.toISOString() + '&step=' + step;
    }

    getStartTime(choice: string): Date {
        let startTime = new Date();
        if (choice == 'Today') {
            startTime.setUTCHours(0, 0, 0, 0);
        } else if (choice == 'LastHour') {
            startTime.setUTCHours(startTime.getUTCHours() - 1);
        } else if (choice == 'Last3Hours') {
            startTime.setUTCHours(startTime.getUTCHours() - 3);
        } else if (choice == 'Last6Hours') {
            startTime.setUTCHours(startTime.getUTCHours() - 6);
        } else if (choice == 'Last12Hours') {
            startTime.setUTCHours(startTime.getUTCHours() - 12);
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

    getSteps(choice: string): string {
        let step: string = '60s';
        if (choice == 'Today') {
            step = '5m';
        } else if (choice == 'LastHour') {
            step = '5m';
        } else if (choice == 'Last3Hours') {
            step = '5m';
        } else if (choice == 'Last6Hours') {
            step = '20m';
        } else if (choice == 'Last12Hours') {
            step = '30m';
        }
        return step;
    }

    updateHttpTimeChart() {
        this.loadHttpTimeChart();
    }

}
