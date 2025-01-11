import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, OnInit} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";

@Component({
    selector: 'user-pool-add-dialog',
    templateUrl: './user-pool-add.component.html',
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
    styleUrls: ['./user-pool-add.component.scss']
})
export class UserPoolAddComponentDialog implements OnInit {

    userPoolName: string = '';

    constructor(private dialogRef: MatDialogRef<UserPoolAddComponentDialog>) {
    }

    ngOnInit() {
    }

    save() {
        this.dialogRef.close(this.userPoolName);
    }

    close() {
        this.dialogRef.close(false);
    }
}
