import {Component, Inject, OnInit, signal} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatList, MatListItem} from "@angular/material/list";
import {BinaryFileUploadComponent} from "../../../shared/binary-file-upload/binary-file-upload.component";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";
import {getVersion} from "../../../shared/version-utils.componen";

interface Runtime {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'lambda-function-upgrade',
    templateUrl: './function-upgrade-dialog.component.html',
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
        MatLabel,
        MatList,
        MatListItem,
        MatIcon,
        MatTooltip
    ],
    styleUrls: ['./function-upgrade-dialog.component.scss'],
    providers: [BinaryFileUploadComponent]
})
export class LambdaFunctionUpgradeDialog implements OnInit {

    file: File = {} as File;
    fileName: string | undefined;
    functionArn: string | undefined;
    version: string = "latest";
    uploadDisabled: boolean = true;
    uploadFocus: boolean = false;
    selectedFile: File | null = null;
    fileSize = signal(0);
    maxSize: number = 256 * 1024 * 1024;
    progress: number = 0;
    uploadSuccess: boolean = false;
    uploadError: boolean = false;

    constructor(private readonly snackBar: MatSnackBar, private readonly dialogRef: MatDialogRef<LambdaFunctionUpgradeDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.functionArn = data.functionArn;
    }

    ngOnInit() {
        this.dialogRef.updateSize("620px", "500px");
    }

    // Method to handle file upload Handler for file input change
    onFileChange(event: any): void {
        this.file = event.target.files[0];
        this.fileName = this.file.name;
        this.version = getVersion(this.fileName);
        this.uploadDisabled = !(this.version && this.fileName)
    }

    // Handler for file drop
    onFileDrop(event: DragEvent): void {
        event.preventDefault();
        if (event.dataTransfer) {
            this.file = event.dataTransfer.files[0];
            this.fileName = this.file.name;
            this.version = getVersion(this.fileName);
        }
        this.uploadDisabled = !(this.file && this.fileName && this.version?.length)
    }

    // Prevent default dragover behavior
    onDragOver(event: DragEvent): void {
        event.preventDefault();
    }

    onInputChanged(event: any) {
        this.uploadDisabled = !(this.file && this.fileName && this.version?.length)
        this.uploadFocus = true;
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
            reader.onloadend = () => {
                const content: any = reader.result;
                this.dialogRef.close({functionArn: this.functionArn, functionCode: content.split(',')[1], version: this.version});
            };
            //reader.addEventListener("progress", this.handleProgress);
            reader.readAsDataURL(file);

            this.uploadSuccess = true;
            this.uploadError = false;
        }
    }

    onUpgrade() {
        this.uploadFile(this.file);
    }

    handleProgress(event: ProgressEvent) {
        this.progress = (event.loaded / event.total) * 100;
    }
}

