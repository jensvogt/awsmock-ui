import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, Inject, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {SqsService} from "../../../sqs/service/sqs-service.component";

@Component({
    selector: 'tag-add-dialog',
    templateUrl: './tag-add.component.html',
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
    styleUrls: ['./tag-add.component.scss'],
    providers: [SqsService]
})
export class TagAddComponentDialog implements OnInit {

    // @ts-ignore
    form: FormGroup;
    topicArn: string = '';
    topicName: string = '';
    key: string = '';
    value: string = '';

    constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<TagAddComponentDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.topicArn = data.topicArn;
        this.topicName = data.topicName;
    }

    ngOnInit() {
        this.form = this.fb.group({
            key: [""],
            value: [""]
        });
    }

    save() {
        this.dialogRef.close({topicArn: this.topicArn, key: this.key, value: this.value});
    }

    close() {
        this.dialogRef.close(false);
    }
}
