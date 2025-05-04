import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, Inject, OnInit} from "@angular/core";
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
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
export class TagEditComponentDialog implements OnInit {

    // @ts-ignore
    form: FormGroup;
    topicArn: string = '';
    topicName: string = '';
    tagKey: string = '';
    tagValue: string = '';

    constructor(private dialogRef: MatDialogRef<TagEditComponentDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.topicArn = data.topicArn;
        this.topicName = data.topicName;
        this.tagKey = data.tagKey;
        this.tagValue = data.tagValue;
    }

    ngOnInit() {
    }

    save() {
        this.dialogRef.close({topicArn: this.topicArn, tagKey: this.tagKey, tagValue: this.tagValue});
    }

    close() {
        this.dialogRef.close(false);
    }
}
