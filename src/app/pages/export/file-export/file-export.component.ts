import {Component, Inject, OnInit} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle} from "@angular/material/card";
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatNoDataRow,
    MatRow,
    MatRowDef,
    MatTable
} from "@angular/material/table";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatTooltip} from "@angular/material/tooltip";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatSnackBar} from "@angular/material/snack-bar";
import {saveAs} from "file-saver";

@Component({
    selector: 'export-file-download',
    templateUrl: './file-export.component.html',
    standalone: true,
    imports: [
        MatCard,
        MatCardHeader,
        MatCardContent,
        MatCardActions,
        MatCardSubtitle,
        MatTable,
        MatHeaderCellDef,
        MatCellDef,
        MatColumnDef,
        MatIcon,
        MatHeaderCell,
        MatCell,
        MatHeaderRowDef,
        MatHeaderRow,
        MatSortHeader,
        MatRowDef,
        MatNoDataRow,
        MatIconButton,
        MatRow,
        MatPaginator,
        MatSort,
        MatTooltip,
        FormsModule,
        MatButton,
        MatDialogActions,
        MatDialogClose,
        MatDialogContent,
        MatDialogTitle,
        MatFormField,
        MatInput,
        MatLabel
    ],
    styleUrls: ['./file-export.component.scss'],
    providers: []
})
export class FileExportComponent implements OnInit {

    body: string = '';
    fileName: string | undefined = '';

    constructor(private snackBar: MatSnackBar, private dialogRef: MatDialogRef<FileExportComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.body = data;
    }

    ngOnInit(): void {
    }

    // Method to handle file upload
    download(): void {
        if (this.fileName) {
            const blob = new Blob([this.body], {type: "application/json"});
            saveAs(blob, this.fileName);
            this.snackBar.open("Infrastructure saved to local file", 'Done', {duration: 5000});
            this.dialogRef.close(true);
        }
    }
}