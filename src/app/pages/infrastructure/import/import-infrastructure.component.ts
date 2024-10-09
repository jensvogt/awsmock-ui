import {Component, Inject, OnDestroy, OnInit} from "@angular/core";
import {ChartComponent} from "ng-apexcharts";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardImage, MatCardTitle} from "@angular/material/card";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatToolbar} from "@angular/material/toolbar";
import {NgForOf, NgIf} from "@angular/common";
import {MatList, MatListItem, MatListOption, MatNavList, MatSelectionList} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {MatFormField, MatLabel, MatOption, MatSelect} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {AwsMockMonitoringService} from "../../../services/monitoring.service";
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatInput} from "@angular/material/input";
import {CdkDrag, CdkDragHandle} from "@angular/cdk/drag-drop";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";

@Component({
    selector: 'export-infrastructure-component',
    templateUrl: './import-infrastructure.component.html',
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
        MatDialogActions,
        MatDialogClose,
        MatDialogContent,
        MatDialogTitle,
        MatFormField,
        MatInput,
        MatLabel,
        CdkDrag,
        CdkDragHandle,
        CdkTextareaAutosize,
    ],
    providers: [AwsMockMonitoringService],
    styleUrls: ['./import-infrastructure.component.scss']
})
export class ImportInfrastructureComponentDialog implements OnInit, OnDestroy {

    body: string | undefined;

    constructor(private dialogRef: MatDialogRef<ImportInfrastructureComponentDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.body = JSON.stringify(data, null, 4);
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
    }

    exportInfrastructure() {

    }
}