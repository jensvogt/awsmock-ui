import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, Inject, OnInit} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {CdkDrag, CdkDragHandle} from "@angular/cdk/drag-drop";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {SnsMessageItem} from "../../model/sns-message-item";
import {MatSlideToggle, MatSlideToggleChange} from "@angular/material/slide-toggle";
import {isJson} from "../../../../shared/format/message-format-component";
import {NgIf} from "@angular/common";

@Component({
    selector: 'sns-edit-message-dialog',
    templateUrl: './sns-view-message.component.html',
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
        CdkDrag,
        CdkDragHandle,
        CdkTextareaAutosize,
        MatSlideToggle,
        NgIf
    ],
    styleUrls: ['./sns-view-message.component.scss']
})
export class SnsViewMessageDialog implements OnInit {

    body: string | undefined = '';
    rawMessage: any | undefined = '';
    messageId: string | undefined = '';
    message: SnsMessageItem | undefined;
    prettyPrint: boolean = true;
    isJson: boolean = false;

    constructor(private dialogRef: MatDialogRef<SnsViewMessageDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.message = data.message;
        this.rawMessage = this.message?.Message;
        this.messageId = this.message?.MessageId;
        this.isJson = isJson(this.rawMessage);
        if (this.isJson && this.prettyPrint) {
            this.body = JSON.stringify(JSON.parse(this.data.message.Message), null, 2);
        } else {
            this.body = data.message.Message;
        }
    }

    ngOnInit() {
    }

    sendMessage() {
        this.dialogRef.close(true);
    }

    changePrettyPrint(event: MatSlideToggleChange) {
        if (this.message?.Message !== undefined) {
            if (event.checked) {
                this.body = JSON.stringify(JSON.parse(this.message?.Message), null, 2);
            } else {
                this.body = this.message?.Message;
            }
        }
    }

    close() {
        this.dialogRef.close(false);
    }
}
