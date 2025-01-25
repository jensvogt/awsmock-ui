import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, Inject} from "@angular/core";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
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
    key: string = '';
    value: string = '';

    dataTypes: DataType[] = [
        {value: 'String', viewValue: 'String'},
        {value: 'Number', viewValue: 'Number'},
        {value: 'Binary', viewValue: 'Binary'},
    ];
    selectedDataType: string = 'String';

    constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<SqsMessageAttributeEditDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.attribute = data.attribute;
        this.key = data.attribute.Key;
        this.value = data.attribute.Value;
        this.selectedDataType = data.attribute.DataType;
    }

    save() {
        this.dialogRef.close({attribute: this.attribute});
    }
}
