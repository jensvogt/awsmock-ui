import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, Inject, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatTooltip} from "@angular/material/tooltip";

interface DataType {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'lambda-tag-edit-dialog',
    templateUrl: './function-tag-edit.component.html',
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
    styleUrls: ['./function-tag-edit.component.scss'],
})
export class LambdaTagEditDialog implements OnInit {

    // @ts-ignore
    form: FormGroup;
    key: string = '';
    value: string = '';

    constructor(private readonly fb: FormBuilder, private readonly dialogRef: MatDialogRef<LambdaTagEditDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.key = data.key;
        this.value = data.value;
    }

    ngOnInit() {
        this.form = this.fb.group({
            key: [""],
            value: [""]
        });
    }

    save() {
        this.dialogRef.close({Key: this.key, Value: this.value});
    }
}
