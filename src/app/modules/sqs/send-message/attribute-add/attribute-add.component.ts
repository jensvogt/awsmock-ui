import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, Inject, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {SqsService} from "../../service/sqs-service.component";
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
export class SqsMessageAttributeAddDialog implements OnInit {

    // @ts-ignore
    form: FormGroup;
    key: string = '';
    value: string = '';

    dataTypes: DataType[] = [
        {value: 'string', viewValue: 'String'},
        {value: 'number', viewValue: 'Number'},
        {value: 'binary', viewValue: 'Binary'},
    ];
    selectedDataType: string = 'string';

    constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<SqsMessageAttributeAddDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit() {
        this.form = this.fb.group({
            key: [""],
            value: [""]
        });
    }

    save() {
        this.dialogRef.close({Key: this.key, Value: this.value, DataType: this.selectedDataType});
    }
}
