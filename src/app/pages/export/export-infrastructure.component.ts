import {Component, OnDestroy, OnInit} from "@angular/core";
import {ChartComponent} from "ng-apexcharts";
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
import {MatOption, MatSelect} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {AwsMockMonitoringService} from "../../services/monitoring.service";

@Component({
    selector: 'export-infrastructure-component',
    templateUrl: './export-infrastructure.component.html',
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
    styleUrls: ['./export-infrastructure.component.scss']
})
export class ExportInfrastructureComponent implements OnInit, OnDestroy {

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
    }
}