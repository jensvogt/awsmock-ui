import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, Inject, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";

@Component({
    selector: 'lambda-environment-add-dialog',
    templateUrl: './function-environment-add.component.html',
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
    styleUrls: ['./function-environment-add.component.scss'],
})
export class LambdaEnvironmentAddDialog implements OnInit {

    // @ts-ignore
    form: FormGroup;
    key: string = '';
    value: string = '';

    constructor(private readonly fb: FormBuilder, private readonly dialogRef: MatDialogRef<LambdaEnvironmentAddDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
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
