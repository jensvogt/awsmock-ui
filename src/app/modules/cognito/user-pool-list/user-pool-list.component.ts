import {Component, OnDestroy, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {interval, Observable, Subscription} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {Sort} from "@angular/material/sort";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {CognitoService} from "../../../services/cognito.service";
import {UserPoolAddComponentDialog} from "../user-pool-add/user-pool-add.component";
import {State, Store} from "@ngrx/store";
import {CognitoUserPoolListState} from "./state/cognito-userpool-list.reducer";
import {cognitoUserpoolListActions} from "./state/cognito-userpool-list.actions";
import {selectPageIndex, selectPageSize, selectPrefix, selectUserPoolCounters} from "./state/cognito-userpool-list.selectors";
import {UserPoolCountersResponse} from "../model/user-pool-item";

@Component({
    selector: 'cognito-user-pool-list',
    templateUrl: './user-pool-list.component.html',
    styleUrls: ['./user-pool-list.component.scss'],
    standalone: false,
    providers: [CognitoService]
})
export class CognitoUserPoolListComponent implements OnInit, OnDestroy {

    // Last update
    lastUpdate: Date = new Date();

    // Table
    pageSize$: Observable<number> = this.store.select(selectPageSize);
    pageIndex$: Observable<number> = this.store.select(selectPageIndex);
    prefix$: Observable<string> = this.store.select(selectPrefix);
    listUserPoolCountersResponse$: Observable<UserPoolCountersResponse> = this.store.select(selectUserPoolCounters);
    columns: any[] = ['id', 'created', 'modified', 'actions'];

    // Auto-update
    updateSubscription: Subscription | undefined;

    // Paging
    pageSizeOptions = [5, 10, 20, 50, 100];
    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;
    pageEvent: PageEvent = {length: 0, pageIndex: 0, pageSize: 0};

    // Sorting
    sortColumns: SortColumn[] = [];

    // Prefix
    prefixValue: string = this.state.value['cognito-userpool-list'].prefix;
    prefixSet: boolean = false;

    constructor(private snackBar: MatSnackBar, private dialog: MatDialog, private location: Location, private state: State<CognitoUserPoolListState>,
                private store: Store) {
        this.prefix$.subscribe((data: string) => {
            this.prefixSet = false;
            if (data && data.length) {
                this.prefixValue = data;
                this.prefixSet = true;
            }
        });
        //this.listUserPoolCountersResponse$.subscribe((data) => console.log("UserPoolsResponse:", data));
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
        this.state.value['cognito-userpool-list'].pageIndex = 0;
        this.state.value['cognito-userpool-list'].prefix = this.prefixValue;
        this.loadUserpools();
    }

    unsetPrefix() {
        this.prefixValue = '';
        this.prefixSet = false;
        this.state.value['cognito-userpool-list'].prefix = '';
        this.loadUserpools();
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.loadUserpools();
    }

    handlePageEvent(e: PageEvent) {
        this.state.value['cognito-userpool-list'].pageSize = e.pageSize;
        this.state.value['cognito-userpool-list'].pageIndex = e.pageIndex;
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
        this.store.dispatch(cognitoUserpoolListActions.loadUserPools({
            prefix: this.state.value['cognito-userpool-list'].prefix,
            pageSize: this.state.value['cognito-userpool-list'].pageSize,
            pageIndex: this.state.value['cognito-userpool-list'].pageIndex,
            sortColumns: this.state.value['cognito-userpool-list'].sortColumns
        }));
    }

    addUserPool() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        this.dialog.open(UserPoolAddComponentDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.createUserPool(result)
            }
        });
    }

    createUserPool(userPoolName: string) {
        this.store.dispatch(cognitoUserpoolListActions.addUserPool({userPoolName: userPoolName}));
    }

    deleteUserPool(userPoolId: string) {
        /* this.cognitoService.deleteUserPool(userPoolId)
             .subscribe(() => {
                 this.snackBar.open('Userpool deleted, Id: ' + userPoolId, 'Done', {duration: 5000});
                 this.loadUserpools();
             });*/
    }
}
