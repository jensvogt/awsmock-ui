import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, Inject} from "@angular/core";
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {SqsService} from "../service/sqs-service.component";
import {MatOption, MatSelect} from "@angular/material/select";
import {SqsMessageAttribute} from "../model/sqs-message-item";

interface DataType {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'sqs-tag-add-dialog',
    templateUrl: './attribute-edit.component.html',
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
        MatSelect,
        MatOption
    ],
    styleUrls: ['./attribute-edit.component.scss'],
    providers: [SqsService]
})
export class SqsMessageAttributeEditDialog {

    // @ts-ignore
    form: FormGroup;
    attribute: SqsMessageAttribute;
    name: string = '';
    value: string = '';

    dataTypes: DataType[] = [
        {value: 'String', viewValue: 'String'},
        {value: 'StringList', viewValue: 'StringList'},
        {value: 'Binary', viewValue: 'Binary'},
        {value: 'BinaryList', viewValue: 'BinaryList'},
    ];
    selectedDataType: string = 'String';

    constructor(private dialogRef: MatDialogRef<SqsMessageAttributeEditDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.attribute = data.attribute;
        this.name = data.attribute.name;
        this.selectedDataType = data.attribute.dataType;
        if (data.attribute.dataType === "String") {
            this.value = data.attribute.stringValue;
        }
    }

    save() {
        this.dialogRef.close({attribute: this.attribute});
    }
}
