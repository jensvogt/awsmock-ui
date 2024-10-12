import {Component, Inject, OnDestroy, OnInit} from "@angular/core";
import {ChartComponent} from "ng-apexcharts";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardImage, MatCardTitle} from "@angular/material/card";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatToolbar} from "@angular/material/toolbar";
import {NgForOf, NgIf} from "@angular/common";
import {MatList, MatListItem, MatListOption, MatNavList, MatSelectionList} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {MatFormField, MatLabel, MatOption, MatSelect} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogConfig, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatInput} from "@angular/material/input";
import {CdkDrag, CdkDragHandle} from "@angular/cdk/drag-drop";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FileImportComponent} from "./file-import/file-import.component";
import {ModuleService} from "../../../services/module.service";

@Component({
    selector: 'export-infrastructure-component',
    templateUrl: './import-infrastructure.component.html',
    standalone: true,
    imports: [
        ChartComponent,
        MatCard,
        MatCardHeader,
        MatCardContent,
        MatCardActions,
        MatCardImage,
        MatCardTitle,
        MatButton,
        MatToolbar,
        NgIf,
        NgForOf,
        MatList,
        MatIcon,
        MatListItem,
        RouterLink,
        MatSelect,
        FormsModule,
        MatOption,
        MatIconButton,
        MatListOption,
        MatSelectionList,
        MatNavList,
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
    providers: [ModuleService],
    styleUrls: ['./import-infrastructure.component.scss']
})
export class ImportInfrastructureComponentDialog implements OnInit, OnDestroy {

    body: string | undefined = '';

    constructor(private dialogRef: MatDialogRef<ImportInfrastructureComponentDialog>, @Inject(MAT_DIALOG_DATA) public data: any, private snackBar: MatSnackBar,
                private dialog: MatDialog, private moduleService: ModuleService) {
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
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

    loadFromFile() {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = this.body;

        this.dialog.open(FileImportComponent, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.body = result;
            }
        });
    }

    close() {
        this.dialogRef.close(false);
    }
}