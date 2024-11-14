import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Location} from "@angular/common";
import {interval, Subscription} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {Sort} from "@angular/material/sort";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute} from "@angular/router";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {CognitoService} from "../service/cognito.service";
import {UserItem} from "../model/user-item";
import {UserAddComponentDialog} from "../user-add/user-add.component";
import {State, Store} from "@ngrx/store";
import {CognitoUserPoolListState} from "../user-pool-list/state/cognito-userpool-list.reducer";
import {cognitoUserActions} from "./state/cognito-user-list.actions";

@Component({
    selector: 'cognito-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
    providers: [CognitoService]
})
export class CognitoUserListComponent implements OnInit, OnDestroy {
    lastUpdate: Date = new Date();

    // Table
    userPoolId: string = '';
    prefix: string = '';
    prefixSet: boolean = false;
    userData: Array<UserItem> = [];
    userDataSource = new MatTableDataSource(this.userData);
    columns: any[] = ['userName', 'status', 'enabled', 'actions'];

    // Auto-update
    updateSubscription: Subscription | undefined;

    // Paging
    length = 0;
    pageSize = 10;
    pageIndex = 0;
    pageSizeOptions = [5, 10, 20, 50, 100];
    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;
    nextToken: string = '';
    pageEvent: PageEvent = {length: 0, pageIndex: 0, pageSize: 0};

    // Sorting
    sortColumns: SortColumn[] = [];
    private sub: any;

    constructor(private snackBar: MatSnackBar, private dialog: MatDialog, private route: ActivatedRoute, private location: Location, private store: Store,
                private state: State<CognitoUserPoolListState>, private cognitoService: CognitoService) {
    }

    ngOnInit(): void {
        this.sub = this.route.params.subscribe(params => {
            this.userPoolId = params['userPoolId'];
        });
        this.loadUsers();
        this.updateSubscription = interval(60000).subscribe(() => this.loadUsers());
    }

    ngOnDestroy(): void {
        this.updateSubscription?.unsubscribe();
    }

    setPrefix() {
        this.prefixSet = true;
        this.loadUsers();
    }

    unsetPrefix() {
        this.prefix = '';
        this.prefixSet = false;
        this.loadUsers();
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.loadUsers();
    }

    handlePageEvent(e: PageEvent) {
        this.pageEvent = e;
        this.length = e.length;
        this.pageSize = e.pageSize;
        this.pageIndex = e.pageIndex;
        this.loadUsers();
    }

    sortChange(sortState: Sort) {
        this.sortColumns = [];
        if (sortState.direction === 'asc') {
            this.sortColumns.push({column: sortState.active, sortDirection: 1});
        } else {
            this.sortColumns.push({column: sortState.active, sortDirection: -1});
        }
        this.loadUsers();
    }

    loadUsers() {
        this.lastUpdate = new Date();
        this.store.dispatch(cognitoUserActions.loadUsers({
            prefix: this.state.value['cognito-user-list'].prefix,
            pageSize: this.state.value['cognito-user-list'].pageSize,
            pageIndex: this.state.value['cognito-user-list'].pageIndex,
            sortColumns: this.state.value['cognito-user-list'].sortColumns
        }));
    }

    addUser() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        this.dialog.open(UserAddComponentDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.createUser(result)
            }
        });
    }

    createUser(userName: string) {
        this.cognitoService.createUser(this.userPoolId, userName)
            .subscribe(() => {
                this.snackBar.open('User created, name: ' + userName, 'Done', {duration: 5000});
                this.loadUsers();
            });
    }

    confirmUser(userPoolId: string, userName: string) {
        this.lastUpdate = new Date();
        this.store.dispatch(cognitoUserActions.confirmUser({
            userPooId: userPoolId,
            userName: userName
        }));
    }

    deleteUser(userName: string) {
        this.cognitoService.deleteUser(this.userPoolId, userName)
            .subscribe(() => {
                this.snackBar.open('User deleted, name: ' + userName, 'Done', {duration: 5000});
                this.loadUsers();
            });
    }
}
