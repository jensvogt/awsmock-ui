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
import {MatDialog} from "@angular/material/dialog";
import {MatTooltip} from "@angular/material/tooltip";
import {BreadcrumbComponent} from "../../../../shared/breadcrump/breadcrump.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AwsMockHttpService} from "../../../../services/awsmock-http.service";
import {S3Service} from "../../../../services/s3-service.component";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {NavigationService} from "../../../../services/navigation.service";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {UserPoolItem} from "../model/user-pool-item";

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
        NgIf
    ],
    styleUrls: ['./user-pool-list.component.scss'],
    providers: [S3Service, AwsMockHttpService]
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
                private navigation: NavigationService, private s3Service: S3Service, private awsmockHttpService: AwsMockHttpService) {
    }

    ngOnInit(): void {
        this.sub = this.route.params.subscribe(params => {
            this.bucketName = params['bucketName'];
        });
        this.loadObjects();
        this.updateSubscription = interval(60000).subscribe(() => this.loadObjects());
    }

    ngOnDestroy(): void {
        this.updateSubscription?.unsubscribe();
    }

    ngAfterViewInit() {
        // @ts-ignore
        this.objectData.sort = this.sort;
    }

    setPrefix() {
        this.prefixSet = true;
        this.loadObjects();
    }

    unsetPrefix() {
        this.prefix = '';
        this.prefixSet = false;
        this.loadObjects();
    }

    back() {
        this.navigation.back();
    }

    refresh() {
        this.loadObjects();
    }

    handlePageEvent(e: PageEvent) {
        this.pageEvent = e;
        this.length = e.length;
        this.pageSize = e.pageSize;
        this.pageIndex = e.pageIndex;
        this.loadObjects();
    }

    sortChange(sortState: Sort) {
        this.sortColumns = [];
        if (sortState.direction === 'asc') {
            this.sortColumns.push({column: sortState.active, sortDirection: 1});
        } else {
            this.sortColumns.push({column: sortState.active, sortDirection: -1});
        }
        this.loadObjects();
    }

    lastUpdateTime() {
        return new Date().toLocaleTimeString('DE-de');
    }

    loadObjects() {
        this.userPoolData = [];
        this.awsmockHttpService.listObjectsCounters(this.bucketName, this.prefix, this.pageSize, this.pageIndex, this.sortColumns)
            .subscribe((data: any) => {
                this.lastUpdate = this.lastUpdateTime();
                this.nextToken = data.NextContinuationToken;
                if (data.objectCounters) {
                    this.length = data.total;
                    /*data.objectCounters.forEach((b: any) => {
                        this.objectData.push({
                            bucket: this.bucketName,
                            key: b.keys,
                            size: b.size,
                        });
                    });*/
                }
                this.userPoolDataSource.data = this.userPoolData;
            });
    }

    deleteObject(key: string) {
        this.s3Service.deleteObject(this.bucketName, key)
            .then(() => {
                this.snackBar.open('Object deleted, bucket: ' + this.bucketName + ' key: ' + key, 'Done', {duration: 5000});
                this.loadObjects();
            })
            .catch((error: any) => console.error(error))
            .finally(() => {
                this.s3Service.cleanup();
            });
    }

    uploadObject() {

        /*const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {bucketName: this.bucketName}

        this.dialog.open(ObjectUploadComponent, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.loadObjects();
                this.snackBar.open('Object uploaded, bucket: ' + this.bucketName + ' key: ' + result, 'Done', {duration: 5000});
            }
        });*/
    }

    //
    // addBucket() {
    //
    //     const dialogConfig = new MatDialogConfig();
    //
    //     dialogConfig.disableClose = true;
    //     dialogConfig.autoFocus = true;
    //
    //     this.dialog.open(BucketAddComponentDialog, dialogConfig).afterClosed().subscribe(result => {
    //         if (result) {
    //             this.createBucket(result)
    //             this.loadBuckets();
    //         }
    //     });
    // }
    //
    // createBucket(bucketName: string) {
    //     this.s3Service.createBucket(bucketName)
    //         .then(() => {
    //             this.loadBuckets();
    //         })
    //         .catch((error: any) => console.error(error))
    //         .finally(() => {
    //             this.s3Service.cleanup();
    //         });
    // }
    //
    // listObjects(bucketName: string) {
    //
    // }
    //
    //
    // deleteBucket(bucketName: string) {
    //     this.s3Service.deleteBucket(bucketName)
    //         .then(() => {
    //             this.loadBuckets();
    //         })
    //         .catch((error: any) => console.error(error))
    //         .finally(() => {
    //             this.s3Service.cleanup();
    //         });
    // }
}
