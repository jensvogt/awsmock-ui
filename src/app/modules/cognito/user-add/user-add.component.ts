import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, OnInit} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";

@Component({
    selector: 'user-add-dialog',
    templateUrl: './user-add.component.html',
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
    styleUrls: ['./user-add.component.scss']
})
export class UserAddComponentDialog implements OnInit {

    userName: string = '';

    constructor(private dialogRef: MatDialogRef<UserAddComponentDialog>) {
    }

    ngOnInit() {
    }

    save() {
        this.dialogRef.close(this.userName);
    }

    close() {
        this.dialogRef.close(false);
    }
}
