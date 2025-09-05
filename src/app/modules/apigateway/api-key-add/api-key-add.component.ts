import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {AddApiKeyRequest} from "../model/api-key-item";
import {MatInput} from "@angular/material/input";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";

@Component({
    selector: 'api-key-add-component',
    templateUrl: './api-key-add.component.html',
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
        ReactiveFormsModule,
        MatInput,
        MatSlideToggle,
        CdkTextareaAutosize
    ],
    styleUrls: ['./api-key-add.component.scss']
})
export class KeyAddComponentDialog {

    name: string = '';
    description: string = '';
    value: string = '';
    enabled: boolean = true;
    addKeyRequest: AddApiKeyRequest = {} as AddApiKeyRequest;

    constructor(private readonly dialogRef: MatDialogRef<KeyAddComponentDialog>) {
    }

    save() {
        this.addKeyRequest = {name: this.name, description: this.description, value: this.value, enabled: this.enabled}
        this.dialogRef.close(this.addKeyRequest);
    }
}
