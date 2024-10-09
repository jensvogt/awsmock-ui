import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, Inject, OnInit} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatTextColumn} from "@angular/material/table";
import {MatInput} from "@angular/material/input";

@Component({
    selector: 'module-selection-dialog',
    templateUrl: './module-selection.component.html',
    standalone: true,
    imports: [
        MatDialogContent,
        MatDialogTitle,
        MatDialogActions,
        MatButton,
        MatDialogClose,
        MatFormField,
        MatSelect,
        MatOption,
        MatLabel,
        FormsModule,
        MatTextColumn,
        MatInput,
        ReactiveFormsModule
    ],
    styleUrls: ['./module-selection.component.scss']
})
export class ModuleSelectionComponentDialog implements OnInit {

    queueName: string = '';

    constructor(private dialogRef: MatDialogRef<ModuleSelectionComponentDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit() {
    }

    save() {
        console.log("Formdata: ", this.queueName);
        this.dialogRef.close(this.queueName);
    }

    close() {
        this.dialogRef.close(false);
    }
}
