import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
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
        MatLabel,
        FormsModule,
        MatInput,
        ReactiveFormsModule
    ],
    styleUrls: ['./bucket-add.component.scss']
})
export class BucketAddComponentDialog {

    bucketName: string = '';

    constructor(private readonly dialogRef: MatDialogRef<BucketAddComponentDialog>) {
    }

    save() {
        this.dialogRef.close(this.bucketName);
    }

    close() {
        this.dialogRef.close(false);
    }
}
