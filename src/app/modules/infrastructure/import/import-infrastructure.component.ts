import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, ViewChild} from "@angular/core";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogConfig, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatInput} from "@angular/material/input";
import {CdkDrag, CdkDragHandle} from "@angular/cdk/drag-drop";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FileImportComponent} from "./file-import/file-import.component";
import {ModuleService} from "../../../services/module.service";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {NgIf} from "@angular/common";
import {CdkScrollable} from "@angular/cdk/scrolling";

@Component({
    selector: 'export-infrastructure-component',
    templateUrl: './import-infrastructure.component.html',
    standalone: true,
    imports: [
        MatButton,
        FormsModule,
        MatDialogActions,
        MatDialogClose,
        MatDialogContent,
        MatDialogTitle,
        MatFormField,
        MatInput,
        MatLabel,
        CdkDrag,
        CdkDragHandle,
        CdkTextareaAutosize,
        MatCheckbox,
        MatProgressSpinner,
        NgIf,
        CdkScrollable,
    ],
    providers: [ModuleService],
    styleUrls: ['./import-infrastructure.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportInfrastructureComponentDialog implements OnInit {

    body: string | undefined = '';
    cleanFirst = false;
    includeObjects = false;
    loadDisabled: boolean = true;
    loading = false;
    @ViewChild('importButton') importButton: MatInput | undefined;

    constructor(private readonly dialogRef: MatDialogRef<ImportInfrastructureComponentDialog>, @Inject(MAT_DIALOG_DATA) public data: any, private readonly snackBar: MatSnackBar,
                private readonly dialog: MatDialog, private readonly moduleService: ModuleService, private readonly cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.dialogRef.updateSize("1500px", "1000px");
    }

    importInfrastructure() {
        if (this.body === undefined || this.body.length === 0) {
            this.snackBar.open('Empty infrastructure JSON', 'Done', {duration: 5000});
            return;
        }
        this.moduleService.importInfrastructure(this.body).subscribe(() => {
            this.snackBar.open('Infrastructure imported', 'Done', {duration: 5000})
            this.dialogRef.close(true);
        });
    }

    onChange(event: any) {
        if (event) {
            this.loadDisabled = false;
        }
    }

    onClear() {
        this.body = '';
        this.loadDisabled = true;
    }

    loadFromFile() {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {extensions: ['.json']}

        this.loading = true;
        this.dialog.open(FileImportComponent, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.body = result;
                this.importButton?.focus();
            }
            this.loading = false;
            this.loadDisabled = false;
            this.cdr.detectChanges();
        });
    }

    close() {
        this.dialogRef.close(false);
    }
}