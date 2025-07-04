import {Component, Inject} from "@angular/core";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogConfig, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatInput} from "@angular/material/input";
import {CdkDrag, CdkDragHandle} from "@angular/cdk/drag-drop";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {FileExportComponent} from "../../infrastructure/export/file-export/file-export.component";

@Component({
    selector: 'sqs-export-messages-component',
    templateUrl: './message-export.component.html',
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
    styleUrls: ['./message-export.component.scss']
})
export class MessageExportComponent {

    body: string | undefined;
    filename: string | undefined;
    loading: boolean = false;

    constructor(private readonly dialogRef: MatDialogRef<MessageExportComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private readonly dialog: MatDialog) {
        this.loading = true;
        this.body = JSON.stringify(data.body, null, 4);
        if (data.filename) {
            this.filename = data.filename;
        }
    }

    fileExport() {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {body: this.body, filename: this.filename};

        this.dialog.open(FileExportComponent, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.dialogRef.close(true);
            }
        });
    }
}