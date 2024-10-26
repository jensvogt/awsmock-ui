import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle} from "@angular/material/card";
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatNoDataRow,
    MatRow,
    MatRowDef,
    MatTable,
    MatTableDataSource
} from "@angular/material/table";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {interval, Subscription} from "rxjs";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort, MatSortHeader, Sort} from "@angular/material/sort";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatTooltip} from "@angular/material/tooltip";
import {BreadcrumbComponent} from "../../../shared/breadcrump/breadcrump.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {NavigationService} from "../../../services/navigation.service";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {DatePipe, NgIf} from "@angular/common";
import {UserPoolItem} from "../model/user-pool-item";
import {AwsMockCognitoService} from "../../../services/cognito.service";
import {UserPoolAddComponentDialog} from "../user-pool-add/user-pool-add.component";
import {MatListItem, MatNavList} from "@angular/material/list";

@Component({
    selector: 'cognito-user-pool-list',
    templateUrl: './user-pool-list.component.html',
    standalone: true,
    imports: [
        MatCard,
        MatCardHeader,
        MatCardContent,
        MatCardActions,
        MatCardSubtitle,
        MatTable,
        MatHeaderCellDef,
        MatCellDef,
        MatColumnDef,
        MatIcon,
        MatHeaderCell,
        MatCell,
        MatHeaderRowDef,
        MatHeaderRow,
        MatSortHeader,
        MatRowDef,
        MatNoDataRow,
        MatIconButton,
        MatRow,
        MatPaginator,
        MatSort,
        MatTooltip,
        BreadcrumbComponent,
        RouterLink,
        FormsModule,
        MatFormField,
        MatInput,
        MatLabel,
        MatSuffix,
        NgIf,
        DatePipe,
        MatListItem,
        MatNavList
    ],
    styleUrls: ['./user-pool-list.component.scss'],
    providers: [AwsMockCognitoService]
})
export class UserPoolListComponent implements OnInit, OnDestroy, AfterViewInit {
    lastUpdate: string = '';

    // Table
    bucketName: string = '';
    prefix: string = '';
    prefixSet: boolean = false;
    userPoolData: Array<UserPoolItem> = [];
    userPoolDataSource = new MatTableDataSource(this.userPoolData);
    columns: any[] = ['key', 'size', 'actions'];

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

    constructor(private snackBar: MatSnackBar, private dialog: MatDialog, private route: ActivatedRoute,
                private router: Router, private navigation: NavigationService,
                private cognitoService: AwsMockCognitoService) {
    }

    ngOnInit(): void {
        this.sub = this.route.params.subscribe(params => {
            this.bucketName = params['bucketName'];
        });
        this.loadUserpools();
        this.updateSubscription = interval(60000).subscribe(() => this.loadUserpools());
    }

    ngOnDestroy(): void {
        this.updateSubscription?.unsubscribe();
    }

    ngAfterViewInit() {
        // @ts-ignore
        // this.userData.sort = this.sort;
    }

    setPrefix() {
        this.prefixSet = true;
        this.loadUserpools();
    }

    unsetPrefix() {
        this.prefix = '';
        this.prefixSet = false;
        this.loadUserpools();
    }

    back() {
        this.navigation.back();
    }

    refresh() {
        this.loadUserpools();
    }

    handlePageEvent(e: PageEvent) {
        this.pageEvent = e;
        this.length = e.length;
        this.pageSize = e.pageSize;
        this.pageIndex = e.pageIndex;
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

    lastUpdateTime() {
        return new Date().toLocaleTimeString('DE-de');
    }

    loadUserpools() {
        this.userPoolData = [];
        this.cognitoService.listUserPools(this.pageSize, this.pageIndex, this.sortColumns)
            .subscribe((data: any) => {
                this.lastUpdate = this.lastUpdateTime();
                this.nextToken = data.NextContinuationToken;
                if (data.UserPools) {
                    this.length = data.Total;
                    data.UserPools.forEach((b: any) => {
                        this.userPoolData.push({
                            id: b.Id,
                            userPoolId: b.Id,
                            created: new Date(b.CreationDate * 1000),
                            modified: new Date(b.LastModifiedDate),
                            region: b.Region
                        });
                    });
                }
                this.userPoolDataSource.data = this.userPoolData;
            });
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
        this.cognitoService.createUserPool(userPoolName)
            .subscribe(() => {
                this.snackBar.open('Userpool created, name: ' + userPoolName, 'Done', {duration: 5000});
                this.loadUserpools();
            });
    }

    deleteUserPool(userPoolId: string) {
        this.cognitoService.deleteUserPool(userPoolId)
            .subscribe(() => {
                this.snackBar.open('Userpool deleted, Id: ' + userPoolId, 'Done', {duration: 5000});
                this.loadUserpools();
            });
    }

    listUsers(userPoolId: string) {
        this.router.navigate(['/cognito-user-list', userPoolId]);
    }
}
