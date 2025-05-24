import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, Inject, OnInit} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {LambdaService} from "../../lambda/service/lambda-service.component";
import {LambdaFunctionItem} from "../../lambda/model/lambda-item";
import {LambdaConfiguration} from "../model/s3-bucket-item";

export const NotificationEvents = [
    's3:ReducedRedundancyLostObject',
    's3:ObjectCreated:*',
    's3:ObjectCreated:Put',
    's3:ObjectCreated:Post',
    's3:ObjectCreated:Copy',
    's3:ObjectCreated:CompleteMultipartUpload',
    's3:ObjectRemoved:*',
    's3:ObjectRemoved:Delete',
    's3:ObjectRemoved:DeleteMarkerCreated',
    's3:ObjectRestore:*',
    's3:ObjectRestore:Post',
    's3:ObjectRestore:Completed',
    's3:Replication:*',
    's3:Replication:OperationFailedReplication',
    's3:Replication:OperationNotTracked',
    's3:Replication:OperationMissedThreshold',
    's3:Replication:OperationReplicatedAfterThreshold',
    's3:ObjectRestore:Delete',
    's3:LifecycleTransition',
    's3:IntelligentTiering',
    's3:ObjectAcl:Put',
    's3:LifecycleExpiration:*',
    's3:LifecycleExpiration:Delete',
    's3:LifecycleExpiration:DeleteMarkerCreated',
    's3:ObjectTagging:*',
    's3:ObjectTagging:Put',
    's3:ObjectTagging:Delete'
];

export const FilterRuleTypes = [
    'prefix',
    'postfix',
];

@Component({
    selector: 'bucket-notification-edit-dialog',
    templateUrl: './bucket-notification-edit.component.html',
    standalone: true,
    imports: [
        MatDialogContent,
        MatDialogTitle,
        MatDialogActions,
        MatButton,
        MatDialogClose,
        MatFormField,
        MatLabel,
        FormsModule,
        MatInput,
        ReactiveFormsModule,
        MatOption,
        MatSelect
    ],
    styleUrls: ['./bucket-notification-edit.component.scss']
})
export class BucketNotificationEditDialog implements OnInit {

    bucketName: string = '';
    notification: LambdaConfiguration = {} as any;
    events: string[] = NotificationEvents;
    selectedEvent: string = 's3:ObjectCreated:*';
    functionArns: string[] = [];
    selectedFunction: string = NotificationEvents[0];
    filterRuleTypes: string[] = FilterRuleTypes
    selectedFilterRuleType: string = FilterRuleTypes[0];
    filterRuleValue: string = '';

    constructor(private dialogRef: MatDialogRef<BucketNotificationEditDialog>, @Inject(MAT_DIALOG_DATA) public data: any, private lambdaService: LambdaService) {
        this.bucketName = data.bucketName;
        this.notification = data.notification;
    }

    ngOnInit() {
        this.loadFunctions();
    }

    save() {
        this.notification.CloudFunction = this.selectedFunction;
        this.notification.Event = [{name: this.selectedEvent}];
        this.notification.FilterRules = [{Name: this.selectedFilterRuleType, Value: this.filterRuleValue}];
        this.dialogRef.close(this.notification);
    }

    loadFunctions() {
        this.lambdaService.listFunctionCounters('', 10, 0, [{column: 'functionName', sortDirection: 1}])
            .subscribe((data: any) => {
                data.functionCounters.forEach((f: LambdaFunctionItem) => this.functionArns.push(f.functionArn));
                if (this.functionArns.length > 0) {
                    this.selectedFunction = this.functionArns[0];
                }
            });
    }
}
