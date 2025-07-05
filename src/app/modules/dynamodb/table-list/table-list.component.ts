import {Component, OnDestroy, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {interval, Observable, Subscription} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {Sort} from "@angular/material/sort";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {CognitoService} from "../../../services/cognito.service";
import {State, Store} from "@ngrx/store";
import {DynamodbTableListState} from "./state/dynamodb-table-list.reducer";
import {selectPageIndex, selectPageSize, selectPrefix, selectTableCounters} from "./state/dynamodb-table-list.selectors";
import {CreateTableRequest, TableCountersResponse} from "../model/table-item";
import {dynamodbTableListActions} from "./state/dynamodb-table-list.actions";
import {byteConversion} from "../../../shared/byte-utils.component";
import {DynamodbService} from "../service/dynamodb.service";
import {DynamoDbAddTableDialog} from "./add-table/add-table.component";
import {AutoReloadComponent} from "../../../shared/autoreload/auto-reload.component";

@Component({
    selector: 'dynamodb-table-list',
    templateUrl: './table-list.component.html',
    styleUrls: ['./table-list.component.scss'],
    standalone: false,
    providers: [CognitoService]
})
export class DynamodbTableListComponent implements OnInit, OnDestroy {

    // Last update
    lastUpdate: Date = new Date();

    // Table
    pageSize$: Observable<number> = this.store.select(selectPageSize);
    pageIndex$: Observable<number> = this.store.select(selectPageIndex);
    prefix$: Observable<string> = this.store.select(selectPrefix);
    listTableCountersResponse$: Observable<TableCountersResponse> = this.store.select(selectTableCounters);
    columns: any[] = ['id', 'items', 'size', 'created', 'modified', 'actions'];

    // Auto-update
    updateSubscription: Subscription | undefined;

    // Paging
    pageSizeOptions = [5, 10, 20, 50, 100];
    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;

    // Sorting
    sortColumns: SortColumn[] = [];

    // Prefix
    prefixValue: string = this.state.value['dynamodb-table-list'].prefix;
    prefixSet: boolean = false;
    protected readonly byteConversion = byteConversion;

    constructor(private readonly snackBar: MatSnackBar, private readonly dialog: MatDialog, private readonly location: Location, private readonly state: State<DynamodbTableListState>, private readonly store: Store, private readonly dynamodbService: DynamodbService) {
        this.prefix$.subscribe((data: string) => {
            this.prefixSet = false;
            if (data?.length) {
                this.prefixValue = data;
                this.prefixSet = true;
            }
        });
        //this.listTableCountersResponse$.subscribe((data) => console.log("Data: ", data));
    }

    ngOnInit(): void {
        this.loadTables();
        const period = parseInt(<string>localStorage.getItem("autoReload"));
        this.updateSubscription = interval(period).subscribe(() => this.loadTables());
    }

    ngOnDestroy(): void {
        this.updateSubscription?.unsubscribe();
    }

    autoReload(): void {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.maxWidth = '100vw';
        dialogConfig.maxHeight = '100vh';
        dialogConfig.panelClass = 'full-screen-modal';
        dialogConfig.width = "20%"
        dialogConfig.minWidth = '280px'
        dialogConfig.data = {title: 'Export modules', mode: 'export'};

        this.dialog.open(AutoReloadComponent, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                const period = parseInt(<string>localStorage.getItem("autoReload"));
                this.updateSubscription?.unsubscribe();
                this.updateSubscription = interval(period).subscribe(() => this.loadTables());
            }
        });
    }

    setPrefix() {
        this.prefixSet = true;
        this.state.value['dynamodb-table-list'].pageIndex = 0;
        this.state.value['dynamodb-table-list'].prefix = this.prefixValue;
        this.loadTables();
    }

    unsetPrefix() {
        this.prefixValue = '';
        this.prefixSet = false;
        this.state.value['dynamodb-table-list'].prefix = '';
        this.loadTables();
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.loadTables();
    }

    handlePageEvent(e: PageEvent) {
        this.state.value['dynamodb-table-list'].pageSize = e.pageSize;
        this.state.value['dynamodb-table-list'].pageIndex = e.pageIndex;
        this.loadTables();
    }

    sortChange(sortState: Sort) {
        this.sortColumns = [];
        if (sortState.direction === 'asc') {
            this.sortColumns.push({column: sortState.active, sortDirection: 1});
        } else {
            this.sortColumns.push({column: sortState.active, sortDirection: -1});
        }
        this.loadTables();
    }

    loadTables() {
        this.lastUpdate = new Date();
        this.store.dispatch(dynamodbTableListActions.loadTables({
            prefix: this.state.value['dynamodb-table-list'].prefix,
            pageSize: this.state.value['dynamodb-table-list'].pageSize,
            pageIndex: this.state.value['dynamodb-table-list'].pageIndex,
            sortColumns: this.state.value['dynamodb-table-list'].sortColumns
        }));
    }

    addTable() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {};
        dialogConfig.maxWidth = '100vw';
        dialogConfig.maxHeight = '100vh';
        dialogConfig.panelClass = 'full-screen-modal';
        dialogConfig.width = "70%"

        this.dialog.open(DynamoDbAddTableDialog, dialogConfig).afterClosed().subscribe((result: CreateTableRequest) => {
            if (result) {
                this.dynamodbService.createTable(result)
                    .subscribe(() => {
                        this.snackBar.open('Table added, tableName: ' + result.TableName, 'Done', {duration: 5000});
                        this.loadTables();
                    });
            }
        });
    }

    createTable(tableName: string) {
        this.store.dispatch(dynamodbTableListActions.addTable({tableName: tableName}));
    }

    deleteTable(tableName: string) {
        this.dynamodbService.deleteTable(tableName)
            .subscribe(() => {
                this.snackBar.open('Table deleted, name: ' + tableName, 'Done', {duration: 5000});
                this.loadTables();
            });
    }
}
