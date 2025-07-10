import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, ViewChild} from "@angular/core";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogConfig, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatInput} from "@angular/material/input";
import {CdkDrag, CdkDragHandle} from "@angular/cdk/drag-drop";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ModuleService} from "../../../services/module.service";
import {FileImportComponent} from "../../infrastructure/import/file-import/file-import.component";
import {SqsService} from "../service/sqs-service.component";
import {MatProgressSpinner} from "@angular/material/progress-spinner";


@Component({
    selector: 'sqs-import-messages-component',
    templateUrl: './message-import.component.html',
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
    MatProgressSpinner
],
    providers: [ModuleService],
    styleUrls: ['./message-import.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportMessagesComponentDialog implements OnInit {

    body: string | undefined = '';
    includeObjects = false;
    loadDisabled: boolean = true;
    queueArn: string = '';
    loading: boolean = false;

    @ViewChild('importButton') importButton: MatInput | undefined;

    constructor(private readonly dialogRef: MatDialogRef<ImportMessagesComponentDialog>, @Inject(MAT_DIALOG_DATA) public data: any, private readonly snackBar: MatSnackBar,
                private readonly dialog: MatDialog, private readonly sqsService: SqsService, private readonly cdr: ChangeDetectorRef) {
        this.queueArn = data;
    }

    ngOnInit() {
        this.dialogRef.updateSize("1500px", "1000px");
    }

    importMessages() {
        if (this.body === undefined || this.body.length === 0) {
            this.snackBar.open('Empty Messages JSON', 'Done', {duration: 5000});
            return;
        }
        this.sqsService.importMessages(this.queueArn, this.body).subscribe(() => {
            this.snackBar.open('Messages imported', 'Done', {duration: 5000})
            this.dialogRef.close(true);
        });
    }

    onChange(event: any) {
        if (event) {
            this.loading = false;
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
            this.loadDisabled = false;
            this.loading = false;
            this.cdr.detectChanges();
        });
    }

    close() {
        this.dialogRef.close(false);
    }
}