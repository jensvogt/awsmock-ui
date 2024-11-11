import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {debounceTime, distinctUntilChanged, filter, interval, merge, Observable, Subject, Subscription, tap} from "rxjs";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {byteConversion} from "../../../shared/byte-utils.component";
import {selectFunctionCounters, selectIsLoading, selectPageIndex, selectPageSize, selectPrefix, selectTotal} from "./state/lambda-function-list.selectors";
import {ActionsSubject, select, State, Store} from "@ngrx/store";
import {Location} from "@angular/common";
import {lambdaFunctionListActions} from "./state/lambda-function-list.actions";
import {MatTableDataSource} from "@angular/material/table";
import {LambdaFunctionItem} from "../model/function-item";
import {LambdaService} from "../service/lambda-service.component";
import {LambdaFunctionListState} from "./state/lambda-function-list.reducer";

@Component({
    selector: 'lambda-function-list',
    templateUrl: './function-list.component.html',
    styleUrls: ['./function-list.component.scss'],
    providers: [LambdaService]
})
export class LambdaFunctionListComponent implements OnInit, OnDestroy, AfterViewInit {

    // Last update
    lastUpdate: Date = new Date();

    // Table
    loading: boolean = false;
    noData: LambdaFunctionItem[] = [<LambdaFunctionItem>{}];
    pageSize$: Observable<number> = this.store.select(selectPageSize);
    prefix$: Observable<string> = this.store.select(selectPrefix);
    pageIndex$: Observable<number> = this.store.select(selectPageIndex);
    columns: any[] = ['name', 'runtime', 'invocations', 'averageRuntime', 'actions'];
    dataSource: MatTableDataSource<LambdaFunctionItem> = new MatTableDataSource();
    defaultSort: Sort = {active: "name", direction: "asc"};
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

    constructor(private snackBar: MatSnackBar, private dialog: MatDialog, private router: Router, private state: State<LambdaFunctionListState>, private store: Store,
                private actionsSubj$: ActionsSubject, private location: Location) {

        // Subscribe to action events, reload table when the action got successful executed
        this.actionsSubj$.pipe(
            filter((action) =>
                action.type === lambdaFunctionListActions.addFunctionSuccess.type ||
                action.type === lambdaFunctionListActions.resetCountersSuccess.type ||
                action.type === lambdaFunctionListActions.deleteFunctionSuccess.type
            )
        ).subscribe(() => {
            console.log("Action Subscription");
            this.loadFunctions();
        });
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
            .pipe(select(selectFunctionCounters))
            .subscribe((functionCounters) => this.initializeData(functionCounters.functionCounters));
        this.store
            .pipe(select(selectTotal))
            .subscribe((total) => (this.total = total));
        this.tableSubscription.add(
            this.store.pipe(select(selectIsLoading)).subscribe((loading) => {
                if (loading) {
                    this.dataSource = new MatTableDataSource(this.noData);
                }
                this.loading = loading;
            })
        );
        this.updateSubscription = interval(60000).subscribe(() => this.loadFunctions());
    }

    ngAfterViewInit() {
        this.loadFunctions();
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
                        .pipe(tap(() => this.loadFunctions()))
                        .subscribe()
                );
            }
        }
    }

    ngOnDestroy(): void {
        this.actionsSubj$?.unsubscribe();
        this.tableSubscription.unsubscribe();
        this.updateSubscription?.unsubscribe();
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.loadFunctions();
    }

    setPrefix() {
        this.prefixSet = true;
        this.state.value['lambda-function-list'].prefix = this.prefixValue;
        this.loadFunctions();
    }

    unsetPrefix() {
        this.prefixValue = '';
        this.prefixSet = false;
        this.state.value['lambda-function-list'].prefix = '';
        this.loadFunctions();
    }

    handlePageEvent(e: PageEvent) {
        this.state.value['lambda-function-list'].pageSize = e.pageSize;
        this.state.value['lambda-function-list'].pageIndex = e.pageIndex;
        this.loadFunctions();
    }

    sortChange(sortState: Sort) {
        this.state.value['lambda-function-list'].sortColumns = [];
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
        this.state.value['lambda-function-list'].sortColumns = [{column: column, sortDirection: direction}];
        this.loadFunctions();
    }

    loadFunctions() {
        this.store.dispatch(lambdaFunctionListActions.loadFunctions({
            prefix: this.state.value['lambda-function-list'].prefix,
            pageSize: this.state.value['lambda-function-list'].pageSize,
            pageIndex: this.state.value['lambda-function-list'].pageIndex,
            sortColumns: this.state.value['lambda-function-list'].sortColumns
        }));
    }

    deleteFunction(functionName: string) {
        this.store.dispatch(lambdaFunctionListActions.deleteFunction({functionName: functionName}));
    }

    resetCounters(functionName: string) {
        this.store.dispatch(lambdaFunctionListActions.resetCounters({functionName: functionName}));
    }

    private initializeData(functions: LambdaFunctionItem[]): void {
        this.total = 0;
        if (functions.length && functions.length > 0) {
            this.dataSource = new MatTableDataSource(functions);
            this.total = this.dataSource.data.length;
        }
    }
}
