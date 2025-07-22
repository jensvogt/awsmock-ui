import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, Inject} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatTooltip} from "@angular/material/tooltip";

interface DataType {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'lambda-environment-edit-dialog',
    templateUrl: './function-environment-edit.component.html',
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
        ReactiveFormsModule,
        MatTooltip
    ],
    styleUrls: ['./function-environment-edit.component.scss'],
})
export class LambdaEnvironmentEditDialog {

    key: string = '';
    value: string = '';

    constructor(private readonly dialogRef: MatDialogRef<LambdaEnvironmentEditDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.key = data.key;
        this.value = data.value;
    }

    save() {
        this.dialogRef.close({Key: this.key, Value: this.value});
    }
}
