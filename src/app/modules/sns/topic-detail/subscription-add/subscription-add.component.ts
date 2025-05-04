import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, Inject, OnInit} from "@angular/core";
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {SqsService} from "../../../sqs/service/sqs-service.component";
import {MatSnackBar} from "@angular/material/snack-bar";

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
    selector: 'subscription-add-dialog',
    templateUrl: './subscription-add.component.html',
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
        ReactiveFormsModule,
        NgIf
    ],
    styleUrls: ['./subscription-add.component.scss'],
    providers: [SqsService]
})
export class SubscriptionAddComponentDialog implements OnInit {

    // @ts-ignore
    form: FormGroup;
    topicArn: string = '';
    topicName: string = '';
    endpoint: string = '';
    protocol: string = 'sqs';
    queueArnData: Array<string> = [];
    protected readonly Protocols = Protocols;

    constructor(private snackBar: MatSnackBar, private sqsService: SqsService, private dialogRef: MatDialogRef<SubscriptionAddComponentDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.topicArn = data.topicArn;
        this.topicName = data.topicName;
    }

    ngOnInit() {
        this.loadQueueArns();
    }

    protocolSelectionChanged() {
        this.queueArnData = [];
        if (this.protocol == 'sqs') {
            this.loadQueueArns();
        } else if (this.protocol == 'http' || this.protocol == 'https') {
        } else {
            this.snackBar.open('Protocol not supported yet, name: ' + this.protocol, 'Dismiss', {duration: 5000});
        }
    }

    loadQueueArns() {
        this.sqsService.listQueueArns()
            .subscribe((data: any) => {
                this.queueArnData = data.QueueArns;
            });
    }

    save() {
        this.dialogRef.close({topicArn: this.topicArn, endpoint: this.endpoint, protocol: this.protocol});
    }
}
