import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, Inject, OnInit} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {KmsService} from "../../kms/service/kms-service.component";


interface DataType {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'parameter-edit-dialog',
    templateUrl: './parameter-edit-component.html',
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
        CdkTextareaAutosize,
        MatOption,
        MatSelect
    ],
    styleUrls: ['./parameter-edit-component.scss']
})
export class ParameterEditDialogComponent implements OnInit {

    // @ts-ignore
    parameterName: string = '';
    parameterValue: string = '';
    description: string = '';
    kmsKeys: string[] = [];
    selectedKmsKeyArn: string = '';
    parameter: any = {};

    dataTypes: DataType[] = [
        {value: 'String', viewValue: 'String'},
        {value: 'StringList', viewValue: 'String List'},
        {value: 'SecureString', viewValue: 'Secure String'},
    ];
    selectedDataType: string = 'String';

    constructor(private readonly dialogRef: MatDialogRef<ParameterEditDialogComponent>, private readonly kmsService: KmsService, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.parameterName = data.Name;
        this.parameterValue = data.Value;
        this.selectedKmsKeyArn = data.Type;
        this.description = data.Description;
        this.selectedDataType = data.Type;
        this.selectedKmsKeyArn = data.KmsKeyArn;
    }

    ngOnInit(): void {
        this.kmsService.listKeyArns().subscribe((data: any) => {
            this.kmsKeys = data.keyArns;
        });
    }

    arnSelectionChanged(event: any) {
        this.selectedKmsKeyArn = event.value;
    }

    save() {
        let result: any = {};
        result.name = this.parameterName;
        result.value = this.parameterValue;
        result.description = this.description;
        result.type = this.selectedDataType;
        result.kmsKeyArn = this.selectedKmsKeyArn;
        this.dialogRef.close(result);
    }
}
