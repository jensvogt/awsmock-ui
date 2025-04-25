import {ChangeDetectionStrategy, Component, Inject, ViewChild} from "@angular/core";
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
    ],
    providers: [ModuleService],
    styleUrls: ['./import-infrastructure.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportInfrastructureComponentDialog {

    body: string | undefined = '';
    cleanFirst = false;
    includeObjects = false;
    loadDisabled: boolean = true;
    @ViewChild('importButton') importButton: MatInput | undefined;

    constructor(private dialogRef: MatDialogRef<ImportInfrastructureComponentDialog>, @Inject(MAT_DIALOG_DATA) public data: any, private snackBar: MatSnackBar,
                private dialog: MatDialog, private moduleService: ModuleService) {
    }

    importInfrastructure() {
        if (this.body === undefined || this.body.length === 0) {
            this.snackBar.open('Empty infrastructure JSON', 'Done', {duration: 5000});
            return;
        }
        this.moduleService.importInfrastructure(this.body as any, this.cleanFirst, this.includeObjects).subscribe(() => {
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
        dialogConfig.data = {extensions: ['.json', '.bson']}

        this.dialog.open(FileImportComponent, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.loadDisabled = false;
                this.body = result;
                this.importButton?.focus();
            }
        });
    }

    close() {
        this.dialogRef.close(false);
    }
}