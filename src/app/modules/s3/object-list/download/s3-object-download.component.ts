import {Component, Inject} from '@angular/core';
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
    templateUrl: './s3-object-download.component.html',
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
    styleUrls: ['./s3-object-download.component.scss'],
    providers: []
})
export class S3ObjectDownloadComponent {

    body: string = '';
    fileName: string | undefined = '';

    constructor(private snackBar: MatSnackBar, private dialogRef: MatDialogRef<S3ObjectDownloadComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.body = data;
    }

    // Method to handle file upload
    download(): void {
        if (this.fileName) {
            const blob = new Blob([this.body], {type: "application/json"});
            saveAs(blob, this.fileName);
            this.snackBar.open("S3 object saved to local file: " + this.fileName, 'Done', {duration: 5000});
            this.dialogRef.close(true);
        }
    }
}
