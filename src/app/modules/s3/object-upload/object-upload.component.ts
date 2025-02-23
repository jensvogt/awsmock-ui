import {Component, ElementRef, Inject, signal, ViewChild} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogConfig, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatSnackBar} from "@angular/material/snack-bar";
import {byteConversion} from "../../../shared/byte-utils.component";
import {MatProgressBar} from "@angular/material/progress-bar";
import {MatTab, MatTabGroup, MatTabLabel} from "@angular/material/tabs";
import {MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef, MatTable, MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort, MatSortHeader, Sort} from "@angular/material/sort";
import {MatTooltip} from "@angular/material/tooltip";
import {S3ObjectMetadata} from "../model/s3-object-item";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {S3MetadataEditDialog} from "../metadata-edit/metadata-edit.component";
import {s3ObjectListActions} from "../object-list/state/s3-object-list.actions";
import {Store} from "@ngrx/store";
import {S3ObjectListState} from "../object-list/state/s3-object-list.reducer";
import {MatCardActions} from "@angular/material/card";

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
        MatProgressBar,
        MatTab,
        MatTabGroup,
        MatCell,
        MatCellDef,
        MatColumnDef,
        MatHeaderCell,
        MatHeaderRow,
        MatHeaderRowDef,
        MatIconButton,
        MatPaginator,
        MatRow,
        MatRowDef,
        MatSort,
        MatSortHeader,
        MatTabLabel,
        MatTable,
        MatTooltip,
        MatNoDataRow,
        MatHeaderCellDef,
        MatCardActions
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

    // Metadata table
    metadataDatasource = new MatTableDataSource<S3ObjectMetadata>();
    metadataLength: number = 0;
    metadata: S3ObjectMetadata[] = [];
    metadataPageSize: number = 10;
    metadataPageIndex: number = 0;
    metadataColumns: any[] = ['key', 'value', 'actions'];
    metadataSortColumns: SortColumn[] = [{column: "key", sortDirection: -1}]
    metadataPageSizeOptions = [5, 10, 20, 50, 100];
    protected readonly byteConversion = byteConversion;

    constructor(private snackBar: MatSnackBar, private dialogRef: MatDialogRef<ObjectUploadComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog, private store: Store<S3ObjectListState>) {
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
                const content: any = reader.result;
                this.dialogRef.close({content: content.split(',')[1], key: this.key, metadata: this.metadata});
            };
            reader.addEventListener("progress", this.handleProgress);
            reader.readAsDataURL(file);

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

    handleMetadataPageEvent(e: PageEvent) {
        this.metadataPageSize = e.pageSize;
        this.metadataPageIndex = e.pageIndex;
    }

    metadataSortChange(sortState: Sort) {
        this.metadataSortColumns = [];
        let column = sortState.active;
        let direction = sortState.direction === 'asc' ? 1 : -1;
        this.metadataSortColumns = [{column: column, sortDirection: direction}];
    }

    addMetadata() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {};

        this.dialog.open(S3MetadataEditDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.metadata.push(result.metadata);
                this.metadataDatasource.data = this.metadata;
                this.metadataLength = this.metadata.length;
            }
        });
    }

    editMetadata(metadata: S3ObjectMetadata) {
        if (metadata) {
            const dialogConfig = new MatDialogConfig();

            dialogConfig.disableClose = true;
            dialogConfig.autoFocus = true;
            dialogConfig.data = {metadata: metadata};

            this.dialog.open(S3MetadataEditDialog, dialogConfig).afterClosed().subscribe(result => {
                if (result && result.metadata) {
                    let index = this.metadata.findIndex(x => x.key === result.metadata.key)
                    if (index > 0) {
                        this.metadata[index] = result.metadata
                        this.metadataDatasource = new MatTableDataSource(this.metadata);
                        this.metadataLength = this.metadata.length;
                        this.store.dispatch(s3ObjectListActions.updateObject({bucketName: this.bucketName, key: this.key, metadata: this.metadata}));
                    }
                }
            });
        }
    }

    deleteMetadata(metadata: S3ObjectMetadata) {
        if (metadata.key) {
            this.metadata = this.metadata.filter(element => {
                return element.key !== metadata.key
            });
            this.metadataDatasource = new MatTableDataSource(this.metadata);
            this.store.dispatch(s3ObjectListActions.updateObject({bucketName: this.bucketName, key: this.key, metadata: this.metadata}));
        }
    }
}

