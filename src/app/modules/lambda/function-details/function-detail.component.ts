import {Component, OnDestroy, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {Sort} from "@angular/material/sort";
import {LambdaService} from "../service/lambda-service.component";
import {LambdaFunctionItem} from "../model/lambda-item";
import {byteConversion} from "../../../shared/byte-utils.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {LambdaFunctionUpgradeDialog} from "../function-upgrade/function-upgrade-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Observable} from "rxjs";
import {LambdaTagCountersResponse} from "../model/lambda-tag-item";
import {State, Store} from "@ngrx/store";
import {LambdaFunctionDetailsState} from "./state/lambda-function-details.reducer";
import {selectEnvironment, selectEnvironmentPageIndex, selectEnvironmentPageSize, selectInstancePageIndex, selectInstancePageSize, selectInstances, selectTagPageIndex, selectTagPageSize, selectTags} from "./state/lambda-function-details.selectors";
import {lambdaFunctionDetailsActions} from "./state/lambda-function-details.actions";
import {PageEvent} from "@angular/material/paginator";
import {LambdaTagAddDialog} from "../function-tag-add/function-tag-add.component";
import {LambdaTagEditDialog} from "../function-tag-edit/function-tag-edit.component";
import {LambdaEnvironmentCountersResponse} from "../model/lambda-environment-item";
import {LambdaEnvironmentAddDialog} from "../function-environment-add/function-environment-add.component";
import {LambdaEnvironmentEditDialog} from "../function-environment-edit/function-environment-edit.component";
import {LambdaInstanceCountersResponse} from "../model/lambda-instance-item";

@Component({
    selector: 'lambda-function-detail-component',
    templateUrl: './function-detail.component.html',
    styleUrls: ['./function-detail.component.scss'],
    standalone: false,
    providers: [LambdaService]
})
export class LambdaFunctionDetailsComponent implements OnInit, OnDestroy {

    // Last update
    lastUpdate: Date = new Date();

    functionItem = {} as LambdaFunctionItem;
    functionArn: string = '';
    functionName: string = '';

    // Environment
    environmentColumns: string[] = ['key', 'value', 'actions'];
    lambdaEnvironment$: Observable<LambdaEnvironmentCountersResponse> = this.store.select(selectEnvironment);
    environmentPageSize$: Observable<number> = this.store.select(selectEnvironmentPageSize);
    environmentPageIndex$: Observable<number> = this.store.select(selectEnvironmentPageIndex);
    environmentPageSizeOptions = [5, 10, 20, 50, 100];

    // Tags Table
    tagColumns: any[] = ['key', 'value', 'actions'];
    lambdaTags$: Observable<LambdaTagCountersResponse> = this.store.select(selectTags);
    tagPageSize$: Observable<number> = this.store.select(selectTagPageSize);
    tagPageIndex$: Observable<number> = this.store.select(selectTagPageIndex);
    tagPageSizeOptions = [5, 10, 20, 50, 100];

    // Instances Table
    instanceColumns: any[] = ['instanceId', 'containerId', 'status', 'actions'];
    lambdaInstances$: Observable<LambdaInstanceCountersResponse> = this.store.select(selectInstances);
    instancePageSize$: Observable<number> = this.store.select(selectInstancePageSize);
    instancePageIndex$: Observable<number> = this.store.select(selectInstancePageIndex);
    instancePageSizeOptions = [5, 10, 20, 50, 100];

    protected readonly byteConversion = byteConversion;
    private routerSubscription: any;

    constructor(private readonly snackBar: MatSnackBar, private readonly dialog: MatDialog, private readonly location: Location, private readonly route: ActivatedRoute, private readonly lambdaService: LambdaService,
                private readonly store: Store, private readonly state: State<LambdaFunctionDetailsState>) {
    }

    ngOnInit() {
        this.routerSubscription = this.route.params.subscribe(params => {
            this.functionArn = params['functionArn'];
            this.functionName = this.functionArn.substring(this.functionArn.lastIndexOf(":"))
            this.loadFunction();
            this.loadEnvironment();
            this.loadTags();
            this.loadInstances();
        });
        //this.lambdaEnvironment$.subscribe((data) => console.log(data));
        //this.lambdaTags$.subscribe((data) => console.log(data));
        //this.lambdaInstances$.subscribe((data) => console.log("Lambda instances: ", data));
    }

    ngOnDestroy() {
        this.routerSubscription.unsubscribe();
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.loadFunction();
        this.loadEnvironment();
        this.loadTags();
        this.loadInstances();
    }

    loadFunction() {
        this.lambdaService.getFunction(this.functionArn).subscribe((data: any) => {
            this.lastUpdate = new Date();
            this.functionItem = data;
        });
    }

    uploadCode() {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {functionArn: this.functionItem.functionArn};
        dialogConfig.maxWidth = '100vw';
        dialogConfig.maxHeight = '100vh';
        dialogConfig.panelClass = 'full-screen-modal';
        dialogConfig.width = "40%"

        this.dialog.open(LambdaFunctionUpgradeDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.lambdaService.uploadFunctionCode(result.functionArn, result.functionCode, result.version).subscribe(() => {
                    this.loadFunction();
                    this.snackBar.open('Lambda function code uploaded, ARN: ' + this.functionItem.functionArn, 'Done', {duration: 5000});
                });
            }
        });
    }

    // ===================================================================================================================
    // Tags
    // ===================================================================================================================
    handleTagPageEvent(e: PageEvent) {
        this.state.value['lambda-function-details'].tagPageSize = e.pageSize;
        this.state.value['lambda-function-details'].tagPageIndex = e.pageIndex;
        this.loadTags();
    }

    loadTags() {
        this.store.dispatch(lambdaFunctionDetailsActions.loadTags({
            lambdaArn: this.functionArn,
            pageSize: this.state.value['lambda-function-details'].tagPageSize,
            pageIndex: this.state.value['lambda-function-details'].tagPageIndex,
            sortColumns: this.state.value['lambda-function-details'].tagSortColumns
        }));
        this.lastUpdate = new Date();
    }

    tagSortChange(sortState: Sort) {
        this.state.value['lambda-function-details'].tagSortColumns = [];
        let column = sortState.active;
        let direction = sortState.direction === 'asc' ? 1 : -1;
        this.state.value['lambda-function-details'].tagSortColumns = [{column: column, sortDirection: direction}];
        this.loadTags();
    }

    addTag() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {functionArn: this.functionArn};

        this.dialog.open(LambdaTagAddDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                if (result.Key && result.Value) {
                    this.lambdaService.addTag(this.functionArn, result.Key, result.Value)
                        .subscribe(() => {
                            this.loadTags();
                            this.snackBar.open('Lambda tag changed, name: ' + result.key, 'Dismiss', {duration: 5000});
                        })
                } else {
                    this.snackBar.open('Lambda tag unchanged, name: ' + result.key, 'Dismiss', {duration: 5000});
                }
            }
        });
    }

    editTag(key: string, value: string) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {functionArn: this.functionArn, key: key, value: value};

        this.dialog.open(LambdaTagEditDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                if (result.Key !== key || result.Value !== value) {
                    this.lambdaService.updateTag(this.functionArn, result.Key, result.Value)
                        .subscribe(() => {
                            this.loadTags();
                            this.snackBar.open('Lambda tag updated, name: ' + result.key, 'Dismiss', {duration: 5000});
                        })
                } else {
                    this.snackBar.open('Lambda tag unchanged, name: ' + result.key, 'Dismiss', {duration: 5000});
                }
            }
        });
    }

    deleteTag(key: string) {
        this.lambdaService.deleteTag(this.functionArn, key)
            .subscribe(() => {
                this.loadTags();
                this.snackBar.open('Lambda tag deleted, name: ' + key, 'Dismiss', {duration: 5000});
            })
    }

    // ===================================================================================================================
    // Instances
    // ===================================================================================================================
    handleInstancePageEvent(e: PageEvent) {
        this.state.value['lambda-function-details'].instancePageSize = e.pageSize;
        this.state.value['lambda-function-details'].instancePageIndex = e.pageIndex;
        this.loadInstances();
    }

    loadInstances() {
        this.store.dispatch(lambdaFunctionDetailsActions.loadInstances({
            lambdaArn: this.functionArn,
            pageSize: this.state.value['lambda-function-details'].instancePageSize,
            pageIndex: this.state.value['lambda-function-details'].instancePageIndex,
            sortColumns: this.state.value['lambda-function-details'].instanceSortColumns
        }));
        this.lastUpdate = new Date();
    }

    instanceSortChange(sortState: Sort) {
        this.state.value['lambda-function-details'].instanceSortColumns = [];
        let column = sortState.active;
        let direction = sortState.direction === 'asc' ? 1 : -1;
        this.state.value['lambda-function-details'].instanceSortColumns = [{column: column, sortDirection: direction}];
        this.loadInstances();
    }

    refreshInstances() {
        this.loadInstances();
    }

    deleteInstance(instanceId: string) {
        this.lambdaService.deleteInstance(this.functionArn, instanceId)
            .subscribe(() => {
                this.loadInstances();
                this.snackBar.open('Lambda instance deleted, instanceId: ' + instanceId, 'Dismiss', {duration: 5000});
            })
    }

    // ===================================================================================================================
    // Environment
    // ===================================================================================================================
    handleEnvironmentPageEvent(e: PageEvent) {
        this.state.value['lambda-function-details'].environmentPageSize = e.pageSize;
        this.state.value['lambda-function-details'].environmentPageIndex = e.pageIndex;
        this.loadEnvironment();
    }

    loadEnvironment() {
        this.store.dispatch(lambdaFunctionDetailsActions.loadEnvironment({
            lambdaArn: this.functionArn,
            pageSize: this.state.value['lambda-function-details'].environmentPageSize,
            pageIndex: this.state.value['lambda-function-details'].environmentPageIndex,
            sortColumns: this.state.value['lambda-function-details'].environmentSortColumns
        }));
        this.lastUpdate = new Date();
    }

    environmentSortChanged(sortState: Sort) {
        this.state.value['lambda-function-details'].environmentSortColumns = [];
        let column = sortState.active;
        let direction = sortState.direction === 'asc' ? 1 : -1;
        this.state.value['lambda-function-details'].environmentSortColumns = [{column: column, sortDirection: direction}];
        this.loadEnvironment();
    }

    addEnvironment() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {functionArn: this.functionArn};

        this.dialog.open(LambdaEnvironmentAddDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                if (result.Key && result.Value) {
                    this.lambdaService.addEnvironment(this.functionArn, result.Key, result.Value)
                        .subscribe(() => {
                            this.loadEnvironment();
                            this.snackBar.open('Lambda environment variable changed, name: ' + result.key, 'Dismiss', {duration: 5000});
                        })
                } else {
                    this.snackBar.open('Lambda environment variable unchanged, name: ' + result.key, 'Dismiss', {duration: 5000});
                }
            }
        });
    }

    editEnvironment(key: string, value: string) {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {functionArn: this.functionArn, key: key, value: value};

        this.dialog.open(LambdaEnvironmentEditDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                if (result.Key !== key || result.Value !== value) {
                    this.lambdaService.updateEnvironment(this.functionArn, result.Key, result.Value)
                        .subscribe(() => {
                            this.loadTags();
                            this.snackBar.open('Lambda environment variable updated, name: ' + result.key, 'Dismiss', {duration: 5000});
                        })
                } else {
                    this.snackBar.open('Lambda environment variable unchanged, name: ' + result.key, 'Dismiss', {duration: 5000});
                }
            }
        });
    }

    deleteEnvironment(key: string) {
        this.lambdaService.deleteEnvironment(this.functionArn, key)
            .subscribe(() => {
                this.loadEnvironment();
                this.snackBar.open('Lambda environment variable deleted, name: ' + key, 'Dismiss', {duration: 5000});
            })
    }
}
