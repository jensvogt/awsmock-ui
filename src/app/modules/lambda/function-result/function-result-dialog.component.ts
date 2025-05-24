import {Component, Inject, OnInit} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatIcon} from "@angular/material/icon";
import {DatePipe, NgIf} from "@angular/common";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
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
import {FooterComponent} from "../../../shared/footer/footer.component";

interface Runtime {
    value: string;
    viewValue: string;
}

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
        MatCardHeader,
        MatIconButton,
        NgIf,
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
        FooterComponent
    ],
    styleUrls: ['./function-result-dialog.component.scss']
})
export class LambdaResultDialog implements OnInit {

    // Last update
    lastUpdate: Date = new Date();

    lambdaArn: string = '';
    total: number = 0;
    pageSize: number = 10;
    pageIndex: number = 0;
    prefix: string = '';
    defaultSort: Sort = {active: "name", direction: "asc"};
    sortColumns: SortColumn[] = [{column: "timestamp", sortDirection: -1}]

    // Lambda result table
    lambdaResultColumns: any[] = ['name', 'status', 'timestamp', 'actions'];
    lambdaResultData: LambdaResultItem[] = [];
    lambdaResultDataSource = new MatTableDataSource(this.lambdaResultData);
    lambdaResultPageSizeOptions = [5, 10, 20, 50, 100];
    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;

    constructor(private snackBar: MatSnackBar, private dialogRef: MatDialogRef<LambdaResultDialog>, @Inject(MAT_DIALOG_DATA) public data: any, private lambdaService: LambdaService) {
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
            console.log("Lambda results: ", data);
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

    }

    deleteResult(oid: string) {
        this.lambdaService.deleteLambdaResultCounter(oid).subscribe(() => {
            console.log("Lambda results deleted: ", oid);
            this.loadLambdaResults();
        });
    }

    deleteAll() {
        this.lambdaService.deleteLambdaResultCounters(this.lambdaArn).subscribe(() => {
            console.log("Lambda results deleted: ", this.lambdaArn);
            this.loadLambdaResults();
        });
    }
}

