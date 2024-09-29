import {
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from "@angular/material/dialog";
import {Component, OnInit} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatTextColumn} from "@angular/material/table";
import {MatInput} from "@angular/material/input";

@Component({
    selector: 'bucket-add-dialog',
    templateUrl: './bucket-add.component.html',
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
    styleUrls: ['./bucket-add.component.scss']
})
export class BucketAddComponentDialog implements OnInit {

    bucketName: string = '';

    constructor(private dialogRef: MatDialogRef<BucketAddComponentDialog>) {
    }

    ngOnInit() {
    }

    save() {
        this.dialogRef.close(this.bucketName);
    }

    close() {
        this.dialogRef.close(false);
    }
}
