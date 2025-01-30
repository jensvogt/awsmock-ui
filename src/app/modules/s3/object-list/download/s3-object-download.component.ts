import {Component, Inject} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatSnackBar} from "@angular/material/snack-bar";
import {saveAs} from "file-saver";
import {S3Service} from "../../service/s3-service.component";

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
    bucket: string = '';
    key: string = '';
    fileName: string = '';

    constructor(private snackBar: MatSnackBar, private dialogRef: MatDialogRef<S3ObjectDownloadComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private s3Service: S3Service) {
        this.bucket = data.bucketName;
        this.key = data.key;
        this.fileName = this.key.substring(this.key.lastIndexOf('/'));
    }

    // Method to handle file upload
    download(): void {
        if (this.fileName) {

            this.s3Service.getObject(this.bucket, this.key).then((data: any) => {
                data.Body.transformToByteArray().then((data: any) => {
                    const blob = new Blob([data], {type: data.ContentType});
                    saveAs(blob, this.fileName);
                    this.dialogRef.close(this.fileName);
                });
            });
        }
    }
}
