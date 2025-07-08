import {Component, ElementRef, Inject, OnInit, signal, ViewChild} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatSnackBar} from "@angular/material/snack-bar";
import {byteConversion} from "../../../shared/byte-utils.component";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatList, MatListItem} from "@angular/material/list";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {MatIcon} from "@angular/material/icon";
import {MatCard, MatCardActions, MatCardContent} from "@angular/material/card";
import {MatTab, MatTabChangeEvent, MatTabGroup} from "@angular/material/tabs";

interface Runtime {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'application-add',
    templateUrl: './application-add-dialog.component.html',
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
        MatGridList,
        MatGridTile,
        MatList,
        MatListItem,
        MatOption,
        MatSelect,
        MatIcon,
        MatCard,
        MatCardActions,
        MatCardContent,
        MatTab,
        MatTabGroup
    ],
    styleUrls: ['./application-add-dialog.component.scss']
})
export class ApplicationAddDialog implements OnInit {

    file: File = {} as File;
    fileName: string | undefined;
    name: string | undefined;
    version: string | undefined;
    memorySize: number = 512;
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

    // Environment
    // environmentColumns: string[] = ['key', 'value', 'actions'];
    // evironments: Observable<LambdaEnvironmentCountersResponse> = this.store.select(selectEnvironment);
    // environmentPageSize$: Observable<number> = this.store.select(selectEnvironmentPageSize);
    // environmentPageIndex$: Observable<number> = this.store.select(selectEnvironmentPageIndex);
    // environmentPageSizeOptions = [5, 10, 20, 50, 100];

    // Byte conversion
    protected readonly byteConversion = byteConversion;

    constructor(private readonly snackBar: MatSnackBar, private readonly dialogRef: MatDialogRef<ApplicationAddDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit() {
        this.dialogRef.updateSize("1400px", "1000px");
    }

    tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
        switch (tabChangeEvent.index) {
            case 0:
                //this.loadAttributes();
                break;
            case 1:
                //this.loadLambdaTrigger();
                break;
            case 3:
                //this.loadTags();
                break;
            case 4:
                //this.loadDefaultMessageAttributes();
                break;
        }
    }

    // Method to handle file upload Handler for file input change
    onFileChange(event: any): void {
        this.file = event.target.files[0];
        this.fileName = this.file.name;
        this.createDisabled = !(this.name && this.fileName && this.version && this.selectedRuntime)
    }

    // Handler for file drop
    onFileDrop(event: DragEvent): void {
        event.preventDefault();
        if (event.dataTransfer) {
            this.file = event.dataTransfer.files[0];
            this.fileName = this.file.name;
        }
        this.createDisabled = !(this.file && this.fileName)
    }

    // Prevent default dragover behavior
    onDragOver(event: DragEvent): void {
        event.preventDefault();
    }

    onInputChanged(event: any) {
        this.createDisabled = !(this.name && this.fileName && this.version && this.selectedRuntime)
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
                    content: content.split(',')[1], name: this.name, fileName: this.fileName, handler: this.version,
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

