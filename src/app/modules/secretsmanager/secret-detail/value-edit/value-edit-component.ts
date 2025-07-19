import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, Inject} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";

interface SecretKeyValuePair {
    key: string,
    value: string
}

@Component({
    selector: 'secret-value-edit-dialog',
    templateUrl: './value-edit-component.html',
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
        CdkTextareaAutosize
    ],
    styleUrls: ['./value-edit-component.scss']
})
export class SecretValueEditDialogComponent {

    valueArray: SecretKeyValuePair[] = [];
    valueJson: string | undefined;

    constructor(private readonly snackBar: MatSnackBar, private readonly dialogRef: MatDialogRef<SecretValueEditDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        if (data.secretString.length > 0) {
            if (!this.getValueArray(data)) {
                this.valueJson = data.secretString;
            }
        } else {
            this.snackBar.open("Empty secret string", 'Done', {duration: 5000});
        }
    }

    save() {
        let valueObject: any = {};
        if (this.valueJson) {
            valueObject = JSON.parse(this.valueJson);
        } else {
            for (let key of this.valueArray) {
                valueObject[key.key] = key.value;
            }
        }
        this.dialogRef.close(JSON.stringify(valueObject));
    }

    getValueArray(data: any): boolean {
        try {
            let valueObject = JSON.parse(data.secretString);
            for (let key of Object.keys(valueObject)) {
                this.valueArray.push({key: key, value: valueObject[key]});
            }
        } catch (err: unknown) {
            console.error(err);
            return false;
        }
        return true;
    }
}
