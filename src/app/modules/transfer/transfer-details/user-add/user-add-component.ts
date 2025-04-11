import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, Inject, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";

@Component({
    selector: 'user-add-dialog',
    templateUrl: './user-add-component.html',
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
    styleUrls: ['./user-add-component.scss']
})
export class UserAddComponentDialog implements OnInit {

    // @ts-ignore
    form: FormGroup;
    username: string = '';
    password: string = '';

    constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<UserAddComponentDialog>, @Inject(MAT_DIALOG_DATA) public portList: any) {
    }

    ngOnInit() {
        this.form = this.fb.group({
            queueName: [""],
        });
    }

    save() {
        this.dialogRef.close({username: this.username, password: this.password});
    }

    close() {
        this.dialogRef.close(false);
    }
}
