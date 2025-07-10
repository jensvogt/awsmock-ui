import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from "@angular/material/dialog";
import {Component, Inject, OnInit} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";

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
        ReactiveFormsModule
    ],
    styleUrls: ['./value-edit-component.scss']
})
export class SecretValueEditDialogComponent {

    valueArray: SecretKeyValuePair[] = [];

    constructor(private dialogRef: MatDialogRef<SecretValueEditDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        let valueObject = JSON.parse(data.secretString);
        for(let key of Object.keys(valueObject)) {
            this.valueArray.push({key: key, value: valueObject[key]});
        }
    }

    save() {
        let valueObject: any = {};
        for(let key of this.valueArray) {
            valueObject[key.key] = key.value;
        }
        this.dialogRef.close(JSON.stringify(valueObject));
    }
}
