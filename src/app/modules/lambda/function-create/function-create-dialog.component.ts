import {Component, ElementRef, Inject, OnInit, signal, ViewChild} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatSnackBar} from "@angular/material/snack-bar";
import {byteConversion} from "../../../shared/byte-utils.component";
import {MatProgressBar} from "@angular/material/progress-bar";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatList, MatListItem} from "@angular/material/list";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {MatIcon} from "@angular/material/icon";
import {getVersion} from "../../../shared/version-utils.componen";

interface Runtime {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'lambda-function-create',
    templateUrl: './function-create-dialog.component.html',
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
        MatProgressBar,
        MatGridList,
        MatGridTile,
        MatList,
        MatListItem,
        MatOption,
        MatSelect,
        CdkTextareaAutosize,
        MatIcon
    ],
    styleUrls: ['./function-create-dialog.component.scss']
})
export class LambdaFunctionCreateDialog implements OnInit {

    file: File = {} as File;
    fileName: string | undefined;
    functionName: string | undefined;
    handlerName: string | undefined;
    memorySize: number = 512;
    version: string = 'latest';
    timeout: number = 3600;
    jsonEnvironment: string | undefined;
    jsonTags: string | undefined;
    createDisabled: boolean = true;
    progress: number = 0;
    fileSize = signal(0);
    maxSize: number = 256 * 1024 * 1024;
    @ViewChild('fileInput') fileInput: ElementRef | undefined;
    selectedFile: File | null = null;
    uploadSuccess: boolean = false;
    uploadError: boolean = false;

    // Runtime
    selectedRuntime: string = 'java21';
    runtimes: Runtime[] = [
        {value: 'java11', viewValue: 'Java 11'},
        {value: 'java17', viewValue: 'Java 17'},
        {value: 'java21', viewValue: 'Java 21'},
        {value: 'python3.8', viewValue: 'Python 3.8'},
        {value: 'python3.9', viewValue: 'Python 3.9'},
        {value: 'python3.10', viewValue: 'Python 3.10'},
        {value: 'python3.11', viewValue: 'Python 3.11'},
        {value: 'python3.12', viewValue: 'Python 3.12'},
        {value: 'provided.al2', viewValue: 'Provided AL2'},
        {value: 'provided.al2023', viewValue: 'Provided AL2023'},
        {value: 'provided.latest', viewValue: 'Provided Latest'},
        {value: 'nodejs20.x', viewValue: 'NodeJS 20'},
        {value: 'go', viewValue: 'Go'},
    ];

    // Byte conversion
    protected readonly byteConversion = byteConversion;

    constructor(private readonly snackBar: MatSnackBar, private readonly dialogRef: MatDialogRef<LambdaFunctionCreateDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit() {
        this.dialogRef.updateSize("1400px", "630px");
    }

    // Method to handle file upload Handler for file input change
    onFileChange(event: any): void {
        this.file = event.target.files[0];
        this.fileName = this.file.name;
        this.version = getVersion(this.fileName)
        this.createDisabled = !(this.functionName && this.fileName && this.handlerName && this.selectedRuntime)
    }

    // Handler for file drop
    onFileDrop(event: DragEvent): void {
        event.preventDefault();
        if (event.dataTransfer) {
            this.file = event.dataTransfer.files[0];
            this.fileName = this.file.name;
            this.version = getVersion(this.fileName)
        }
        this.createDisabled = !(this.file && this.fileName)
    }

    // Prevent default dragover behavior
    onDragOver(event: DragEvent): void {
        event.preventDefault();
    }

    onInputChanged(event: any) {
        this.createDisabled = !(this.functionName && this.fileName && this.handlerName && this.selectedRuntime)
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
                const content: any = reader.result;
                this.dialogRef.close({
                    content: content.split(',')[1], functionName: this.functionName, fileName: this.fileName, handler: this.handlerName, version: this.version,
                    runtime: this.selectedRuntime, memorySize: this.memorySize, timeout: this.timeout, jsonEnvironment: this.jsonEnvironment
                });
            };
            reader.addEventListener("progress", this.handleProgress);
            reader.readAsDataURL(file);

            this.uploadSuccess = true;
            this.uploadError = false;
        }
    }

    doCreate() {
        this.uploadFile(this.file);
    }

    handleProgress(event: ProgressEvent) {
        this.progress = (event.loaded / event.total) * 100;
    }
}

