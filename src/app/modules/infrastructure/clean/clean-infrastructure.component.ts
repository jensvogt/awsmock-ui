import {ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit} from "@angular/core";
import {MatButton} from "@angular/material/button";
import { SlicePipe } from "@angular/common";
import {MatList, MatListItem} from "@angular/material/list";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MonitoringService} from "../../../services/monitoring.service";
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {CdkDrag, CdkDragHandle} from "@angular/cdk/drag-drop";
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
    // For clean
    onlyObjects: true,
    // For export/import
    includeObjects: true
}

@Component({
    selector: 'clean-infrastructure-component',
    templateUrl: './clean-infrastructure.component.html',
    standalone: true,
    imports: [
    MatButton,
    MatList,
    MatListItem,
    FormsModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    CdkDrag,
    CdkDragHandle,
    MatCheckbox,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    SlicePipe
],
    providers: [MonitoringService],
    styleUrls: ['./clean-infrastructure.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CleanInfrastructureComponentDialog implements OnInit, OnDestroy {

    title: string | undefined = "";

    onlyObjects: boolean = true;
    allSelected: boolean = false;
    includeObjects: boolean = true;
    mode: string = 'export';
    protected readonly allModules = AllModules.modules;

    constructor(private dialogRef: MatDialogRef<CleanInfrastructureComponentDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.title = data.title;
        this.mode = data.mode;
    }

    ngOnInit(): void {
        this.setSome()
    }

    ngOnDestroy(): void {
    }

    setAll() {
        this.allModules.forEach((item) => {
            item.selected = this.allSelected;
        });
    }

    setSome() {
        this.allModules.forEach((item) => {
            item.selected = item.name === 'sqs' || item.name === 'sns' || item.name === 's3';
        });
    }

    close() {
        this.dialogRef.close(false);
    }

    save() {
        this.dialogRef.close({modules: this.allModules, onlyObjects: this.onlyObjects, includeObjects: this.includeObjects});
    }
}