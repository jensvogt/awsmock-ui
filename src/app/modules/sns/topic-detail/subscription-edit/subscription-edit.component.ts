import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, Inject, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatInput} from "@angular/material/input";

import {SqsService} from "../../../sqs/service/sqs-service.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LambdaService} from "../../../lambda/service/lambda-service.component";

export const Protocols: string[] = [
    'http',
    'https',
    'email',
    'email-json',
    'sms',
    'sqs',
    'application',
    'lambda',
    'firehose'
];

@Component({
    selector: 'subscription-edit-dialog',
    templateUrl: './subscription-edit.component.html',
    standalone: true,
    imports: [
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatFormField,
    MatSelect,
    MatOption,
    MatLabel,
    FormsModule,
    MatInput,
    ReactiveFormsModule
],
    styleUrls: ['./subscription-edit.component.scss'],
    providers: [SqsService]
})
export class SubscriptionEditComponentDialog implements OnInit {

    // @ts-ignore
    form: FormGroup;
    topicArn: string = '';
    subscriptionArn: string = '';
    endpoint: string = '';
    protocol: string = 'sqs';
    queueSelection = '';
    lambdaSelection = '';
    queueArnData: Array<string> = [];
    lambdaArnData: Array<string> = [];
    protected readonly Protocols = Protocols;

    constructor(private snackBar: MatSnackBar, private sqsService: SqsService, private lambdaService: LambdaService, private fb: FormBuilder, private dialogRef: MatDialogRef<SubscriptionEditComponentDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.topicArn = data.topicArn;
        this.subscriptionArn = data.subscriptionArn;
        this.endpoint = data.endpoint;
        this.protocol = data.protocol;
    }

    ngOnInit() {
        this.form = this.fb.group({
            topicArn: [""],
            endpoint: [""],
            protocol: [""],
        });
        if (this.protocol === 'sqs') {
            this.loadQueueArns();
        } else if (this.protocol === 'lambda') {
            this.loadLambdaArns();
        }
    }

    protocolSelectionChanged() {
        this.queueArnData = [];
        if (this.protocol == 'sqs') {
            this.loadQueueArns();
        } else if (this.protocol === 'lambda') {
            this.loadLambdaArns();
        } else if (this.protocol === 'http' || this.protocol === 'https') {
        } else {
            this.snackBar.open('Protocol not supported yet, name: ' + this.protocol, 'Dismiss', {duration: 5000});
        }
    }

    loadQueueArns() {
        this.sqsService.listQueueArns()
            .subscribe((data: any) => {
                this.queueArnData = data.QueueArns;
                this.queueSelection = this.endpoint;
            });
    }

    loadLambdaArns() {
        this.lambdaService.listLambdaArns()
            .subscribe((data: any) => {
                this.lambdaArnData = data.lambdaArns;
                this.lambdaSelection = this.endpoint;
            });
    }

    save() {
        this.dialogRef.close({topicArn: this.topicArn, subscriptionArn: this.subscriptionArn, endpoint: this.endpoint, protocol: this.protocol});
    }
}
