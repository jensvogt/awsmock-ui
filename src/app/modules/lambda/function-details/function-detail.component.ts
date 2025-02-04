import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {MatSort, Sort} from "@angular/material/sort";
import {LambdaService} from "../service/lambda-service.component";
import {Environment, LambdaFunctionItem, Tag} from "../model/function-item";
import {byteConversion} from "../../../shared/byte-utils.component";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {LambdaFunctionUpgradeDialog} from "../function-upgrade/function-upgrade-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Observable} from "rxjs";
import {LambdaTagCountersResponse} from "../model/lambda-tag-item";
import {State, Store} from "@ngrx/store";
import {LambdaFunctionDetailsState} from "./state/lambda-function-details.reducer";
import {selectTagPageIndex, selectTagPageSize, selectTags} from "./state/lambda-function-details.selectors";
import {lambdaFunctionDetailsActions} from "./state/lambda-function-details.actions";
import {PageEvent} from "@angular/material/paginator";

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
    environmentDataSource = new MatTableDataSource<Environment>();
    environments: Environment[] = [];
    // @ts-ignore
    @ViewChild('environmentTable', {read: MatSort, static: true}) environmentSort: MatSort;

    // Tags Table
    tagColumns: any[] = ['key', 'value', 'actions'];
    lambdaTags$: Observable<LambdaTagCountersResponse> = this.store.select(selectTags);
    tagPageSize$: Observable<number> = this.store.select(selectTagPageSize);
    tagPageIndex$: Observable<number> = this.store.select(selectTagPageIndex);
    tagPageSizeOptions = [5, 10, 20, 50, 100];

    protected readonly byteConversion = byteConversion;
    private routerSubscription: any;

    constructor(private snackBar: MatSnackBar, private dialog: MatDialog, private location: Location, private route: ActivatedRoute, private lambdaService: LambdaService, private store: Store, private state: State<LambdaFunctionDetailsState>) {
    }

    ngOnInit() {
        this.routerSubscription = this.route.params.subscribe(params => {
            this.functionArn = params['functionArn'];
            this.functionName = this.functionArn.substring(this.functionArn.lastIndexOf(":"))
            this.loadFunction();
            this.loadTags();
        });
        this.environmentDataSource.sort = this.environmentSort;
        //this.lambdaTags$.subscribe((data) => console.log(data));
    }

    ngOnDestroy() {
        this.routerSubscription.unsubscribe();
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.loadFunction();
        this.loadTags();
    }

    loadFunction() {
        this.lambdaService.getFunction(this.functionArn).subscribe((data: any) => {
            this.lastUpdate = new Date();
            this.functionItem = data;
            this.environmentDataSource = this.convertEnvironment(data);
        });
    }

    environmentSortChanged(sortState: Sort) {
        console.log("Sort: ", sortState);
        this.environmentDataSource = this.sortEnvs(this.functionItem.environment, sortState.active, sortState.direction);
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

    refreshTags() {
        this.loadTags();
    }

    deleteTag(key: string) {
        /*this.lambdaService.deleteTag(this.functionArn, key)
            .subscribe(() => {
                this.loadTags();
                this.snackBar.open('SQS tag deleted, name: ' + key, 'Dismiss', {duration: 5000});
            })*/
        console.log("Key: ", key);
    }

    editTag(key: string, value: string) {
        /*    const dialogConfig = new MatDialogConfig();

            dialogConfig.disableClose = true;
            dialogConfig.autoFocus = true;
            dialogConfig.data = {queueUrl: this.queueUrl, queueName: this.queueName, key: key, value: value};

            this.dialog.open(SqsTagEditDialog, dialogConfig).afterClosed().subscribe(result => {
                if (result) {
                    if (result.key !== key || result.value !== value) {
                        this.sqsService.addTag(result.queueUrl, result.key, result.value)
                            .subscribe(() => {
                                this.loadTags();
                                this.snackBar.open('SQS tag changed, name: ' + result.key, 'Dismiss', {duration: 5000});
                            })
                    } else {
                        this.snackBar.open('SQS tag unchanged, name: ' + result.key, 'Dismiss', {duration: 5000});
                    }
                }
            });*/
        console.log("Key: " + key + " value: " + value);
    }

    /*addTag() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {queueArn: this.queueArn, queueName: this.queueName, queueUrl: this.queueUrl};

        this.dialog.open(SqsTagAddDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.sqsService.addTag(result.queueUrl, result.key, result.value)
                    .subscribe(() => {
                        this.loadTags();
                        this.snackBar.open('SQS queue tag added, name: ' + result.key, 'Dismiss', {duration: 5000});
                    })
            }
        });
    }*/

    private convertEnvironment(data: any): MatTableDataSource<Environment> {
        let i = 0;
        this.environments = [];
        for (let t in data.environment) {
            this.environments [i++] = {key: t, value: data.environment[t]};
        }
        return new MatTableDataSource(this.environments);
    }

    private convertTags(data: any): MatTableDataSource<Tag> {
        let i = 0;
        let tags: Tag[] = [];
        for (let t in data.tags) {
            tags[i++] = {key: t, value: data.tags[t]};
        }
        return new MatTableDataSource(tags)
    }

    private sortEnvs(array: Environment[], attr: string, direction: string): any {
        if (attr === 'key') {
            if (direction === 'asc') {
                array.sort((a: Environment, b: Environment) => a.key.localeCompare(b.key));
            } else {
                array.sort((a: { key: string; }, b: { key: string; }) => b.key.localeCompare(b.key));
            }
        } else if (attr === 'value') {
            array.sort((a: { value: string; }, b: { value: string; }) => a.value.localeCompare(b.value));
        }
        console.log(array);
        return this.convertEnvironment(array);
    }
}
