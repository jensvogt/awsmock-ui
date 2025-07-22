import {Component, Inject, OnInit} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogConfig, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatIcon} from "@angular/material/icon";
import {DatePipe} from "@angular/common";
import {MatCard, MatCardActions, MatCardContent} from "@angular/material/card";
import {MatSort, MatSortHeader, Sort} from "@angular/material/sort";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {LambdaService} from "../service/lambda-service.component";
import {LambdaResultItem} from "../model/lambda-result-item";
import {MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef, MatTable, MatTableDataSource} from "@angular/material/table";
import {MatListItem, MatNavList} from "@angular/material/list";
import {CdkCopyToClipboard} from "@angular/cdk/clipboard";
import {MatTooltip} from "@angular/material/tooltip";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {RouterLink} from "@angular/router";
import {LambdaResultDetail} from "./function-result-view/function-result-detail.component";
import {CdkDrag, CdkDragHandle} from "@angular/cdk/drag-drop";

@Component({
    selector: 'function-result-dialog',
    templateUrl: './function-result-dialog.component.html',
    standalone: true,
    imports: [
        FormsModule,
        MatButton,
        MatDialogActions,
        MatDialogClose,
        MatDialogContent,
        MatIcon,
        MatCard,
        MatCardContent,
        MatIconButton,
        MatSort,
        MatTable,
        MatNavList,
        CdkCopyToClipboard,
        MatTooltip,
        MatColumnDef,
        MatHeaderCell,
        MatSortHeader,
        MatCell,
        MatHeaderCellDef,
        MatCellDef,
        MatHeaderRowDef,
        MatHeaderRow,
        MatNoDataRow,
        MatRowDef,
        MatRow,
        MatPaginator,
        MatListItem,
        RouterLink,
        DatePipe,
        CdkDrag,
        CdkDragHandle,
        MatDialogTitle,
        MatCardActions
    ],
    styleUrls: ['./function-result-dialog.component.scss']
})
export class LambdaResultDialog implements OnInit {

    // Last update
    lastUpdate: Date = new Date();

    lambdaArn: string = '';
    total: number = 0;
    pageSize: number = 5;
    pageIndex: number = 0;
    prefix: string = '';
    defaultSort: Sort = {active: "name", direction: "asc"};
    sortColumns: SortColumn[] = [{column: "timestamp", sortDirection: -1}]

    // Lambda result table
    lambdaResultColumns: any[] = ['name', 'containerId', 'status', 'timestamp', 'actions'];
    lambdaResultData: LambdaResultItem[] = [];
    lambdaResultDataSource = new MatTableDataSource(this.lambdaResultData);
    lambdaResultPageSizeOptions = [5, 10, 20, 50, 100];
    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;

    constructor(private readonly snackBar: MatSnackBar, private readonly dialog: MatDialog, private readonly dialogRef: MatDialogRef<LambdaResultDialog>, @Inject(MAT_DIALOG_DATA) public data: any,
                private readonly lambdaService: LambdaService) {
        this.lambdaArn = data.lambdaArn;
    }

    ngOnInit() {
        this.dialogRef.updateSize("1400px", "630px");
        this.loadLambdaResults();
    }

    sortChange(sortState: Sort) {
        this.sortColumns = [];
        let direction: number;
        if (sortState.direction === 'asc') {
            direction = 1;
        } else {
            direction = -1;
        }
        this.sortColumns = [{column: sortState.active, sortDirection: direction}];
        this.loadLambdaResults();
    }

    handlePageEvent(e: PageEvent) {
        this.pageSize = e.pageSize;
        this.pageIndex = e.pageIndex;
        this.loadLambdaResults();
    }

    loadLambdaResults() {
        this.lambdaService.listLambdaResultCounters(this.lambdaArn, this.pageSize, this.pageIndex, this.sortColumns).subscribe((data: any) => {
            this.lambdaResultData = data.lambdaResultCounters;
            this.lambdaResultDataSource.data = this.lambdaResultData;
            this.total = data.total;
            this.lastUpdate = new Date();
        });
    }

    refresh() {
        this.loadLambdaResults();
    }

    viewResult(id: string) {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {lambdaArn: this.lambdaArn, resultOid: id};
        dialogConfig.maxWidth = '100vw';
        dialogConfig.maxHeight = '100vh';
        dialogConfig.panelClass = 'full-screen-modal';
        dialogConfig.width = "40%"

        this.dialog.open(LambdaResultDetail, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
            }
        });
    }

    deleteResult(oid: string) {
        this.lambdaService.deleteLambdaResultCounter(oid).subscribe(() => {
            this.loadLambdaResults();
        });
    }

    deleteAll() {
        this.lambdaService.deleteLambdaResultCounters(this.lambdaArn).subscribe(() => {
            this.loadLambdaResults();
        });
    }
}

