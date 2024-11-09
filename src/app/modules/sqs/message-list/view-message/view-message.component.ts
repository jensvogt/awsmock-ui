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
import {JsonPipe} from "@angular/common";
import {MatSlideToggle, MatSlideToggleChange} from "@angular/material/slide-toggle";

@Component({
    selector: 'sqs-edit-message-dialog',
    templateUrl: './view-message.component.html',
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
        CdkTextareaAutosize,
        JsonPipe,
        MatSlideToggle
    ],
    styleUrls: ['./view-message.component.scss']
})
export class ViewMessageComponentDialog implements OnInit {

    body: string = '';
    messageId: string | undefined = '';
    message: SqsMessageItem;
    prettyPrint: boolean = true;

    constructor(private dialogRef: MatDialogRef<ViewMessageComponentDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.message = data.message;
        if (this.prettyPrint) {
            this.body = JSON.stringify(JSON.parse(data.message.body), null, 2);
        } else {
            this.body = data.message.body;
        }
        this.messageId = this.message?.messageId;
    }

    ngOnInit() {
    }

    sendMessage() {
        this.dialogRef.close(true);
    }

    changePrettyPrint(event: MatSlideToggleChange) {
        if (this.message.body !== undefined) {
            if (event.checked) {
                this.body = JSON.stringify(JSON.parse(this.message?.body), null, 2);
            } else {
                this.body = this.message?.body;
            }
        }
    }

    close() {
        this.dialogRef.close(false);
    }
}
