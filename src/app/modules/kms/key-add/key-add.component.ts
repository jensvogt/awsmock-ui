import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, Inject} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {KmsKeyAddRequest} from "../model/key-add-request";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {MatInput} from "@angular/material/input";

export interface ViewValueType {
    value: string;
    viewValue: string;
}

const KeyUsage: Array<ViewValueType> = [
    {value: 'SIGN_VERIFY', viewValue: 'SIGN_VERIFY'},
    {value: 'ENCRYPT_DECRYPT', viewValue: 'ENCRYPT_DECRYPT'},
    {value: 'GENERATE_VERIFY_MAC', viewValue: 'GENERATE_VERIFY_MAC'},
    {value: 'KEY_AGREEMENT', viewValue: 'KEY_AGREEMENT'},
];

const KeySpec: Array<ViewValueType> = [
    {value: 'SYMMETRIC_DEFAULT', viewValue: 'SYMMETRIC_DEFAULT'},
    {value: 'RSA_2048', viewValue: 'RSA_2048'},
    {value: 'RSA_3072', viewValue: 'RSA_3072'},
    {value: 'RSA_4096', viewValue: 'RSA_4096'},
    {value: 'HMAC_224', viewValue: 'HMAC_224'},
    {value: 'HMAC_256', viewValue: 'HMAC_256'},
    {value: 'HMAC_384', viewValue: 'HMAC_384'},
    {value: 'HMAC_512', viewValue: 'HMAC_512'},
];

const Origin: Array<ViewValueType> = [
    {value: 'AWS_KMS', viewValue: 'AWS_KMS'},
    {value: 'EXTERNAL', viewValue: 'EXTERNAL'},
    {value: 'AWS_CLOUDHSM', viewValue: 'AWS_CLOUDHSM'},
    {value: 'EXTERNAL_KEY_STORE', viewValue: 'EXTERNAL_KEY_STORE'},
];

@Component({
    selector: 'kms-key-add-component',
    templateUrl: './key-add.component.html',
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
        MatOption,
        MatSelect,
        CdkTextareaAutosize,
        MatInput
    ],
    styleUrls: ['./key-add.component.scss']
})
export class KeyAddComponentDialog {

    keyUsage: string = '';
    selectedKeyUsage: string = 'ENCRYPT_DECRYPT';
    selectedKeySpec: string = 'SYMMETRIC_DEFAULT';
    selectedOrigin: string = 'AWS_KMS';
    keyAddRequest: KmsKeyAddRequest = {keyUsage: '', keySpec: '', description: '', origin: ''};
    description: string = '';
    enabled: boolean = false;

    protected readonly KeyUsage = KeyUsage;
    protected readonly KeySpec = KeySpec;
    protected readonly Origin = Origin;

    constructor(private readonly dialogRef: MatDialogRef<KeyAddComponentDialog>, @Inject(MAT_DIALOG_DATA) public portList: any) {
    }

    save() {
        this.keyAddRequest = {keySpec: this.selectedKeySpec, keyUsage: this.selectedKeyUsage, description: this.description, origin: this.selectedOrigin}
        this.dialogRef.close(this.keyAddRequest);
    }
}
