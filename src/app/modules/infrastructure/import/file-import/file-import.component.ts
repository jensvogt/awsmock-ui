import {Component, ElementRef, Inject, signal, ViewChild} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle} from "@angular/material/card";
import {MatButton, MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatTooltip} from "@angular/material/tooltip";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgIf, NgOptimizedImage} from "@angular/common";

@Component({
    selector: 'import-file-component',
    templateUrl: './file-import.component.html',
    standalone: true,
    imports: [
        MatCard,
        MatCardHeader,
        MatCardContent,
        MatCardActions,
        MatCardSubtitle,
        MatIcon,
        MatIconButton,
        MatTooltip,
        FormsModule,
        MatButton,
        MatDialogActions,
        MatDialogClose,
        MatDialogContent,
        MatDialogTitle,
        MatFormField,
        MatInput,
        MatLabel,
        MatMiniFabButton,
        NgIf,
        NgOptimizedImage
    ],
    styleUrls: ['./file-import.component.scss'],
})
export class FileImportComponent {

    imageName = signal('');
    fileSize = signal(0);
    uploadProgress = signal(0);
    imagePreview = signal('');
    @ViewChild('fileInput') fileInput: ElementRef | undefined;
    selectedFile: File | null = null;
    uploadSuccess: boolean = false;
    uploadError: boolean = false;

    constructor(private snackBar: MatSnackBar, private dialogRef: MatDialogRef<FileImportComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    // Method to handle file upload
    // Handler for file input change
    onFileChange(event: any): void {
        const file = event.target.files[0] as File | null;
        this.uploadFile(file);
    }

    // Handler for file drop
    onFileDrop(event: DragEvent): void {
        event.preventDefault();
        const file = event.dataTransfer?.files[0] as File | null;
        this.uploadFile(file);
    }

    // Prevent default dragover behavior
    onDragOver(event: DragEvent): void {
        event.preventDefault();
    }

    // Method to handle file upload
    uploadFile(file: File | null): void {
        if (file && file.type.startsWith('application/json')) {
            this.selectedFile = file;
            this.fileSize.set(Math.round(file.size / 1024)); // Set file size in KB

            const reader = new FileReader();
            reader.onload = () => {
                this.dialogRef.close(reader.result as string);
            };
            reader.readAsText(file);

            this.uploadSuccess = true;
            this.uploadError = false;
        } else {
            this.uploadSuccess = false;
            this.uploadError = true;
            this.snackBar.open('Only JSON files are supported!', 'Close', {duration: 3000, panelClass: 'error'});
        }
    }

    // Method to remove the uploaded files
    removeFile(): void {
        this.selectedFile = null;
        this.imageName.set('');
        this.fileSize.set(0);
        this.imagePreview.set('');
        this.uploadSuccess = false;
        this.uploadError = false;
        this.uploadProgress.set(0);
    }
}
