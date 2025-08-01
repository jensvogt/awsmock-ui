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
import {AddEventSourceRequest} from "../model/lambda-event-source-item";
import * as uuid from "uuid";
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
    selector: 'function-event-source-add-dialog',
    templateUrl: './function-event-source-add.component.html',
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
    styleUrls: ['./function-event-source-add.component.scss'],
})
export class LambdaEventSourceAddDialog {

    // Type
    selectedType: string = '';
    functionArn: string = '';
    functionName: string = '';
    eventSourceArn: string = '';
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
    selectedEvents: string[] = [];

    // S3 Filter
    selectedFilterRuleType: string = '';
    filterRuleValue: string = '';

    // DynamoDB Events
    tableArns: string[] = [];
    selectedTableArn: string[] = [];

    protected readonly EventTypes = EventTypes;
    protected readonly events = S3NotificationEvents;
    protected readonly filterRuleTypes = S3FilterRuleTypes;

    constructor(private readonly dialogRef: MatDialogRef<LambdaEventSourceAddDialog>, @Inject(MAT_DIALOG_DATA) public data: any,
                private readonly sqsService: SqsService, private readonly snsService: SnsService, private readonly s3Service: S3Service,
                private readonly dynamoDbService: DynamodbService) {
        this.functionArn = data.functionArn;
        this.functionName = this.functionArn.substring(this.functionArn.lastIndexOf(':') + 1);
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

    arnSelectionChanged(event: any) {
        this.eventSourceArn = event.value;
    }

    save() {
        let addEventSourceRequest: AddEventSourceRequest = {
            Type: this.selectedType,
            EventSourceArn: this.eventSourceArn,
            FunctionArn: this.functionArn,
            Events: this.selectedEvents,
            FilterRuleType: this.selectedFilterRuleType,
            FilterRuleValue: this.filterRuleValue,
            UUID: uuid.v4(),
            Enabled: this.enabled,
            BatchSize: this.batchSize,
            MaximumBatchingWindowInSeconds: this.maximumBatchingWindowInSeconds
        };
        this.dialogRef.close(addEventSourceRequest);
    }
}
