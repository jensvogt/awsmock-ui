import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {filter, interval, Observable, Subscription} from "rxjs";
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
import {S3ObjectCounterResponse} from "../model/s3-object-item";
import {selectObjectCounters} from "./state/s3-object-list.selectors";
import {ObjectUploadComponent} from "../object-upload/object-upload.component";
import {byteConversion} from "../../../shared/byte-utils.component";

@Component({
    selector: 's3-object-list',
    templateUrl: './object-list.component.html',
    styleUrls: ['./object-list.component.scss'],
    providers: [S3Service, AwsMockHttpService]
})
export class S3ObjectListComponent implements OnInit, OnDestroy, AfterViewInit {

    // Last update time
    lastUpdate: Date = new Date();

    // Table
    bucketName: string = '';
    pageSize$: Observable<number> = this.store.select(selectPageSize);
    pageIndex$: Observable<number> = this.store.select(selectPageIndex);
    s3ObjectCountersResponse$: Observable<S3ObjectCounterResponse> = this.store.select(selectObjectCounters);

    // Prefix
    prefix: string = '';
    prefixSet: boolean = false;

    // Auto-update
    updateSubscription: Subscription | undefined;

    // Paging
    columns: any[] = ['key', 'size', 'actions'];
    pageSizeOptions = [5, 10, 20, 50, 100];
    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;

    // Sorting
    sortColumns: SortColumn[] = [];
    protected readonly byteConversion = byteConversion;
    private sub: any;

    constructor(private snackBar: MatSnackBar, private dialog: MatDialog, private route: ActivatedRoute, private state: State<S3BucketListState>, private store: Store,
                private actionsSubj$: ActionsSubject, private location: Location, private s3Service: S3Service) {

        // Subscribe to action events, reload table when the action got successful executed
        this.actionsSubj$.pipe(
            filter((action) =>
                action.type === s3ObjectListActions.deleteObjectSuccess.type
            )
        ).subscribe(() => {
                this.lastUpdate = new Date();
                this.loadObjects();
            }
        );
    }

    ngOnInit(): void {
        this.sub = this.route.params.subscribe(params => {
            this.bucketName = decodeURI(params['bucketName']);
            this.state.value.bucketName = decodeURI(params['bucketName']);
        });
        this.updateSubscription = interval(60000).subscribe(() => this.loadObjects());
        this.loadObjects();
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
        this.loadObjects();
    }

    loadObjects() {
        this.store.dispatch(s3ObjectListActions.loadObjects({
            bucketName: this.bucketName,
            prefix: this.state.value['s3-object-list'].prefix,
            pageSize: this.state.value['s3-object-list'].pageSize,
            pageIndex: this.state.value['s3-object-list'].pageIndex,
            sortColumns: this.state.value['s3-object-list'].sortColumns
        }));
    }

    deleteObject(key: string) {
        this.store.dispatch(s3ObjectListActions.deleteObject({
            bucketName: this.bucketName,
            key: key,
        }));
    }

    uploadObject() {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {bucketName: this.bucketName}
        dialogConfig.height = "430px"

        this.dialog.open(ObjectUploadComponent, dialogConfig).afterClosed().subscribe((result: any) => {
            if (result) {
                this.snackBar.open('Object uploaded, bucket: ' + this.bucketName + ' key: ' + result.key, 'Done', {duration: 5000});
                this.doUpload(result.content, result.key);
            }
        });
    }

    // Method to handle file upload
    doUpload(content: Blob, key: string): void {
        this.s3Service.putObjects(this.bucketName, key, content).then(() =>
            this.loadObjects()
        );
    }
}
