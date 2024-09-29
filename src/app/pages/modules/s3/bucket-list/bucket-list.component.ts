import {AfterViewInit, Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
import {BucketItem} from "../model/bucket-item";
import {MatSort, MatSortHeader, Sort} from "@angular/material/sort";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatTooltip} from "@angular/material/tooltip";
import {BreadcrumbComponent} from "../../../../shared/breadcrump/breadcrump.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AwsMockHttpService} from "../../../../services/awsmock-http.service";
import {S3Service} from "../../../../services/s3-service.component";
import {BucketAddComponentDialog} from "../bucket-add/bucket-add.component";
import {Router} from "@angular/router";

@Component({
    selector: 's3-bucket-list',
    templateUrl: './bucket-list.component.html',
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
        BreadcrumbComponent
    ],
    styleUrls: ['./bucket-list.component.scss'],
    providers: [S3Service, AwsMockHttpService]
})
export class BucketListComponent implements OnInit, OnDestroy, AfterViewInit {
    lastUpdate: string = '';

    // Table
    bucketData: Array<BucketItem> = [];
    bucketDataDataSource = new MatTableDataSource(this.bucketData);
    columns: any[] = ['bucketName', 'actions'];

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
    private _liveAnnouncer = inject(LiveAnnouncer);

    constructor(private snackBar: MatSnackBar, private dialog: MatDialog, private router: Router, private s3Service: S3Service, private awsmockHttpService: AwsMockHttpService) {
    }

    // @ts-ignore
    @ViewChild(MatSort) set matSort(sort: MatSort) {
        this.bucketDataDataSource.sort = sort;
    }

    ngOnInit(): void {
        this.loadBuckets();
        this.updateSubscription = interval(60000).subscribe(() => this.loadBuckets());
    }

    ngOnDestroy(): void {
        this.updateSubscription?.unsubscribe();
    }

    ngAfterViewInit() {
        // @ts-ignore
        this.bucketData.sort = this.sort;
    }

    refresh() {
        this.loadBuckets();
    }

    handlePageEvent(e: PageEvent) {
        this.pageEvent = e;
        this.length = e.length;
        this.pageSize = e.pageSize;
        this.pageIndex = e.pageIndex;
        this.loadBuckets();
    }

    sortChange(sortState: Sort) {
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
    }

    lastUpdateTime() {
        return new Date().toLocaleTimeString('DE-de');
    }

    loadBuckets() {
        this.bucketData = [];
        this.s3Service.listBuckets(this.pageSize, this.pageIndex)
            .then((data: any) => {
                this.lastUpdate = this.lastUpdateTime();
                this.nextToken = data.NextToken;
                this.length = data.Total;
                data.Buckets.forEach((b: any) => {
                    this.bucketData.push({
                        bucketName: b.Name,
                    });
                });
                this.bucketDataDataSource.data = this.bucketData;
            })
            .catch((error: any) => console.error(error))
            .finally(() => {
                this.s3Service.cleanup();
            });
    }

    addBucket() {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        this.dialog.open(BucketAddComponentDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.createBucket(result)
                this.loadBuckets();
            }
        });
    }

    createBucket(bucketName: string) {
        this.s3Service.createBucket(bucketName)
            .then(() => {
                this.loadBuckets();
            })
            .catch((error: any) => console.error(error))
            .finally(() => {
                this.s3Service.cleanup();
            });
    }

    listObjects(bucketName: string) {
        this.router.navigate(['/s3-object-list', bucketName]);
    }

    deleteObjects(bucketName: string) {
        this.s3Service.deleteObjects(bucketName)
            .then(() => {
                this.loadBuckets();
            })
            .catch((error: any) => console.error(error))
            .finally(() => {
                this.s3Service.cleanup();
            });
    }

    deleteBucket(bucketName: string) {
        this.s3Service.deleteBucket(bucketName)
            .then(() => {
                this.loadBuckets();
            })
            .catch((error: any) => console.error(error))
            .finally(() => {
                this.s3Service.cleanup();
            });
    }
}
