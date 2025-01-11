import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, Inject, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
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
        MatLabel,
        FormsModule,
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
        this.dialogRef.close(this.queueName);
    }

    close() {
        this.dialogRef.close(false);
    }
}
