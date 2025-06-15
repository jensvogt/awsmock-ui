import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, Inject} from "@angular/core";
import {NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {SqsService} from "../../sqs/service/sqs-service.component";
import {SnsService} from "../../sns/service/sns-service.component";
import {MatInput} from "@angular/material/input";

export interface EventType {
    value: string;
    viewValue: string;
}

const EventTypes: Array<EventType> = [
    {value: 'SQS', viewValue: 'SQS'},
    {value: 'SNS', viewValue: 'SNS'},
    {value: 'S3', viewValue: 'S3'},
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
        NgIf,
        MatInput
    ],
    styleUrls: ['./function-event-source-add.component.scss'],
})
export class LambdaEventSourceAddDialog {

    // Type
    selectedType: string = '';
    functionArn: string = '';
    functionName: string = '';
    eventSourceArn: string = '';
    batchSize: number = 10;
    maximumBatchingWindowInSeconds: number = 5;

    // SQS
    queueArns: string[] = [];
    selectedQueueArn: string = '';

    // SNS
    topicArns: string[] = [];
    selectedTopicArn: string = '';

    protected readonly EventTypes = EventTypes;

    constructor(private readonly dialogRef: MatDialogRef<LambdaEventSourceAddDialog>, @Inject(MAT_DIALOG_DATA) public data: any,
                private readonly sqsService: SqsService, private readonly snsService: SnsService) {
        this.functionArn = data.functionArn;
        this.functionName = this.functionArn.substring(this.functionArn.lastIndexOf(':') + 1);
    }

    loadTypeObjects(event: any) {
        if (event.value === 'SQS') {
            this.loadSqsArns();
        } else if (event.value === 'SNS') {
            this.loadSnsArns();
        }
    }

    loadSqsArns() {
        this.sqsService.listQueueArns().subscribe((data: any) => {
            this.queueArns = data.QueueArns;
        });
    }

    loadSnsArns() {
        this.snsService.listTopicArns().subscribe((data: any) => {
            this.topicArns = data.topicArns;
        });
    }

    arnSelectionChanged(event: any) {
        this.eventSourceArn = event.value;
    }

    save() {
        this.dialogRef.close({type: this.selectedType, eventSourceArn: this.eventSourceArn, batchSize: this.batchSize, maximumBatchingWindowInSeconds: this.maximumBatchingWindowInSeconds});
    }
}
