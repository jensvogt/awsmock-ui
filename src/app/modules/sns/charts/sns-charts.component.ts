import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardImage, MatCardTitle} from "@angular/material/card";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatToolbar} from "@angular/material/toolbar";
import {Location, NgForOf, NgIf} from "@angular/common";
import {MatList, MatListItem, MatListOption, MatNavList, MatSelectionList} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {MatOption, MatSelect} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {interval, Subscription} from "rxjs";
import {MonitoringService} from "../../../services/monitoring.service";
import {MatTooltip} from "@angular/material/tooltip";
import {SqsServiceTimeChartComponent} from "../../sqs/charts/service-time/service-time-chart.component";
import {SnsServiceTimeChartComponent} from "./service-time/service-time-chart.component";
import {SnsMessageCountChartComponent} from "./message-count-time/message-count-chart.component";

@Component({
    selector: 'sns-charts-component',
    templateUrl: './sns-charts.component.html',
    standalone: true,
    imports: [
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
        MatTooltip,
        SnsServiceTimeChartComponent,
        SnsMessageCountChartComponent,
    ],
    providers: [MonitoringService],
    styleUrls: ['./sns-charts.component.scss']
})
export class SnsChartsComponent implements OnInit, OnDestroy {

    // Last update
    lastUpdate: string = '';

    // Auto-update
    updateSubscription: Subscription | undefined;
    @ViewChild(SqsServiceTimeChartComponent) serviceTimeChart: SqsServiceTimeChartComponent | undefined;

    constructor(private location: Location) {
        this.updateSubscription = interval(60000).subscribe(() => {
            this.lastUpdate = new Date().toLocaleTimeString('DE-de');
            this.serviceTimeChart?.loadServiceTimeChart();
        });
    }

    ngOnInit(): void {
        this.lastUpdate = new Date().toLocaleTimeString('DE-de');
    }

    ngOnDestroy(): void {
        this.updateSubscription?.unsubscribe();
    }

    back() {
        this.location.back();
    }

    refresh() {
    }
}
