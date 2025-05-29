import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {debounceTime, distinctUntilChanged, filter, interval, merge, Observable, Subject, Subscription, tap} from "rxjs";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {byteConversion} from "../../../shared/byte-utils.component";
import {selectFunctionCounters, selectPageIndex, selectPageSize, selectPrefix, selectTotal} from "./state/lambda-function-list.selectors";
import {ActionsSubject, select, State, Store} from "@ngrx/store";
import {Location} from "@angular/common";
import {lambdaFunctionListActions} from "./state/lambda-function-list.actions";
import {MatTableDataSource} from "@angular/material/table";
import {Code, CreateFunctionRequest, EphemeralStorage, LambdaEnvironment, LambdaFunctionItem} from "../model/lambda-item";
import {LambdaService} from "../service/lambda-service.component";
import {LambdaFunctionListState} from "./state/lambda-function-list.reducer";
import {LambdaFunctionCreateDialog} from "../function-create/function-create-dialog.component";
import {LambdaFunctionUpgradeDialog} from "../function-upgrade/function-upgrade-dialog.component";
import {LambdaResultDialog} from "../function-result/function-result-dialog.component";

@Component({
    selector: 'lambda-function-list',
    templateUrl: './function-list.component.html',
    styleUrls: ['./function-list.component.scss'],
    standalone: false,
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
    columns: any[] = ['name', 'runtime', 'version', 'status', 'instances', 'invocations', 'averageRuntime', 'actions'];
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

    constructor(private snackBar: MatSnackBar, private dialog: MatDialog, private lambdaService: LambdaService, private state: State<LambdaFunctionListState>, private store: Store, private actionsSubj$: ActionsSubject, private location: Location) {

        // Subscribe to action events, reload table when the action got successful executed
        this.actionsSubj$.pipe(
            filter((action) =>
                action.type === lambdaFunctionListActions.addFunctionSuccess.type ||
                action.type === lambdaFunctionListActions.resetCountersSuccess.type ||
                action.type === lambdaFunctionListActions.deleteFunctionSuccess.type
            )
        ).subscribe(() => {
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
        let direction: number;
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

    deleteImage(functionArn: string) {
        this.store.dispatch(lambdaFunctionListActions.deleteImage({functionArn: functionArn}));
    }

    resetCounters(functionName: string) {
        this.store.dispatch(lambdaFunctionListActions.resetCounters({functionName: functionName}));
    }

    createLambda() {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {}
        dialogConfig.maxWidth = '100%';
        dialogConfig.maxHeight = '100vh';
        dialogConfig.width = "100%"
        dialogConfig.panelClass = 'full-screen-modal';

        this.dialog.open(LambdaFunctionCreateDialog, dialogConfig).afterClosed().subscribe((result: any) => {
            if (result) {
                let request: CreateFunctionRequest = {} as CreateFunctionRequest;
                request.Code = {} as Code;
                request.Code.ZipFile = result.content;
                request.FunctionName = result.functionName;
                request.Runtime = result.runtime;
                request.Handler = result.handler;
                request.MemorySize = result.memorySize;
                request.Timeout = result.timeout;
                request.EphemeralStorage = {} as EphemeralStorage;
                request.EphemeralStorage.Size = 10;
                request.Tags = {};
                if (result.jsonTags) {
                    request.Tags.version = "latest";
                }
                request.Tags.tag = "latest";
                request.Environment = {} as LambdaEnvironment;
                if (result.jsonEnvironment) {
                    request.Environment = JSON.parse(result.jsonEnvironment);
                }
                this.lambdaService.createFunction(request).subscribe(() => {
                    this.loadFunctions();
                    this.snackBar.open('Lambda function creation started, name: ' + request.FunctionName, 'Done', {duration: 5000});
                });
            }
        });
    }

    uploadCode(functionArn: string) {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {functionArn: functionArn};
        dialogConfig.maxWidth = '100vw';
        dialogConfig.maxHeight = '100vh';
        dialogConfig.panelClass = 'full-screen-modal';
        dialogConfig.width = "40%"

        this.dialog.open(LambdaFunctionUpgradeDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.lambdaService.uploadFunctionCode(result.functionArn, result.functionCode, result.version).subscribe(() => {
                    this.loadFunctions();
                    this.snackBar.open('Lambda function code uploaded, ARN: ' + functionArn, 'Done', {duration: 5000});
                });
            }
        });
    }

    loadLambdaLogs(functionArn: string) {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {lambdaArn: functionArn};
        dialogConfig.maxWidth = '100vw';
        dialogConfig.maxHeight = '100vh';
        dialogConfig.panelClass = 'full-screen-modal';
        dialogConfig.width = "40%"

        this.dialog.open(LambdaResultDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
            }
        });
    }

    startDisabled(functionArn: string) {
        const found = this.dataSource.data.find((functionItem) => functionItem.functionArn === functionArn);
        if (found) {
            return found.state === "Active";
        }
        return true;
    }

    stopDisabled(functionArn: string) {
        const found = this.dataSource.data.find((functionItem) => functionItem.functionArn === functionArn);
        if (found) {
            return !(found.state === "Active");
        }
        return true;
    }

    startFunction(functionArn: string) {
        this.lambdaService.startFunction(functionArn).subscribe(() => {
            this.loadFunctions();
            this.snackBar.open('Lambda function started, ARN: ' + functionArn, 'Done', {duration: 5000});
        });
    }

    stopFunction(functionArn: string) {
        this.lambdaService.stopFunction(functionArn).subscribe(() => {
            this.loadFunctions();
            this.snackBar.open('Lambda function stopped, ARN: ' + functionArn, 'Done', {duration: 5000});
        });
    }

    clearResults(lambdaArn: string) {
        this.lambdaService.deleteLambdaResultCounters(lambdaArn).subscribe(() => {
            this.loadFunctions();
        });
    }

    private initializeData(functions: LambdaFunctionItem[]): void {
        this.total = 0;
        this.lastUpdate = new Date();
        if (functions.length && functions.length > 0) {
            this.dataSource = new MatTableDataSource(functions);
            this.total = this.dataSource.data.length;
            console.log("Function list: ", functions);
        }
    }
}
