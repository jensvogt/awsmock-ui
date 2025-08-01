import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, Inject} from "@angular/core";

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {SqsService} from "../../sqs/service/sqs-service.component";
import {SnsService} from "../../sns/service/sns-service.component";
import {MatInput} from "@angular/material/input";
import {S3FilterRuleTypes, S3NotificationEvents} from "../../s3/model/s3-notification-event";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {UpdateEventSourceRequest} from "../model/lambda-event-source-item";
import {S3Service} from "../../s3/service/s3-service.component";
import {DynamodbService} from "../../dynamodb/service/dynamodb.service";

export interface EventType {
    value: string;
    viewValue: string;
}

const EventTypes: Array<EventType> = [
    {value: 'SQS', viewValue: 'SQS'},
    {value: 'SNS', viewValue: 'SNS'},
    {value: 'S3', viewValue: 'S3'},
    {value: 'DynamoDB', viewValue: 'DynamoDB'},
];

@Component({
    selector: 'function-event-source-edit-dialog',
    templateUrl: './function-event-source-edit.component.html',
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
        ReactiveFormsModule,
        MatOption,
        MatSelect,
        MatInput,
        MatSlideToggle
    ],
    styleUrls: ['./function-event-source-edit.component.scss'],
})
export class LambdaEventSourceEditDialog {

    // Type
    selectedType: string = '';
    functionArn: string = '';
    functionName: string = '';
    eventSourceArn: string = '';
    eventSourceType: string = '';
    enabled: boolean = true;
    batchSize: number = 10;
    maximumBatchingWindowInSeconds: number = 5;

    // SQS
    queueArns: string[] = [];
    selectedQueueArn: string = '';

    // SNS
    topicArns: string[] = [];
    selectedTopicArn: string = '';

    // S3 Events
    bucketArns: string[] = [];
    selectedBucketArn: string[] = [];
    selectedEvent: string = '';

    // S3 Filter
    selectedFilterRuleType: string = '';
    filterRuleValue: string = '';

    // DynamoDB Events
    tableArns: string[] = [];
    selectedTableArn: string[] = [];

    protected readonly EventTypes = EventTypes;
    protected readonly events = S3NotificationEvents;
    protected readonly filterRuleTypes = S3FilterRuleTypes;

    constructor(private readonly dialogRef: MatDialogRef<LambdaEventSourceEditDialog>, @Inject(MAT_DIALOG_DATA) public data: any,
                private readonly sqsService: SqsService, private readonly snsService: SnsService, private readonly s3Service: S3Service,
                private readonly dynamoDbService: DynamodbService) {
        this.functionArn = data.functionArn;
        this.functionName = this.functionArn.substring(this.functionArn.lastIndexOf(':') + 1);
        this.eventSourceArn = data.eventSourceArn;
        this.eventSourceType = data.type;
        this.getEventSource();
    }

    loadTypeObjects(event: any) {
        if (event.value === 'SQS') {
            this.loadSqsArns();
        } else if (event.value === 'SNS') {
            this.loadSnsArns();
        } else if (event.value === 'S3') {
            this.loadS3Arns();
        } else if (event.value === 'DynamoDB') {
            this.loadTableArns();
        }
    }

    loadSqsArns() {
        this.sqsService.listQueueArns().subscribe((data: any) => {
            this.selectedQueueArn = this.eventSourceArn;
            this.queueArns = data.QueueArn;
        });
    }

    loadSnsArns() {
        this.snsService.listTopicArns().subscribe((data: any) => {
            this.topicArns = data.topicArns;
        });
    }

    loadS3Arns() {
        this.s3Service.listBucketArns().subscribe((data: any) => {
            this.bucketArns = data.bucketArns;
        });
    }

    loadTableArns() {
        this.dynamoDbService.listTableArns().subscribe((data: any) => {
            this.tableArns = data.tableArns;
        });
    }

    getEventSource() {
        if (this.eventSourceType == 'S3') {
            this.s3Service.getEventSource(this.functionArn, this.eventSourceArn).subscribe((data: any) => {
                this.bucketArns = data.bucketArns;
            });
        } else if (this.eventSourceType == 'SQS') {
            this.sqsService.getEventSource(this.functionArn, this.eventSourceArn).subscribe((data: any) => {
                this.loadSqsArns();
                this.selectedType = 'SQS';
                this.selectedQueueArn = data.lambdaConfiguration.arn;
            });
        } else if (this.eventSourceType == 'SNS') {
            /*this.sqsService.getEventSource(this.functionArn, this.eventSourceArn).subscribe((data: any) => {
                this.bucketArns = data.bucketArns;
            });*/
        }
    }

    arnSelectionChanged(event: any) {
        this.eventSourceArn = event.value;
    }

    save() {
        let editEventSourceRequest: UpdateEventSourceRequest = {
            FunctionArn: this.functionArn,
            Events: this.selectedEvent,
            FilterRuleType: this.selectedFilterRuleType,
            FilterRuleValue: this.filterRuleValue,
            Enabled: this.enabled,
            BatchSize: this.batchSize,
            MaximumBatchingWindowInSeconds: this.maximumBatchingWindowInSeconds
        };
        this.dialogRef.close(editEventSourceRequest);
    }
}
