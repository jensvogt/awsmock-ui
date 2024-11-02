import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {filter, interval, Observable, Subscription} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {Sort} from "@angular/material/sort";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AwsMockHttpService} from "../../../services/awsmock-http.service";
import {S3Service} from "../service/s3-service.component";
import {BucketAddComponentDialog} from "../bucket-add/bucket-add.component";
import {Router} from "@angular/router";
import {byteConversion} from "../../../shared/byte-utils.component";
import {S3BucketCountersResponse} from "../model/s3-bucket-item";
import {selectBucketCounters, selectPageIndex, selectPageSize} from "./state/s3-bucket-list.selectors";
import {ActionsSubject, State, Store} from "@ngrx/store";
import {Location} from "@angular/common";
import {S3BucketListState} from "./state/s3-bucket-list.reducer";
import {s3BucketListActions} from "./state/s3-bucket-list.actions";

@Component({
    selector: 's3-bucket-list',
    templateUrl: './bucket-list.component.html',
    styleUrls: ['./bucket-list.component.scss'],
    providers: [S3Service, AwsMockHttpService]
})
export class S3BucketListComponent implements OnInit, OnDestroy, AfterViewInit {

    // Last update
    lastUpdate: Date = new Date();

    // Table
    pageSize$: Observable<number> = this.store.select(selectPageSize);
    pageIndex$: Observable<number> = this.store.select(selectPageIndex);
    s3BucketCountersResponse$: Observable<S3BucketCountersResponse> = this.store.select(selectBucketCounters);
    columns: any[] = ['name', 'objects', 'size', 'actions'];

    // Auto-update
    updateSubscription: Subscription | undefined;

    // Prefix
    prefixSet: boolean = false;
    prefix: string = '';

    // Paging
    length = 0;
    pageSizeOptions = [5, 10, 20, 50, 100];
    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;

    // Byte conversion
    protected readonly byteConversion = byteConversion;

    constructor(private snackBar: MatSnackBar, private dialog: MatDialog, private router: Router, private state: State<S3BucketListState>, private store: Store,
                private actionsSubj$: ActionsSubject, private location: Location) {

        // Subscribe to action events, reload table when the action got successful executed
        this.actionsSubj$.pipe(
            filter((action) =>
                action.type === s3BucketListActions.addBucketSuccess.type ||
                action.type === s3BucketListActions.purgeBucketSuccess.type ||
                action.type === s3BucketListActions.deleteBucketSuccess.type
            )
        ).subscribe(() => {
                this.lastUpdate = new Date();
                this.loadBuckets();
            }
        );
    }

    ngOnInit(): void {
        this.loadBuckets();
        this.updateSubscription = interval(60000).subscribe(() => this.loadBuckets());
    }

    ngAfterViewInit() {
        // @ts-ignore
        this.dataSource.sort = this.sort;
    }

    ngOnDestroy(): void {
        this.updateSubscription?.unsubscribe();
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.loadBuckets();
    }

    setPrefix() {
        this.prefixSet = true;
        this.loadBuckets();
    }

    unsetPrefix() {
        this.prefix = '';
        this.prefixSet = false;
        this.loadBuckets();
    }

    handlePageEvent(e: PageEvent) {
        this.state.value['s3-bucket-list'].pageSize = e.pageSize;
        this.state.value['s3-bucket-list'].pageIndex = e.pageIndex;
        this.store.dispatch(s3BucketListActions.loadBuckets({
            prefix: this.state.value['s3-bucket-list'].prefix,
            pageSize: this.state.value['s3-bucket-list'].pageSize,
            pageIndex: this.state.value['s3-bucket-list'].pageIndex,
            sortColumns: this.state.value['s3-bucket-list'].sortColumns
        }));
    }

    sortChange(sortState: Sort) {
        this.state.value['s3-bucket-list'].sortColumns = [];
        let direction = 1;
        let column = 'keys';
        if (sortState.active === 'size') {
            column = 'size'
        } else if (sortState.active === 'name') {
            column = 'name';
        }
        if (sortState.direction === 'asc') {
            direction = 1;
        } else {
            direction = -1;
        }
        this.state.value['s3-bucket-list'].sortColumns = [{column: column, sortDirection: direction}];
        this.loadBuckets();
    }

    loadBuckets() {
        this.store.dispatch(s3BucketListActions.loadBuckets({
            prefix: this.state.value['s3-bucket-list'].prefix,
            pageSize: this.state.value['s3-bucket-list'].pageSize,
            pageIndex: this.state.value['s3-bucket-list'].pageIndex,
            sortColumns: this.state.value['s3-bucket-list'].sortColumns
        }));
    }

    addBucket() {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        this.dialog.open(BucketAddComponentDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.store.dispatch(s3BucketListActions.addBucket({bucketName: result}));
            }
        });
    }

    listObjects(bucketName: string) {
        this.router.navigate(['/s3-object-list', bucketName]);
    }

    purgeBucket(bucketName: string) {
        this.store.dispatch(s3BucketListActions.purgeBucket({bucketName: bucketName}));
    }

    deleteBucket(bucketName: string) {
        this.store.dispatch(s3BucketListActions.deleteBucket({bucketName: bucketName}));
    }
}
