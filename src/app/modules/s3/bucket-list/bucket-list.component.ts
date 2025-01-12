import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {debounceTime, distinctUntilChanged, filter, interval, merge, Observable, Subject, Subscription, tap} from "rxjs";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AwsMockHttpService} from "../../../services/awsmock-http.service";
import {S3Service} from "../service/s3-service.component";
import {BucketAddComponentDialog} from "../bucket-add/bucket-add.component";
import {Router} from "@angular/router";
import {byteConversion} from "../../../shared/byte-utils.component";
import {S3BucketCountersResponse, S3BucketItem} from "../model/s3-bucket-item";
import {selectBucketCounters, selectIsLoading, selectPageIndex, selectPageSize, selectPrefix} from "./state/s3-bucket-list.selectors";
import {ActionsSubject, select, State, Store} from "@ngrx/store";
import {Location} from "@angular/common";
import {S3BucketListState} from "./state/s3-bucket-list.reducer";
import {s3BucketListActions} from "./state/s3-bucket-list.actions";
import {MatTableDataSource} from "@angular/material/table";

@Component({
    selector: 's3-bucket-list',
    templateUrl: './bucket-list.component.html',
    styleUrls: ['./bucket-list.component.scss'],
    standalone: false,
    providers: [S3Service, AwsMockHttpService]
})
export class S3BucketListComponent implements OnInit, OnDestroy, AfterViewInit {

    // Last update
    lastUpdate: Date = new Date();

    // Table
    loading: boolean = false;
    noData: S3BucketItem[] = [<S3BucketItem>{}];
    pageSize$: Observable<number> = this.store.select(selectPageSize);
    prefix$: Observable<string> = this.store.select(selectPrefix);
    pageIndex$: Observable<number> = this.store.select(selectPageIndex);
    s3BucketCountersResponse$: Observable<S3BucketCountersResponse> = this.store.select(selectBucketCounters);
    columns: any[] = ['name', 'keys', 'size', 'created', 'modified', 'actions'];
    dataSource: MatTableDataSource<S3BucketItem> = new MatTableDataSource();
    defaultSort: Sort = {active: "keys", direction: "desc"};
    filterSubject = new Subject<string>();

    // Auto-update
    updateSubscription: Subscription = new Subscription();
    tableSubscription: Subscription = new Subscription();

    // Prefix
    prefixSet: boolean = false;
    prefixValue: string = '';

    // Paging
    total = 0;
    pageSizeOptions = [5, 10, 20, 50, 100];
    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;

    // Sorting/paging
    @ViewChild(MatSort, {static: false}) sort: MatSort | undefined;

    // Byte conversion
    protected readonly byteConversion = byteConversion;
    @ViewChild(MatPaginator, {static: false}) private paginator: MatPaginator | undefined;
    private filter: string = "";

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
        this.prefix$.subscribe((data: string) => {
            this.prefixSet = false;
            if (data && data.length) {
                this.prefixValue = data;
                this.prefixSet = true;
            }
        })
    }

    ngOnInit(): void {
        this.store
            .pipe(select(selectBucketCounters))
            .subscribe((buckets) => {
                this.initializeData(buckets.bucketCounters);
                this.total = buckets.total;
            });
        this.tableSubscription.add(
            this.store.pipe(select(selectIsLoading)).subscribe((loading) => {
                if (loading) {
                    this.dataSource = new MatTableDataSource(this.noData);
                }
                this.loading = loading;
            })
        );
        // this.loadBuckets();
        this.updateSubscription = interval(60000).subscribe(() => this.loadBuckets());
    }

    ngAfterViewInit() {
        this.loadBuckets();
        let filter$ = this.filterSubject.pipe(
            debounceTime(150),
            distinctUntilChanged(),
            tap((value: string) => {
                if (this.paginator) {
                    this.paginator.pageIndex = 0;
                }
                this.filter = value;
            })
        );

        if (this.sort) {
            let sort$ = this.sort.sortChange.pipe(
                tap(() => {
                    if (this.paginator) {
                        this.paginator.pageIndex = 0
                    }
                })
            );

            if (this.paginator) {
                this.tableSubscription.add(
                    merge(filter$, sort$, this.paginator.page)
                        .pipe(tap(() => this.loadBuckets()))
                        .subscribe()
                );
            }
        }
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
        this.state.value['s3-bucket-list'].prefix = this.prefixValue;
        this.loadBuckets();
    }

    unsetPrefix() {
        this.prefixValue = '';
        this.prefixSet = false;
        this.state.value['s3-bucket-list'].prefix = '';
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
        let direction;
        let column = 'keys';
        if (sortState.active === 'size') {
            column = 'size'
        } else if (sortState.active === 'name') {
            column = 'name';
        }
        direction = sortState.direction === 'asc' ? 1 : -1;
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

    purgeBucket(bucketName: string) {
        this.store.dispatch(s3BucketListActions.purgeBucket({bucketName: bucketName}));
    }

    deleteBucket(bucketName: string) {
        this.store.dispatch(s3BucketListActions.deleteBucket({bucketName: bucketName}));
    }

    private initializeData(buckets: S3BucketItem[]): void {
        this.dataSource = new MatTableDataSource(
            buckets.length ? buckets : this.noData
        );
    }
}
