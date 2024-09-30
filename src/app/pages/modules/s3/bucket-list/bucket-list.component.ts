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
import {MatButton, MatIconButton} from "@angular/material/button";
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
import {Router, RouterLink} from "@angular/router";
import {NavigationService} from "../../../../services/navigation.service";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";

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
        BreadcrumbComponent,
        RouterLink,
        MatFormField,
        MatInput,
        MatLabel,
        FormsModule,
        MatButton,
        MatSuffix
    ],
    styleUrls: ['./bucket-list.component.scss'],
    providers: [S3Service, AwsMockHttpService]
})
export class BucketListComponent implements OnInit, OnDestroy, AfterViewInit {
    lastUpdate: string = '';

    // Table
    bucketData: Array<BucketItem> = [];
    bucketDataDataSource = new MatTableDataSource(this.bucketData);
    columns: any[] = ['bucketName', 'objects', 'size', 'actions'];

    // Auto-update
    updateSubscription: Subscription | undefined;

    // Prefix
    prefix: string = '';

    // Paging
    length = 0;
    pageSize = 10;
    pageIndex = 0;
    pageSizeOptions = [5, 10, 20, 50, 100];
    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;
    pageEvent: PageEvent = {length: 0, pageIndex: 0, pageSize: 0};

    // Sorting
    private _liveAnnouncer = inject(LiveAnnouncer);

    constructor(private snackBar: MatSnackBar, private dialog: MatDialog, private router: Router,
                private navigation: NavigationService, private s3Service: S3Service, private awsmockHttpService: AwsMockHttpService) {
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

    back() {
        this.navigation.back();
    }

    refresh() {
        this.loadBuckets();
    }

    setPrefix() {
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
        const sortColumns: string[] = ['name'];
        this.awsmockHttpService.listBucketCounters(this.prefix, this.pageSize, this.pageIndex, sortColumns)
            .subscribe((data: any) => {
                this.lastUpdate = this.lastUpdateTime();
                this.length = data.total;
                if (data.bucketCounters) {
                    data.bucketCounters.forEach((b: any) => {
                        this.bucketData.push({
                            bucketName: b.bucketName,
                            keys: b.keys,
                            size: b.size,
                        });
                    });
                }
                this.bucketDataDataSource.data = this.bucketData;
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
