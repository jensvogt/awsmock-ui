import {ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit} from "@angular/core";
import {ChartComponent} from "ng-apexcharts";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardImage, MatCardTitle} from "@angular/material/card";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatToolbar} from "@angular/material/toolbar";
import {JsonPipe, NgForOf, NgIf, SlicePipe} from "@angular/common";
import {MatList, MatListItem, MatListOption, MatNavList, MatSelectionList} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {MatFormField, MatLabel, MatOption, MatSelect} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AwsMockMonitoringService} from "../../../services/monitoring.service";
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatInput} from "@angular/material/input";
import {CdkDrag, CdkDragHandle} from "@angular/cdk/drag-drop";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {MatCheckbox, MatCheckboxModule} from "@angular/material/checkbox";

const AllModules = {
    modules: [
        {name: 's3', displayName: 'S3', selected: false},
        {name: 'sqs', displayName: 'SQS', selected: false},
        {name: 'sns', displayName: 'SNS', selected: false},
        {name: 'kms', displayName: 'KMS', selected: false},
        {name: 'ssm', displayName: 'SSM', selected: false},
        {name: 'secretsmanager', displayName: 'SecretsManager', selected: false},
        {name: 'cognito', displayName: 'Cognito', selected: false},
        {name: 'dynamodb', displayName: 'DynamoDB', selected: false},
        {name: 'lambda', displayName: 'Lambda', selected: false},
        {name: 'transfer', displayName: 'Transfer', selected: false},
    ],
    onlyObjects: true
}

@Component({
    selector: 'clean-infrastructure-component',
    templateUrl: './clean-infrastructure.component.html',
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
        MatCheckbox,
        FormsModule, ReactiveFormsModule, MatCheckboxModule, JsonPipe, SlicePipe
    ],
    providers: [AwsMockMonitoringService],
    styleUrls: ['./clean-infrastructure.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CleanInfrastructureComponentDialog implements OnInit, OnDestroy {

    title: string | undefined = "";

    onlyObjects: boolean = true;
    allSelected: boolean = true;
    protected readonly allModules = AllModules.modules;

    constructor(private dialogRef: MatDialogRef<CleanInfrastructureComponentDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.title = data.title;
    }

    ngOnInit(): void {
        this.setAll()
    }

    ngOnDestroy(): void {
    }

    setAll() {
        this.allModules.forEach((item) => {
            item.selected = this.allSelected;
        });
    }

    close() {
        this.dialogRef.close(false);
    }

    save() {
        this.dialogRef.close({modules: this.allModules, onlyObjects: this.onlyObjects});
    }
}