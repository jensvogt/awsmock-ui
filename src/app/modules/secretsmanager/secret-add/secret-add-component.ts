import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";

@Component({
    selector: 'secret-add-dialog',
    templateUrl: './secret-add-component.html',
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
    styleUrls: ['./secret-add-component.scss']
})
export class SecretAddDialogComponent implements OnInit {

    // @ts-ignore
    form: FormGroup;
    secretName: string = '';
    username: string = '';
    password: string = '';
    description: string = '';

    constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<SecretAddDialogComponent>) {
    }

    ngOnInit() {
        this.form = this.fb.group({
            secretName: [""],
        });
    }

    save() {
        let usernamePassword: any = {username: this.username, password: this.password};
        let result: any = {};
        result.Name = this.secretName;
        result.Description = this.description;
        result.SecretString = JSON.stringify(usernamePassword);
        this.dialogRef.close(result);
    }
}
