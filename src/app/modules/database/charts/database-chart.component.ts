import {Component, OnInit, ViewChild} from '@angular/core';
import {ChartService, TimeRange} from "../../../services/chart-service.component";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {FormsModule} from "@angular/forms";
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/dataZoom'
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {Location} from "@angular/common";
import {SqsDatabaseTimeChartComponent} from "./sqs-database/sqs-database-time-chart.component";
import {FooterComponent} from "../../../shared/footer/footer.component";
import {S3DatabaseTimeChartComponent} from "./s3-database/s3-database-time-chart.component";
import {SnsDatabaseTimeChartComponent} from "./sns-database/sns-database-time-chart.component";

@Component({
    selector: 'database-chart-component',
    templateUrl: './database-chart.component.html',
    styleUrls: ['./database-chart.component.scss'],
    imports: [
        MatCard,
        MatCardHeader,
        FormsModule,
        MatCardContent,
        MatIcon,
        MatIconButton,
        SqsDatabaseTimeChartComponent,
        FooterComponent,
        S3DatabaseTimeChartComponent,
        SnsDatabaseTimeChartComponent,
    ],
    standalone: true
})
export class DatabaseChartComponent implements OnInit {

    // Last update timestamp
    lastUpdate: Date = new Date();

    ranges: TimeRange[] = [];
    selectedTimeRange: string = '';

    @ViewChild(SqsDatabaseTimeChartComponent) sqsDatabaseChart: SqsDatabaseTimeChartComponent | undefined;
    @ViewChild(SnsDatabaseTimeChartComponent) snsDatabaseChart: SnsDatabaseTimeChartComponent | undefined;
    @ViewChild(S3DatabaseTimeChartComponent) s3DatabaseChart: S3DatabaseTimeChartComponent | undefined;

    constructor(private readonly chartService: ChartService, private readonly location: Location) {
    }

    ngOnInit(): void {
        this.ranges = this.chartService.getRanges();
        this.selectedTimeRange = this.chartService.getDefaultRange();
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.sqsDatabaseChart?.loadDatabaseChart();
        this.snsDatabaseChart?.loadDatabaseChart();
        this.snsDatabaseChart?.loadDatabaseChart();
        this.lastUpdate = new Date();
    }

}
