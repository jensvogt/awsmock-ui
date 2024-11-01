import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from "@angular/material/dialog";
import {Component, Inject, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatTextColumn} from "@angular/material/table";
import {MatInput} from "@angular/material/input";

@Component({
    selector: 'queue-add-dialog',
    templateUrl: './queue-add-component.html',
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
    styleUrls: ['./queue-add-component.scss']
})
export class QueueAddComponentDialog implements OnInit {

    // @ts-ignore
    form: FormGroup;
    queueName: string = '';

    constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<QueueAddComponentDialog>, @Inject(MAT_DIALOG_DATA) public portList: any) {
    }

    ngOnInit() {
        this.form = this.fb.group({
            queueName: [""],
        });
    }

    save() {
        console.log("Formdata: ", this.queueName);
        this.dialogRef.close(this.queueName);
    }

    close() {
        this.dialogRef.close(false);
    }
}