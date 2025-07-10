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
export class SecretValueEditDialogComponent implements OnInit {

    valueObject: any;

    constructor(private dialogRef: MatDialogRef<SecretValueEditDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.valueObject = JSON.parse(data.secretString);
        console.log("Dialog valueObject: ", this.valueObject);
    }

    ngOnInit() {
    }

    save() {
        let result: any = {};
        this.dialogRef.close(result);
    }
}
