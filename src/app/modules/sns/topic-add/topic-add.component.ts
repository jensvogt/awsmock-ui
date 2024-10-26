import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from "@angular/material/dialog";
import {Component, Inject, OnInit} from "@angular/core";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatTextColumn} from "@angular/material/table";
import {MatInput} from "@angular/material/input";

@Component({
    selector: 'add-connection-dialog',
    templateUrl: './topic-add.component.html',
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
        ReactiveFormsModule
    ],
    styleUrls: ['./topic-add.component.scss']
})
export class TopicAddComponentDialog implements OnInit {

    // @ts-ignore
    topicName: string = '';

    constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<TopicAddComponentDialog>, @Inject(MAT_DIALOG_DATA) public portList: any) {
    }

    ngOnInit() {
    }

    save() {
        this.dialogRef.close(this.topicName);
    }

    close() {
        this.dialogRef.close(false);
    }
}
