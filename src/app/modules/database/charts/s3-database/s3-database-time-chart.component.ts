import {Component, OnInit} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatOption, MatSelect} from "@angular/material/select";
import {MonitoringService} from "../../../../services/monitoring.service";
import {ChartService, TimeRange, Topx} from "../../../../services/chart-service.component";
import {FormsModule} from "@angular/forms";
import * as echarts from "echarts/core";
import {NgxEchartsDirective} from "ngx-echarts";

@Component({
    selector: 's3-database-time-chart-component',
    templateUrl: './s3-database-time-chart.component.html',
    standalone: true,
    imports: [
        MatCard,
        MatCardHeader,
        MatCardContent,
        MatCardActions,
        MatSelect,
        MatOption,
        FormsModule,
        NgxEchartsDirective,
    ],
    providers: [MonitoringService],
    styleUrls: ['./s3-database-time-chart.component.scss']
})
export class S3DatabaseTimeChartComponent implements OnInit {

    // bound to the ngx-echarts directive in the template
    sqsDatabaseChartOptions: echarts.EChartsCoreOption = {};

    ranges: TimeRange[] = [];
    selectedTimeRange: string = '';
    topx: Topx[] = [];
    selectedTopx: number = -1;

    constructor(private readonly monitoringService: MonitoringService, private readonly chartService: ChartService) {
    }

    ngOnInit(): void {
        this.ranges = this.chartService.getRanges();
        this.selectedTimeRange = this.chartService.getDefaultRange();
        this.topx = this.chartService.getTopxs();
        this.selectedTopx = this.chartService.getDefaultTopx();
        this.loadDatabaseChart();
    }

    loadDatabaseChart() {

        let start = this.chartService.getStartTime(this.selectedTimeRange);
        let end = this.chartService.getEndTime();
        this.monitoringService.getMultiCounters('s3_database_timer', 'action', start, end, 5, this.selectedTopx)
            .subscribe((data: any) => {
                if (data) {
                    let types = Object.getOwnPropertyNames(data);
                    const dataSeries: any[] = [];
                    const legendValue: any[] = [];
                    types.forEach((t) => {
                        legendValue.push(t);
                        dataSeries.push({name: t, type: 'line', smooth: true, showSymbols: false, data: data[t]});
                    });
                    this.sqsDatabaseChartOptions = {
                        title: {text: 'S3 Database Time', left: 'center'},
                        tooltip: {
                            trigger: 'item',
                            axisPointer: {
                                type: 'cross'
                            },
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            extraCssText: 'width: 170px',
                            label: {
                                formatter: (value: number) => {
                                    return value.toFixed(3);
                                }
                            },
                        },
                        axisPointer: {
                            type: 'cross'
                        },
                        legend: {data: legendValue, bottom: 0},
                        grid: {left: '6%', right: '6%', bottom: '12%'},
                        dataZoom: [
                            {
                                type: 'inside',
                                start: start,
                                end: end,
                                handleSize: 8
                            }
                        ],
                        xAxis: {
                            min: start.getTime(),
                            max: end.getTime(),
                            type: 'time',
                            name: 'Time',
                            boundaryGap: false,
                            axisLabel: {
                                formatter: (value: number) => {
                                    const d = new Date(value);
                                    const hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
                                    const min = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
                                    return hour + ':' + min;
                                }
                            }
                        },
                        yAxis: {type: 'value', name: 'Time [ms]', nameGap: 50},
                        series: dataSeries,
                        toolbox: {
                            feature: {
                                dataZoom: {
                                    yAxisIndex: 'none'
                                },
                                restore: {},
                                saveAsImage: {}
                            }
                        },
                    };
                }
            });
    }
}
