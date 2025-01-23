import {Component, ElementRef, Inject, signal, ViewChild} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatSnackBar} from "@angular/material/snack-bar";
import {byteConversion} from "../../../shared/byte-utils.component";
import {MatProgressBar} from "@angular/material/progress-bar";

@Component({
    selector: 's3-object-upload',
    templateUrl: './object-upload.component.html',
    standalone: true,
    imports: [
        MatIcon,
        FormsModule,
        MatButton,
        MatDialogActions,
        MatDialogClose,
        MatDialogContent,
        MatDialogTitle,
        MatFormField,
        MatInput,
        MatLabel,
        MatProgressBar
    ],
    styleUrls: ['./object-upload.component.scss']
})
export class ObjectUploadComponent {

    key: string = '';
    bucketName: string = '';
    file: File = {} as File;
    fileName: string = '';
    uploadDisabled: boolean = true;
    progress: number = 0;
    fileSize = signal(0);
    maxSize: number = 256 * 1024 * 1024;
    @ViewChild('fileInput') fileInput: ElementRef | undefined;
    selectedFile: File | null = null;
    uploadSuccess: boolean = false;
    uploadError: boolean = false;
    protected readonly byteConversion = byteConversion;

    constructor(private snackBar: MatSnackBar, private dialogRef: MatDialogRef<ObjectUploadComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.bucketName = data.bucketName;
    }

    // Method to handle file upload
    // Handler for file input change
    onFileChange(event: any): void {
        this.file = event.target.files[0];
        this.fileName = this.file.name;
        this.key = this.file.name;
        this.uploadDisabled = !(this.file && this.key && this.fileName)
    }

    onFileNameChange(): void {
        this.uploadDisabled = !(this.file && this.key && this.fileName)
    }

    // Handler for file drop
    onFileDrop(event: DragEvent): void {
        event.preventDefault();
        if (event.dataTransfer) {
            this.file = event.dataTransfer.files[0];
            this.fileName = this.file.name;
            this.key = this.file.name;
            this.uploadDisabled = !(this.file && this.key && this.fileName)
        }
    }

    // Prevent default dragover behavior
    onDragOver(event: DragEvent): void {
        event.preventDefault();
    }

    // Method to handle file upload
    uploadFile(file: File | null): void {
        if (file) {
            this.selectedFile = file;
            this.fileSize.set(Math.round(file.size / 1024)); // Set file size in KB

            if (file.size > this.maxSize) {
                const fileSizeInMegaBytes = (file.size / 1024 / 1024).toFixed(0);
                this.snackBar.open("File size is " + fileSizeInMegaBytes + "MB. Max size is 256MB, use the AWS CLI instead.", "Error", {duration: 5000});
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                this.dialogRef.close({content: new Blob([reader.result as ArrayBuffer]), key: this.key});
            };
            reader.addEventListener("progress", this.handleProgress);
            reader.readAsText(file);

            this.uploadSuccess = true;
            this.uploadError = false;
        }
    }

    doUpload() {
        this.uploadFile(this.file);
    }

    handleProgress(event: ProgressEvent) {
        this.progress = (event.loaded / event.total) * 100;
    }
}

