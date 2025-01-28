import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, Inject} from "@angular/core";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {SqsService} from "../../../sqs/service/sqs-service.component";

@Component({
    selector: 'dlq-edit-dialog',
    templateUrl: './dlq-edit.component.html',
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
        ReactiveFormsModule
    ],
    styleUrls: ['./dlq-edit.component.scss'],
    providers: [SqsService]
})
export class SqsDqlEditDialog {

    // @ts-ignore
    form: FormGroup;
    queueArn: string = '';
    targetArn: string = '';
    retries: number = 0;

    constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<SqsDqlEditDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.queueArn = data.queueArn;
        this.targetArn = data.targetArn;
        this.retries = data.retries;
    }

    save() {
        this.dialogRef.close({queueArn: this.queueArn, targetArn: this.targetArn, retries: this.retries});
    }

    close() {
        this.dialogRef.close(false);
    }
}
