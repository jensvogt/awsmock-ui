import {Component, Inject, OnInit} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatSnackBar} from "@angular/material/snack-bar";
import {saveAs} from "file-saver";

@Component({
    selector: 'export-file-download',
    templateUrl: './file-export.component.html',
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
    styleUrls: ['./file-export.component.scss'],
    providers: []
})
export class FileExportComponent implements OnInit {

    body: string = '';
    fileName: string | undefined = '';

    constructor(private snackBar: MatSnackBar, private dialogRef: MatDialogRef<FileExportComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.body = data;
    }

    ngOnInit(): void {
    }

    // Method to handle file upload
    download(): void {
        if (this.fileName) {
            const blob = new Blob([this.body], {type: "application/json"});
            saveAs(blob, this.fileName);
            this.snackBar.open("Infrastructure saved to local file: " + this.fileName, 'Done', {duration: 5000});
            this.dialogRef.close(true);
        }
    }
}
