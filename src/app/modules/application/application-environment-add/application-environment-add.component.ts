import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, Inject, OnInit} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";

@Component({
    selector: 'application-environment-add-dialog',
    templateUrl: './application-environment-add.component.html',
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
    styleUrls: ['./application-environment-add.component.scss'],
})
export class ApplicationEnvironmentAddDialog implements OnInit {

    // @ts-ignore
    key: string = '';
    value: string = '';

    constructor(private readonly dialogRef: MatDialogRef<ApplicationEnvironmentAddDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit() {
    }

    save() {
        this.dialogRef.close({Key: this.key, Value: this.value});
    }
}
