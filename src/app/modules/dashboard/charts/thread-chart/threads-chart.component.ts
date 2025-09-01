import {Component, OnInit} from '@angular/core';
import {MonitoringService} from "../../../../services/monitoring.service";
import {ChartService, TimeRange} from "../../../../services/chart-service.component";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatOption, MatSelect} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import * as echarts from 'echarts/core';
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/dataZoom'
import {NgxEchartsDirective} from "ngx-echarts";

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
        NgxEchartsDirective
    ],
    standalone: true
})
export class ThreadsChartComponent implements OnInit {

    // bound to the ngx-echarts directive in the template
    threadsChartOptions: echarts.EChartsCoreOption = {};

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
                    let types = Object.getOwnPropertyNames(data);
                    const dataSeries: any[] = [];
                    const legendValue: any[] = [];
                    types.forEach((t) => {
                        legendValue.push(t);
                        dataSeries.push({name: t, type: 'line', smooth: true, showSymbols: false, data: data[t]});
                    });
                    this.threadsChartOptions = {
                        title: {text: 'Total Threads', left: 'center'},
                        tooltip: {
                            trigger: 'item',
                            axisPointer: {
                                type: 'cross'
                            },
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            extraCssText: 'width: 170px',
                            label: {
                                formatter: (value: number) => {
                                    return value.toFixed(0);
                                }
                            },
                            valueFormatter: (value: number) => value.toFixed(0)
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
                        yAxis: {type: 'value', name: 'Count', nameGap: 50},
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
