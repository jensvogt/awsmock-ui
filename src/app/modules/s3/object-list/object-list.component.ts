import {Component, OnDestroy, OnInit} from '@angular/core';
import {interval, Observable, Subscription} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {Sort} from "@angular/material/sort";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AwsMockHttpService} from "../../../services/awsmock-http.service";
import {S3Service} from "../service/s3-service.component";
import {ActivatedRoute} from "@angular/router";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {ActionsSubject, State, Store} from "@ngrx/store";
import {S3BucketListState} from "../bucket-list/state/s3-bucket-list.reducer";
import {Location} from "@angular/common";
import {s3ObjectListActions} from "./state/s3-object-list.actions";
import {selectPageIndex, selectPageSize} from "../bucket-list/state/s3-bucket-list.selectors";
import {S3ObjectCounterResponse, S3ObjectItem, S3ObjectMetadata} from "../model/s3-object-item";
import {selectObjectCounters} from "./state/s3-object-list.selectors";
import {ObjectUploadComponent} from "../object-upload/object-upload.component";
import {byteConversion} from "../../../shared/byte-utils.component";
import {S3ObjectDownloadComponent} from "./download/s3-object-download.component";
import {S3ObjectViewDialog} from "./view/object-view.component";
import {ofType} from "@ngrx/effects";
import {s3BucketListActions} from "../bucket-list/state/s3-bucket-list.actions";

@Component({
    selector: 's3-object-list',
    templateUrl: './object-list.component.html',
    styleUrls: ['./object-list.component.scss'],
    standalone: false,
    providers: [S3Service, AwsMockHttpService]
})
export class S3ObjectListComponent implements OnInit, OnDestroy {

    // Last update time
    lastUpdate: Date = new Date();

    // Table
    bucketName: string = '';
    pageSize$: Observable<number> = this.store.select(selectPageSize);
    pageIndex$: Observable<number> = this.store.select(selectPageIndex);
    s3ObjectCountersResponse$: Observable<S3ObjectCounterResponse> = this.store.select(selectObjectCounters);

    // Prefix
    prefixValue: string = '';
    prefixSet: boolean = false;

    // Auto-update
    updateSubscription: Subscription | undefined;

    // Paging
    columns: any[] = ['key', 'contentType', 'size', 'created', 'modified', 'actions'];
    pageSizeOptions = [5, 10, 20, 50, 100];
    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;

    // Sorting
    sortColumns: SortColumn[] = [];
    protected readonly byteConversion = byteConversion;
    protected routerSubscription: any;

    constructor(private snackBar: MatSnackBar, private dialog: MatDialog, private route: ActivatedRoute, private state: State<S3BucketListState>, private store: Store,
                private location: Location, private s3Service: S3Service, private actionsSubject$: ActionsSubject) {
    }

    ngOnInit(): void {
        this.routerSubscription = this.route.params.subscribe(params => {
            this.bucketName = decodeURI(params['bucketName']);
            this.state.value.bucketName = decodeURI(params['bucketName']);
        });
        this.updateSubscription = interval(60000).subscribe(() => this.loadObjects());
        this.loadObjects();
        this.actionsSubject$.pipe(ofType(s3BucketListActions.addBucketSuccess)).subscribe(() => {
            this.loadObjects();
        });
        this.actionsSubject$.pipe(ofType(s3BucketListActions.purgeBucketSuccess)).subscribe(() => {
            this.loadObjects();
        });
        this.actionsSubject$.pipe(ofType(s3BucketListActions.deleteBucketSuccess)).subscribe(() => {
            this.loadObjects();
        });
    }

    ngOnDestroy(): void {
        this.updateSubscription?.unsubscribe();
    }

    setPrefix() {
        this.prefixSet = true;
        this.state.value['s3-object-list'].prefix = this.prefixValue;
        this.loadObjects();
    }

    unsetPrefix() {
        this.prefixValue = '';
        this.prefixSet = false;
        this.state.value['s3-object-list'].prefix = '';
        this.loadObjects();
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.loadObjects();
    }

    handlePageEvent(e: PageEvent) {
        this.state.value['s3-object-list'].pageSize = e.pageSize;
        this.state.value['s3-object-list'].pageIndex = e.pageIndex;
        this.store.dispatch(s3ObjectListActions.loadObjects({
            bucketName: this.bucketName,
            prefix: this.state.value['s3-object-list'].prefix,
            pageSize: this.state.value['s3-object-list'].pageSize,
            pageIndex: this.state.value['s3-object-list'].pageIndex,
            sortColumns: this.state.value['s3-object-list'].sortColumns
        }));
    }

    sortChange(sortState: Sort) {
        this.sortColumns = [];
        if (sortState.direction === 'asc') {
            this.sortColumns.push({column: sortState.active, sortDirection: 1});
        } else {
            this.sortColumns.push({column: sortState.active, sortDirection: -1});
        }
        this.state.value['s3-object-list'].sortColumns = this.sortColumns;
        this.loadObjects();
    }

    loadObjects() {
        this.lastUpdate = new Date();
        this.store.dispatch(s3ObjectListActions.loadObjects({
            bucketName: this.bucketName,
            prefix: this.state.value['s3-object-list'].prefix,
            pageSize: this.state.value['s3-object-list'].pageSize,
            pageIndex: this.state.value['s3-object-list'].pageIndex,
            sortColumns: this.state.value['s3-object-list'].sortColumns
        }));
    }

    downloadObject(bucketName: string, key: string) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {bucketName: bucketName, key: key}
        dialogConfig.height = "430px"

        this.dialog.open(S3ObjectDownloadComponent, dialogConfig).afterClosed().subscribe((result: any) => {
            if (result) {
                this.snackBar.open('Object downloaded, bucket: ' + this.bucketName + ' key: ' + result, 'Done', {duration: 5000});
            }
        });
    }

    deleteObject(key: string) {
        this.store.dispatch(s3ObjectListActions.deleteObject({
            bucketName: this.bucketName,
            key: key,
        }));
    }

    touchObject(key: string) {
        this.store.dispatch(s3ObjectListActions.touchObject({
            bucketName: this.bucketName,
            key: key,
        }));
    }

    uploadObject() {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {bucketName: this.bucketName};
        dialogConfig.maxWidth = '100vw';
        dialogConfig.maxHeight = '100vh';
        dialogConfig.width = "40%"
        dialogConfig.panelClass = 'full-screen-modal';

        this.dialog.open(ObjectUploadComponent, dialogConfig).afterClosed().subscribe((result: any) => {
            if (result) {
                this.doUpload(result.content, result.key, result.metadata);
                this.snackBar.open('Object uploaded, bucket: ' + this.bucketName + ' key: ' + result.key, 'Done', {duration: 5000});
            }
        });
    }

    viewObject(object: S3ObjectItem) {

        let downloadFlag = true;
        if (object !== undefined) {
            if (object.size !== undefined && object.size > 1024 * 1024) {
                this.snackBar.open("Object to big, maxSize: 1MB", "Error", {duration: 5000});
                downloadFlag = false;
            }
            if (object.contentType !== undefined && !this.hasAllowedContentType(object.contentType)) {
                this.snackBar.open("Invalid content type: " + object.contentType, "Error", {duration: 5000});
                downloadFlag = false;
            }

            const dialogConfig = new MatDialogConfig();

            dialogConfig.disableClose = true;
            dialogConfig.autoFocus = true;
            dialogConfig.maxWidth = '100vw';
            dialogConfig.maxHeight = '100vh';
            dialogConfig.panelClass = 'full-screen-modal';
            dialogConfig.width = "80%"
            dialogConfig.minWidth = '280px'
            dialogConfig.data = {bucketName: this.bucketName, key: object.key, contentType: object.contentType, metadata: object.metadata, downloadFlag: downloadFlag};

            this.dialog.open(S3ObjectViewDialog, dialogConfig).afterClosed().subscribe(() => {
            });
        }
    }

    // Method to handle file upload
    doUpload(content: Blob, key: string, metadata: S3ObjectMetadata[]): void {
        this.s3Service.putObject(this.bucketName, key, content, metadata).then(() =>
            this.loadObjects()
        );
    }

    hasAllowedContentType(contentType: string) {
        return contentType === "application/xml" || contentType === "application/json" || contentType === "text/html" || contentType === "text/xml"
            || contentType.startsWith("text/plain") || contentType.startsWith("image/jpg") || contentType.startsWith("image/jpeg")
            || contentType.startsWith("image/png") || contentType.startsWith("image/gif");
    }
}
