import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardImage, MatCardTitle} from "@angular/material/card";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatToolbar} from "@angular/material/toolbar";
import {NgForOf, NgIf} from "@angular/common";
import {MatList, MatListItem, MatListOption, MatNavList, MatSelectionList} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {MatOption, MatSelect} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {interval, Subscription} from "rxjs";
import {AwsMockMonitoringService} from "../../../services/monitoring.service";
import {MatTooltip} from "@angular/material/tooltip";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SqsServiceTimeChartComponent} from "./service-time/service-time-chart.component";
import {SqsMessageWaitTimeChartComponent} from "./message-wait-time/message-wait-time-chart.component";
import {NavigationService} from "../../../services/navigation.service";

@Component({
    selector: 'sqs-charts-component',
    templateUrl: './sqs-charts.component.html',
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
        SqsServiceTimeChartComponent,
        SqsServiceTimeChartComponent,
        SqsServiceTimeChartComponent,
        SqsMessageWaitTimeChartComponent,
        SqsServiceTimeChartComponent,
    ],
    providers: [AwsMockMonitoringService],
    styleUrls: ['./sqs-charts.component.scss']
})
export class SqsChartsComponent implements OnInit, OnDestroy {
    lastUpdate: string = '';

    // Auto-update
    updateSubscription: Subscription | undefined;
    @ViewChild(SqsServiceTimeChartComponent) serviceTimeChart: SqsServiceTimeChartComponent | undefined;

    constructor(private snackBar: MatSnackBar, private navigation: NavigationService) {
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
        this.navigation.back();
    }

    refresh() {

    }
}
