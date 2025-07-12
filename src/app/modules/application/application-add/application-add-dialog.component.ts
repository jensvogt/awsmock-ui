import {Component, ElementRef, Inject, OnInit, signal, ViewChild} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogConfig, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
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
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {getVersion} from "../../../shared/version-utils.componen";
import {MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef, MatTable, MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort, MatSortHeader, Sort} from "@angular/material/sort";
import {MatTooltip} from "@angular/material/tooltip";
import {ApplicationItem, Environment, UpdateApplicationRequest} from "../model/application-item";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {ApplicationEnvironmentAddDialog} from "../application-environment-add/application-environment-add.component";
import {applicationDetailsActions} from "../application-details/state/application-details.actions";
import {ApplicationEnvironmentEditDialog} from "../application-environment-edit/application-environment-edit.component";
import {convertObjectToArray} from "../../../shared/paging-utils.component";
import {Store} from "@ngrx/store";

interface Runtime {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'application-add-dialog',
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
        MatTable,
        MatTooltip,
        MatHeaderCellDef,
        MatNoDataRow
    ],
    styleUrls: ['./application-add-dialog.component.scss']
})
export class ApplicationAddDialog implements OnInit {

    applicationItem: ApplicationItem = {} as ApplicationItem;
    file: File = {} as File;
    fileName: string | undefined;
    privatePort: number = 8080;
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
    selectedRuntime: string = 'JAVA_21';
    runtimes: Runtime[] = [
        {value: 'JAVA_11', viewValue: 'Java 11'},
        {value: 'JAVA_17', viewValue: 'Java 17'},
        {value: 'JAVA_21', viewValue: 'Java 21'},
        {value: 'PYTHON_38', viewValue: 'Python 3.8'},
        {value: 'PYTHON_39', viewValue: 'Python 3.9'},
        {value: 'PYTHON_310', viewValue: 'Python 3.10'},
        {value: 'PYTHON_311', viewValue: 'Python 3.11'},
        {value: 'PYTHON_312', viewValue: 'Python 3.12'},
        {value: 'provided.al2', viewValue: 'Provided AL2'},
        {value: 'provided.al2023', viewValue: 'Provided AL2023'},
        {value: 'provided.latest', viewValue: 'Provided Latest'},
        {value: 'nodejs_20x', viewValue: 'NodeJS 20'},
        {value: 'go', viewValue: 'Go'},
    ];

    // Environment
    environmentColumns: string[] = ['key', 'value', 'actions'];
    environmentSortColumn: SortColumn = {column: 'key', sortDirection: -1};
    environmentDatasource: MatTableDataSource<Environment> = {} as MatTableDataSource<Environment>;
    environmentTotal: number = 0;
    environmentPageSize: number = 5;
    environmentPageIndex: number = 0;
    environmentPageSizeOptions = [5, 10, 20, 50, 100];

    // Byte conversion
    protected readonly byteConversion = byteConversion;

    constructor(private readonly snackBar: MatSnackBar, private readonly dialog: MatDialog, private readonly dialogRef: MatDialogRef<ApplicationAddDialog>,
                private readonly store: Store, @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit() {
        this.dialogRef.updateSize("1400px", "1000px");
        this.applicationItem.version = 'latest';
    }

    // Method to handle file upload Handler for file input change
    onFileChange(event: any): void {
        this.file = event.target.files[0];
        this.fileName = this.file.name;
        this.applicationItem.version = getVersion(this.fileName);
        //   this.createDisabled = !(this.applicationItem.name && this.fileName && this.applicationItem.version && this.selectedRuntime)
    }

    // Handler for file drop
    onFileDrop(event: DragEvent): void {
        event.preventDefault();
        if (event.dataTransfer) {
            this.file = event.dataTransfer.files[0];
            this.fileName = this.file.name;
        }
        this.createDisabled = !(this.applicationItem.name && this.fileName && this.applicationItem.version && this.selectedRuntime)
    }

    // Prevent default dragover behavior
    onDragOver(event: DragEvent): void {
        event.preventDefault();
    }

    onInputChanged(event: any) {
        this.createDisabled = !(this.applicationItem.name && this.fileName && this.applicationItem.version && this.selectedRuntime)
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
                    content: content.split(',')[1], name: this.applicationItem.name, fileName: this.fileName, handler: this.applicationItem.version,
                    runtime: this.selectedRuntime, privatePort: this.privatePort, timeout: this.timeout, jsonEnvironment: this.jsonEnvironment
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

    // ===================================================================================================================
    // Environment
    // ===================================================================================================================

    handleEnvironmentPageEvent(e: PageEvent) {
        this.environmentPageSize = e.pageSize;
        this.environmentPageIndex = e.pageIndex;
        this.environmentDatasource = convertObjectToArray(this.applicationItem.environment, e.pageSize, e.pageIndex, this.environmentSortColumn);
        this.environmentTotal = this.applicationItem.environment.length;
    }

    environmentSortChanged(sortState: Sort) {
        let direction = sortState.direction === 'asc' ? 1 : -1;
        this.environmentSortColumn = {column: sortState.active, sortDirection: direction};
        this.environmentDatasource = convertObjectToArray(this.applicationItem.environment, this.environmentPageSize, this.environmentPageIndex, this.environmentSortColumn);
    }

    addEnvironment() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        this.dialog.open(ApplicationEnvironmentAddDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result?.key && result.value) {
                this.applicationItem.environment[result.key] = result.value;
                let request: UpdateApplicationRequest = {application: this.applicationItem}
                this.store.dispatch(applicationDetailsActions.updateApplication({request: request}));
                this.snackBar.open('Application environment variable updated, name: ' + result.key, 'Dismiss', {duration: 5000});
            } else {
                this.snackBar.open('Application environment variable unchanged, name: ' + result.key, 'Dismiss', {duration: 5000});
            }
        });
    }

    editEnvironment(key: string, value: string) {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {key: key, value: value};

        this.dialog.open(ApplicationEnvironmentEditDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result?.key && result.value) {
                this.applicationItem.environment[result.key] = result.value;
                let request: UpdateApplicationRequest = {application: this.applicationItem}
                this.store.dispatch(applicationDetailsActions.updateApplication({request: request}));
                this.snackBar.open('Application environment variable updated, name: ' + result.key, 'Dismiss', {duration: 5000});
            } else {
                this.snackBar.open('Application environment variable unchanged, name: ' + result.key, 'Dismiss', {duration: 5000});
            }
        });
    }

    deleteEnvironment(key: string) {
        delete this.applicationItem.environment[key];
        let request: UpdateApplicationRequest = {application: this.applicationItem}
        this.store.dispatch(applicationDetailsActions.updateApplication({request: request}));
        this.snackBar.open('Application environment variable deleted, name: ' + key, 'Dismiss', {duration: 5000});
    }
}

