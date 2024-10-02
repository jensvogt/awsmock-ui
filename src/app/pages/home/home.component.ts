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
import {MatOption, MatSelect} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {interval, Subscription} from "rxjs";
import {AwsMockMonitoringService} from "../../services/monitoring.service";

interface Range {
    value: string;
    viewValue: string;
}

interface Counter {
    name: string;
    labelName: string;
    labelValue: string;
    timestamp: Date;
    value: number;
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
    providers: [AwsMockMonitoringService],
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

    constructor(private monitoringService: AwsMockMonitoringService) {
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

        let start = this.getStartTime(this.selectedCpuChoice);
        let end = this.getEndTime();
        this.monitoringService.getCounters('total_cpu', start, end, 5)
            .subscribe((data: any) => {
                let performanceData: Array<number[]> = [];
                data.counters.forEach((e: Counter) => {
                    let c: number[] = [];
                    c[0] = new Date(e.timestamp).getTime();
                    c[1] = Number(e.value.toFixed(3));
                    performanceData.push(c);
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
                            type: 'x',
                            enabled: true,
                            autoScaleYaxis: true
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
                        shared: false,
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
                        labels: {
                            datetimeUTC: false
                        },
                        min: start.getTime(),
                        max: end.getTime(),
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

    // ===================================================================================================================
    // Memory Performance
    // ===================================================================================================================
    loadMemoryChart() {

        let start = this.getStartTime(this.selectedMemoryChoice);
        let end = this.getEndTime();
        this.monitoringService.getCounters('real_memory_used', start, end, 5)
            .subscribe((data: any) => {
                let performanceData: Array<number[]> = [];
                data.counters.forEach((e: Counter) => {
                    let c: number[] = [];
                    c[0] = new Date(e.timestamp).getTime();
                    c[1] = Number(e.value) / 1024;
                    performanceData.push(c);
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
                            type: 'x',
                            enabled: true,
                            autoScaleYaxis: true
                        },
                        toolbar: {
                            autoSelected: 'zoom'
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
                        labels: {
                            datetimeUTC: false
                        },
                        min: start.getTime(),
                        max: end.getTime(),
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

    // ===================================================================================================================
    // HTTP response time performance
    // ===================================================================================================================
    loadHttpTimeChart() {

        let start = this.getStartTime(this.selectedHttpTimeChoice);
        let end = this.getEndTime();
        this.monitoringService.getCounters('gateway_http_timer', start, end, 5)
            .subscribe((data: any) => {
                let performanceData: Array<number[]> = [];
                data.counters.forEach((e: Counter) => {
                    let c: number[] = [];
                    c[0] = new Date(e.timestamp).getTime();
                    c[1] = Number(e.value) / 1000;
                    performanceData.push(c);
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
                            type: 'x',
                            enabled: true,
                            autoScaleYaxis: true
                        },
                        toolbar: {
                            autoSelected: 'zoom'
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
                        labels: {
                            datetimeUTC: false
                        },
                        min: start.getTime(),
                        max: end.getTime(),
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

    updateHttpTimeChart() {
        this.loadHttpTimeChart();
    }

}
