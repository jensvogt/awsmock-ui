import {Component, OnInit, ViewChild} from '@angular/core';
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
import {MatList, MatListItem} from "@angular/material/list";
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
  ],
  providers: [PrometheusHttpService],
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

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
          }
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
    const start = new Date();
    const end = new Date();
    let step = '60s';
    if (this.selectedCpuChoice == 'Today') {
      start.setUTCHours(0, 0, 0, 0);
      step = '5m';
    } else if (this.selectedCpuChoice == 'LastHour') {
      start.setHours(start.getHours() - 1);
      start.setMinutes(start.getMinutes() % 1)
      step = '60s';
    } else if (this.selectedCpuChoice == 'Last3Hours') {
      start.setHours(start.getHours() - 3);
      step = '5m';
    } else if (this.selectedCpuChoice == 'Last6Hours') {
      start.setHours(start.getHours() - 6);
      step = '20m';
    } else if (this.selectedCpuChoice == 'Last12Hours') {
      start.setHours(start.getHours() - 12);
      step = '30m';
    }
    start.setSeconds(0);
    start.setMilliseconds(0);
    end.setSeconds(0);
    end.setMilliseconds(0);
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
          }
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
    const start = new Date();
    const end = new Date();
    end.setSeconds(0);
    end.setMilliseconds(0);
    let step = '60s';
    if (this.selectedMemoryChoice == 'Today') {
      start.setUTCHours(0, 0, 0, 0);
      step = '5m';
    } else if (this.selectedMemoryChoice == 'LastHour') {
      start.setHours(start.getHours() - 1);
      step = '5m';
    } else if (this.selectedMemoryChoice == 'Last3Hours') {
      start.setHours(start.getHours() - 3);
      step = '5m';
    } else if (this.selectedMemoryChoice == 'Last6Hours') {
      start.setHours(start.getHours() - 6);
      step = '20m';
    } else if (this.selectedMemoryChoice == 'Last12Hours') {
      start.setHours(start.getHours() - 12);
      step = '30m';
    }
    start.setSeconds(0);
    start.setMilliseconds(0);
    return 'http://localhost:9090/api/v1/query_range?query=' + query + '&start=' + start.toISOString() + '&end=' + end.toISOString() + '&step=' + step;
  }

  // ===================================================================================================================
  // Memory Performance
  // ===================================================================================================================
  loadHttpTimeChart() {

    let url = this.getHttpTimeUrl('gateway_http_timer');
    this.prometheusHttp.get(url).subscribe((data: any) => {
      let performanceData = data.data.result[0].values;

      performanceData.forEach((e: number[]) => {
        e[0] = e[0] * 1000;
        e[1] = Number(parseFloat(String(e[1])).toFixed(0)) / 1000;
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
          }
        },
        yaxis: {
          min: 0,
          forceNiceScale: true,
          decimalsInFloat: 0,
          title: {
            text: "HTTP Response Time [s]"
          }
        }
      };
    });
  }

  getHttpTimeUrl(query: string) {
    let start = new Date();
    const end = new Date();
    end.setSeconds(0);
    end.setMilliseconds(0);
    let step = '60s';
    if (this.selectedHttpTimeChoice == 'Today') {
      start.setUTCHours(0, 0, 0, 0);
      step = '5m';
    } else if (this.selectedHttpTimeChoice == 'LastHour') {
      start.setHours(start.getHours() - 1);
      step = '5m';
    } else if (this.selectedHttpTimeChoice == 'Last3Hours') {
      start.setHours(start.getHours() - 3);
      step = '5m';
    } else if (this.selectedHttpTimeChoice == 'Last6Hours') {
      start.setHours(start.getHours() - 6);
      step = '20m';
    } else if (this.selectedHttpTimeChoice == 'Last12Hours') {
      start.setHours(start.getHours() - 12);
      step = '30m';
    }
    start.setSeconds(0);
    start.setMilliseconds(0);
    return 'http://localhost:9090/api/v1/query_range?query=' + query + '&start=' + start.toISOString() + '&end=' + end.toISOString() + '&step=' + step;
  }

  updateHttpTimeChart() {
    this.loadHttpTimeChart();
  }

}
