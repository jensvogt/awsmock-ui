import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, Inject, OnInit} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatTextColumn} from "@angular/material/table";
import {MatInput} from "@angular/material/input";
import {CdkDrag, CdkDragHandle} from "@angular/cdk/drag-drop";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {SqsMessageItem} from "../../model/sqs-message-item";

@Component({
    selector: 'sqs-edit-message-dialog',
    templateUrl: './edit-message.component.html',
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
        CdkDragHandle,
        CdkTextareaAutosize
    ],
    styleUrls: ['./edit-message.component.scss']
})
export class EditMessageComponentDialog implements OnInit {

    body: string | undefined = '';
    messageId: string | undefined = '';
    message: SqsMessageItem | undefined;

    constructor(private dialogRef: MatDialogRef<EditMessageComponentDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.message = data.message;
        this.body = this.message?.body;
        this.messageId = this.message?.messageId;
    }

    ngOnInit() {
    }

    sendMessage() {
        this.dialogRef.close(true);
    }

    close() {
        this.dialogRef.close(false);
    }
}
