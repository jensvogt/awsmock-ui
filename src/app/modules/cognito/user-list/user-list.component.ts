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
import {AutoReloadComponent} from "../../../shared/autoreload/auto-reload.component";

@Component({
    selector: 'cognito-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
    standalone: false,
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
    columns: any[] = ['userName', 'userStatus', 'enabled', 'created', 'modified', 'actions'];

    // Auto-update
    updateSubscription: Subscription | undefined;

    // Paging
    pageSizeOptions = [5, 10, 20, 50, 100];
    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;

    // Prefix
    prefixValue: string = this.state.value['cognito-user-list'].prefix;
    prefixSet: boolean = false;

    // Sorting
    sortColumns: SortColumn[] = [];
    private routerSubscription: any;

    constructor(private readonly snackBar: MatSnackBar, private readonly dialog: MatDialog, private readonly route: ActivatedRoute, private readonly location: Location, private readonly store: Store,
                private readonly state: State<CognitoUserListState>, private readonly cognitoService: CognitoService, private readonly actionsSubj$: ActionsSubject) {
        this.prefix$.subscribe((data: string) => {
            this.prefixSet = false;
            if (data?.length) {
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
       /* this.listUserCountersResponse$.subscribe((data) => {
            console.log("ListUserCountersResponse", data);
        })*/
    }

    ngOnInit(): void {
        this.routerSubscription = this.route.params.subscribe(params => {
            this.userPoolId = params['userPoolId'];
        });
        this.loadUsers();
        const period = parseInt(<string>localStorage.getItem("autoReload"));
        this.updateSubscription = interval(period).subscribe(() => this.loadUsers());
    }

    ngOnDestroy(): void {
        this.updateSubscription?.unsubscribe();
        this.routerSubscription?.unsubscribe();
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
                this.updateSubscription = interval(period).subscribe(() => this.loadUsers());
            }
        });
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
        this.state.value['cognito-user-list'].sortColumns = [{column: sortState.active, sortDirection: sortState.direction === 'asc' ? 1 : -1}];
        this.loadUsers();
    }

    loadUsers() {
        this.lastUpdate = new Date();
        this.store.dispatch(cognitoUserActions.loadUsers({
            userPoolId: this.userPoolId,
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
