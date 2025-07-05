import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, Inject} from "@angular/core";
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {SqsService} from "../service/sqs-service.component";
import {MatOption, MatSelect} from "@angular/material/select";

interface DataType {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'sqs-tag-add-dialog',
    templateUrl: './attribute-add.component.html',
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
    styleUrls: ['./attribute-add.component.scss'],
    providers: [SqsService]
})
export class SqsMessageAttributeAddDialog {

    // @ts-ignore
    form: FormGroup;
    key: string = '';
    value: string = '';

    dataTypes: DataType[] = [
        {value: 'String', viewValue: 'String'},
        {value: 'Number', viewValue: 'Number'},
        {value: 'Binary', viewValue: 'Binary'},
    ];
    selectedDataType: string = 'String';

    constructor(private readonly dialogRef: MatDialogRef<SqsMessageAttributeAddDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    save() {
        this.dialogRef.close({Key: this.key, Value: this.value, DataType: this.selectedDataType});
    }
}
