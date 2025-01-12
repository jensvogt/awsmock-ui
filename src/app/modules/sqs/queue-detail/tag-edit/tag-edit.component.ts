import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, Inject, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {SqsService} from "../../../sqs/service/sqs-service.component";

@Component({
    selector: 'tag-edit-dialog',
    templateUrl: './tag-edit.component.html',
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
    styleUrls: ['./tag-edit.component.scss'],
    providers: [SqsService]
})
export class SqsTagEditDialog implements OnInit {

    // @ts-ignore
    form: FormGroup;
    queueUrl: string = '';
    queueName: string = '';
    key: string = '';
    value: string = '';

    constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<SqsTagEditDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.queueUrl = data.queueUrl;
        this.queueName = data.queueName;
        this.key = data.key;
        this.value = data.value;
    }

    ngOnInit() {
        this.form = this.fb.group({
            key: [""],
            value: [""]
        });
    }

    save() {
        this.dialogRef.close({queueUrl: this.queueUrl, key: this.key, value: this.value});
    }

    close() {
        this.dialogRef.close(false);
    }
}
