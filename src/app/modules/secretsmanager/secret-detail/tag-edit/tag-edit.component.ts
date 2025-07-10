import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, Inject, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";

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
    providers: []
})
export class SqsTagEditDialog implements OnInit {

    // @ts-ignore
    form: FormGroup;
    queueUrl: string = '';
    queueName: string = '';
    tagKey: string = '';
    tagValue: string = '';

    constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<SqsTagEditDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.queueUrl = data.queueUrl;
        this.queueName = data.queueName;
        this.tagKey = data.tagKey;
        this.tagValue = data.tagValue;
    }

    ngOnInit() {
        this.form = this.fb.group({
            key: [""],
            value: [""]
        });
    }

    save() {
        this.dialogRef.close({queueUrl: this.queueUrl, tagKey: this.tagKey, tagValue: this.tagValue});
    }

    close() {
        this.dialogRef.close(false);
    }
}
