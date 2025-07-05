import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, OnInit} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {KmsService} from "../../kms/service/kms-service.component";
import {NgIf} from "@angular/common";

interface DataType {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'parameter-add-dialog',
    templateUrl: './parameter-add-component.html',
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
        MatSelect,
        NgIf
    ],
    styleUrls: ['./parameter-add-component.scss']
})
export class ParameterAddDialogComponent implements OnInit {

    // @ts-ignore
    parameterName: string = '';
    parameterValue: string = '';
    description: string = '';
    kmsKeys: string[] = [];
    selectedKmsKeyArn: string = '';

    dataTypes: DataType[] = [
        {value: 'String', viewValue: 'String'},
        {value: 'StringList', viewValue: 'String List'},
        {value: 'SecureString', viewValue: 'Secure String'},
    ];
    selectedDataType: string = 'String';

    constructor(private readonly dialogRef: MatDialogRef<ParameterAddDialogComponent>, private readonly kmsService: KmsService) {
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
