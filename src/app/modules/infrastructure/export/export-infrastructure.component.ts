import {Component, Inject, OnDestroy, OnInit} from "@angular/core";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogConfig, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatInput} from "@angular/material/input";
import {CdkDrag, CdkDragHandle} from "@angular/cdk/drag-drop";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {FileExportComponent} from "./file-export/file-export.component";

@Component({
    selector: 'export-infrastructure-component',
    templateUrl: './export-infrastructure.component.html',
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

    ],
    providers: [],
    styleUrls: ['./export-infrastructure.component.scss']
})
export class ExportInfrastructureComponentDialog implements OnInit, OnDestroy {

    body: string | undefined;

    constructor(private dialogRef: MatDialogRef<ExportInfrastructureComponentDialog>, @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog) {
        this.body = JSON.stringify(data, null, 4);
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
    }

    fileExport() {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = this.body;

        this.dialog.open(FileExportComponent, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.dialogRef.close(true);
            }
        });
    }
}