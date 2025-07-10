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
import {MatInput} from "@angular/material/input";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {KeyValuePipe, NgForOf} from "@angular/common";

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
        NgForOf
    ],
    styleUrls: ['./value-edit-component.scss']
})
export class SecretValueEditDialogComponent implements OnInit {

    valueObject: any;
    valueArray: SecretKeyValuePair[] = [];

    constructor(private dialogRef: MatDialogRef<SecretValueEditDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.valueObject = JSON.parse(data.secretString);
        for(let i of Object.keys(this.valueObject)) {
            this.valueArray.push({key:i, value: this.valueObject[i]});
        }
    }

    ngOnInit() {
    }

    save() {
        for(let i of this.valueArray) {
            this.valueObject[i.key]=i.value;
        }
        let result: string = JSON.stringify(this.valueObject);
        this.dialogRef.close(result);
    }
}
