import {Component, Inject} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatSnackBar} from "@angular/material/snack-bar";
import {saveAs} from "file-saver";

@Component({
    selector: 'export-file-download',
    templateUrl: './s3-object-download.component.html',
    standalone: true,
    imports: [
        FormsModule,
        MatButton,
        MatDialogActions,
        MatDialogClose,
        MatDialogContent,
        MatDialogTitle,
        MatFormField,
        MatInput,
        MatLabel
    ],
    styleUrls: ['./s3-object-download.component.scss'],
    providers: []
})
export class S3ObjectDownloadComponent {

    // Todo: Generate server download URL and send the file from there.
    body: string = '';
    fileName: string | undefined = '';

    constructor(private snackBar: MatSnackBar, private dialogRef: MatDialogRef<S3ObjectDownloadComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.body = data;
    }

    // Method to handle file upload
    download(): void {
        if (this.fileName) {
            const blob = new Blob([this.body], {type: "application/json"});
            saveAs(blob, this.fileName);
            this.snackBar.open("S3 object saved to local file: " + this.fileName, 'Done', {duration: 5000});
            this.dialogRef.close(true);
        }
    }
}
