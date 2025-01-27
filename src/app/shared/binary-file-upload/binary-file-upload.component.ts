import {Component, ElementRef, Inject, signal, ViewChild} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MAT_DIALOG_DATA, MatDialogContent} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Subject} from "rxjs";


@Component({
    selector: 'binary-file-upload-component',
    templateUrl: './binary-file-upload.component.html',
    standalone: true,
    imports: [
        MatIcon,
        FormsModule,
        MatDialogContent,

    ],
    styleUrls: ['./binary-file-upload.component.scss'],
})
export class BinaryFileUploadComponent {

    fileSize = signal(0);
    @ViewChild('fileInput') fileInput: ElementRef | undefined;
    selectedFile: File | null = null;
    uploadSuccess: boolean = false;
    uploadError: boolean = false;
    extensions: string[] | undefined;
    contentSubject$ = new Subject<string>(); // import { Subject } from rxjs
    content$ = this.contentSubject$.asObservable()

    constructor(private snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any) {
        if (data && data.extensions) {
            this.extensions = data.extensions;
        }
    }

    // Method to handle file upload. Handler for file input change
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
        console.log("file.type: ", file?.name)
        if (file && (this.checkFileName(file.name))) {
            this.selectedFile = file;
            this.fileSize.set(Math.round(file.size / 1024)); // Set file size in KB

            const reader = new FileReader();
            reader.onload = () => {
                const content: any = reader.result;
                //this.content$ = content.split(',')[1];
                this.contentSubject$.next(content.split(',')[1]);
            };
            reader.readAsDataURL(file);

            this.uploadSuccess = true;
            this.uploadError = false;

        } else {

            this.uploadSuccess = false;
            this.uploadError = true;
            this.snackBar.open('Only JSON or BSON files are supported!', 'Close', {duration: 3000, panelClass: 'error'});
        }
    }

    getFileTypes(): string[] {
        if ((!this.extensions || this.extensions.length === 0)) {
            return ["*.*"];
        }
        return this.extensions;
    }

    private checkFileName(fileName: string): boolean {
        if (!this.extensions || this.extensions.length === 0) {
            return true;
        }
        return this.extensions.includes(fileName.toLowerCase().substring(fileName.lastIndexOf('.')));
    }
}
