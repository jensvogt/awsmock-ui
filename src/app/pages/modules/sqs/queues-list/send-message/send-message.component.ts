import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from "@angular/material/dialog";
import {Component, Inject, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatTextColumn} from "@angular/material/table";
import {MatInput} from "@angular/material/input";
import {CdkDrag, CdkDragHandle} from "@angular/cdk/drag-drop";

@Component({
    selector: 'queue-send-message-dialog',
    templateUrl: './send-message.component.html',
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
        MatTextColumn,
        MatInput,
        ReactiveFormsModule,
        CdkDrag,
        CdkDragHandle
    ],
    styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponentDialog implements OnInit {

    // @ts-ignore
    form: FormGroup;
    queueUrl: string = '';
    queueName: string = '';
    message: string = '';

    constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<SendMessageComponentDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.queueUrl = data.queueUrl;
        this.queueName = data.queueUrl.substring(this.queueUrl.lastIndexOf('/') + 1);
    }

    ngOnInit() {
        this.form = this.fb.group({
            queueName: [""],
        });
    }

    sendMessage() {
        this.dialogRef.close(this.message);
    }

    close() {
        this.dialogRef.close(false);
    }
}
