import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, Inject} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";

@Component({
    selector: 'application-environment-edit-dialog',
    templateUrl: './application-environment-edit.component.html',
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
    styleUrls: ['./application-environment-edit.component.scss'],
})
export class ApplicationEnvironmentEditDialog {

    // @ts-ignore
    key: string = '';
    value: string = '';

    constructor(private readonly dialogRef: MatDialogRef<ApplicationEnvironmentEditDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.key = data.key;
        this.value = data.value;
    }

    save() {
        this.dialogRef.close({key: this.key, value: this.value});
    }
}
