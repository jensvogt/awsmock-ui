import {MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogConfig, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, Inject, OnInit} from "@angular/core";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {CdkDrag, CdkDragHandle} from "@angular/cdk/drag-drop";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {FileImportComponent} from "../../infrastructure/import/file-import/file-import.component";

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
        MatLabel,
        FormsModule,
        MatInput,
        ReactiveFormsModule,
        CdkDrag,
        CdkDragHandle,
        CdkTextareaAutosize
    ],
    styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponentDialog implements OnInit {

    queueUrl: string = '';
    queueName: string = '';
    message: string = '';

    constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<SendMessageComponentDialog>, @Inject(MAT_DIALOG_DATA) public data: any,
                private fileDialog: MatDialog) {
        this.queueUrl = data.queueUrl;
        this.queueName = data.queueUrl.substring(this.queueUrl.lastIndexOf('/') + 1);
    }

    ngOnInit() {
    }

    sendMessage() {
        this.dialogRef.close(this.message);
    }

    loadFromFile() {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        this.fileDialog.open(FileImportComponent, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.message = result;
            }
        });
    }

    close() {
        this.dialogRef.close(false);
    }
}
