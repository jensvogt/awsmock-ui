import {Component, OnDestroy, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {filter, interval, Observable, Subscription} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {Sort} from "@angular/material/sort";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute} from "@angular/router";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {CognitoService} from "../service/cognito.service";
import {UserAddComponentDialog} from "../user-add/user-add.component";
import {ActionsSubject, State, Store} from "@ngrx/store";
import {cognitoUserActions} from "./state/cognito-user-list.actions";
import {selectPageIndex, selectPageSize, selectPrefix} from "../user-pool-list/state/cognito-userpool-list.selectors";
import {CognitoUserListState} from "./state/cognito-user-list.reducer";
import {UserCountersResponse} from "../model/user-item";
import {selectUsersCounters} from "./state/cognito-user-list.selectors";

@Component({
    selector: 'cognito-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
    providers: [CognitoService]
})
export class CognitoUserListComponent implements OnInit, OnDestroy {

    // Last update
    lastUpdate: Date = new Date();

    // Table
    userPoolId: string = '';
    pageSize$: Observable<number> = this.store.select(selectPageSize);
    pageIndex$: Observable<number> = this.store.select(selectPageIndex);
    prefix$: Observable<string> = this.store.select(selectPrefix);
    listUserCountersResponse$: Observable<UserCountersResponse> = this.store.select(selectUsersCounters);
    columns: any[] = ['userName', 'status', 'enabled', 'created', 'modified', 'actions'];

    // Auto-update
    updateSubscription: Subscription | undefined;

    // Paging
    pageSizeOptions = [5, 10, 20, 50, 100];
    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;
    pageEvent: PageEvent = {length: 0, pageIndex: 0, pageSize: 0};

    // Prefix
    prefixValue: string = this.state.value['cognito-user-list'].prefix;
    prefixSet: boolean = false;

    // Sorting
    sortColumns: SortColumn[] = [];
    private routerSubscription: any;

    constructor(private snackBar: MatSnackBar, private dialog: MatDialog, private route: ActivatedRoute, private location: Location, private store: Store,
                private state: State<CognitoUserListState>, private cognitoService: CognitoService, private actionsSubj$: ActionsSubject) {
        this.prefix$.subscribe((data: string) => {
            this.prefixSet = false;
            if (data && data.length) {
                this.prefixValue = data;
                this.prefixSet = true;
            }
        });
        this.actionsSubj$.pipe(
            filter((action) =>
                action.type === cognitoUserActions.addUserSuccess.type ||
                action.type === cognitoUserActions.confirmUserSuccess.type ||
                action.type === cognitoUserActions.deleteUserSuccess.type
            )
        ).subscribe(() => {
                this.loadUsers();
            }
        );
    }

    ngOnInit(): void {
        this.routerSubscription = this.route.params.subscribe(params => {
            this.userPoolId = params['userPoolId'];
        });
        this.loadUsers();
        this.updateSubscription = interval(60000).subscribe(() => this.loadUsers());
    }

    ngOnDestroy(): void {
        this.updateSubscription?.unsubscribe();
        this.routerSubscription?.unsubscribe();
    }

    setPrefix() {
        this.prefixSet = true;
        this.state.value['cognito-user-list'].pageIndex = 0;
        this.state.value['cognito-user-list'].prefix = this.prefixValue;
        this.loadUsers();
    }

    unsetPrefix() {
        this.prefixValue = '';
        this.prefixSet = false;
        this.state.value['cognito-user-list'].prefix = '';
        this.loadUsers();
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.loadUsers();
    }

    handlePageEvent(e: PageEvent) {
        this.state.value['cognito-user-list'].pageSize = e.pageSize;
        this.state.value['cognito-user-list'].pageIndex = e.pageIndex;
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
