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
import {TableCountersResponse} from "../model/table-item";
import {dynamodbTableListActions} from "./state/dynamodb-table-list.actions";

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
    columns: any[] = ['id', 'created', 'modified', 'actions'];

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

    constructor(private snackBar: MatSnackBar, private dialog: MatDialog, private location: Location, private state: State<DynamodbTableListState>, private store: Store) {
        this.prefix$.subscribe((data: string) => {
            this.prefixSet = false;
            if (data && data.length) {
                this.prefixValue = data;
                this.prefixSet = true;
            }
        });
    }

    ngOnInit(): void {
        this.loadUserpools();
        this.updateSubscription = interval(60000).subscribe(() => this.loadUserpools());
    }

    ngOnDestroy(): void {
        this.updateSubscription?.unsubscribe();
    }

    setPrefix() {
        this.prefixSet = true;
        this.state.value['dynamodb-table-list'].pageIndex = 0;
        this.state.value['dynamodb-table-list'].prefix = this.prefixValue;
        this.loadUserpools();
    }

    unsetPrefix() {
        this.prefixValue = '';
        this.prefixSet = false;
        this.state.value['dynamodb-table-list'].prefix = '';
        this.loadUserpools();
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.loadUserpools();
    }

    handlePageEvent(e: PageEvent) {
        this.state.value['dynamodb-table-list'].pageSize = e.pageSize;
        this.state.value['dynamodb-table-list'].pageIndex = e.pageIndex;
        this.loadUserpools();
    }

    sortChange(sortState: Sort) {
        this.sortColumns = [];
        if (sortState.direction === 'asc') {
            this.sortColumns.push({column: sortState.active, sortDirection: 1});
        } else {
            this.sortColumns.push({column: sortState.active, sortDirection: -1});
        }
        this.loadUserpools();
    }

    loadUserpools() {
        this.lastUpdate = new Date();
        this.store.dispatch(dynamodbTableListActions.loadTables({
            prefix: this.state.value['dynamodb-table-list'].prefix,
            pageSize: this.state.value['dynamodb-table-list'].pageSize,
            pageIndex: this.state.value['dynamodb-table-list'].pageIndex,
            sortColumns: this.state.value['dynamodb-table-list'].sortColumns
        }));
    }

    addUserPool() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        /*
                this.dialog.open(UserPoolAddComponentDialog, dialogConfig).afterClosed().subscribe(result => {
                    if (result) {
                        this.createUserPool(result)
                    }
                });*/
    }

    createTable(tableName: string) {
        this.store.dispatch(dynamodbTableListActions.addTable({tableName: tableName}));
    }

    deleteTable(userPoolId: string) {
        /* this.cognitoService.deleteUserPool(userPoolId)
             .subscribe(() => {
                 this.snackBar.open('Userpool deleted, Id: ' + userPoolId, 'Done', {duration: 5000});
                 this.loadUserpools();
             });*/
    }
}
