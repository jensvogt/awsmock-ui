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
import {S3FilterRuleTypes, S3NotificationEvents} from "../model/s3-notification-event";


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
    events: string[] = S3NotificationEvents;
    selectedEvent: string = 's3:ObjectCreated:*';
    functionArns: string[] = [];
    selectedFunction: string = S3NotificationEvents[0];
    filterRuleTypes: string[] = S3FilterRuleTypes
    selectedFilterRuleType: string = S3FilterRuleTypes[0];
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
