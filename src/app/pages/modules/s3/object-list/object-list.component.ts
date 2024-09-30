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
import {MatSort, MatSortHeader, Sort} from "@angular/material/sort";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatTooltip} from "@angular/material/tooltip";
import {BreadcrumbComponent} from "../../../../shared/breadcrump/breadcrump.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AwsMockHttpService} from "../../../../services/awsmock-http.service";
import {S3Service} from "../../../../services/s3-service.component";
import {ObjectItem} from "../model/object-item";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {ObjectUploadComponent} from "../object-upload/object-upload.component";
import {NavigationService} from "../../../../services/navigation.service";

@Component({
    selector: 's3-object-list',
    templateUrl: './object-list.component.html',
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
        RouterLink
    ],
    styleUrls: ['./object-list.component.scss'],
    providers: [S3Service, AwsMockHttpService]
})
export class ObjectListComponent implements OnInit, OnDestroy, AfterViewInit {
    lastUpdate: string = '';

    // Table
    bucketName: string = '';
    objectData: Array<ObjectItem> = [];
    objectDataDataSource = new MatTableDataSource(this.objectData);
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
    private sub: any;

    // Sorting
    private _liveAnnouncer = inject(LiveAnnouncer);

    constructor(private snackBar: MatSnackBar, private dialog: MatDialog, private route: ActivatedRoute,
                private navigation: NavigationService, private s3Service: S3Service, private awsmockHttpService: AwsMockHttpService) {
    }

    // @ts-ignore
    @ViewChild(MatSort) set matSort(sort: MatSort) {
        this.objectDataDataSource.sort = sort;
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
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
    }

    lastUpdateTime() {
        return new Date().toLocaleTimeString('DE-de');
    }

    loadObjects() {
        this.objectData = [];
        this.s3Service.listObjects(this.bucketName, this.pageSize, this.pageIndex)
            .then((data: any) => {
                this.lastUpdate = this.lastUpdateTime();
                this.nextToken = data.NextContinuationToken;
                if (data.Contents) {
                    this.length = data.Contents?.length;
                    data.Contents.forEach((b: any) => {
                        this.objectData.push({
                            bucket: this.bucketName,
                            key: b.Key,
                            size: b.Size,
                        });
                    });
                }
                this.objectDataDataSource.data = this.objectData;
            })
            .catch((error: any) => console.error(error))
            .finally(() => {
                this.s3Service.cleanup();
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

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {bucketName: this.bucketName}

        this.dialog.open(ObjectUploadComponent, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.loadObjects();
                this.snackBar.open('Object uploaded, bucket: ' + this.bucketName + ' key: ' + result, 'Done', {duration: 5000});
            }
        });
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
