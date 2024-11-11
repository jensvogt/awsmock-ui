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
import {AwsMockCognitoService} from "../../../services/cognito.service";
import {UserItem} from "../model/user-item";
import {UserAddComponentDialog} from "../user-add/user-add.component";

@Component({
    selector: 'cognito-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
    providers: [AwsMockCognitoService]
})
export class CognitoUserListComponent implements OnInit, OnDestroy {
    lastUpdate: string = '';

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

    constructor(private snackBar: MatSnackBar, private dialog: MatDialog, private route: ActivatedRoute, private location: Location,
                private cognitoService: AwsMockCognitoService) {
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

    lastUpdateTime() {
        return new Date().toLocaleTimeString('DE-de');
    }

    loadUsers() {
        this.userData = [];
        this.cognitoService.listUsers(this.userPoolId, this.pageSize, this.pageIndex, this.sortColumns)
            .subscribe((data: any) => {
                this.lastUpdate = this.lastUpdateTime();
                if (data.Users) {
                    this.length = data.Total;
                    data.Users.forEach((b: any) => {
                        this.userData.push({
                            id: b.oid,
                            userName: b.Username,
                            userPoolId: this.userPoolId,
                            enabled: b.Enabled,
                            status: b.UserStatus
                        });
                    });
                }
                this.userDataSource.data = this.userData;
            });
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

    deleteUser(userName: string) {
        this.cognitoService.deleteUser(this.userPoolId, userName)
            .subscribe(() => {
                this.snackBar.open('User deleted, name: ' + userName, 'Done', {duration: 5000});
                this.loadUsers();
            });
    }
}
