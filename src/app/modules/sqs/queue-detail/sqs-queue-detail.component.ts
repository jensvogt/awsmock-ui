import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SqsQueueDetails} from "../model/sqs-queue-details";
import {Location} from "@angular/common";
import {State, Store} from "@ngrx/store";
import {sqsQueueDetailsActions} from "./state/sqs-queue-detail.actions";
import {Observable} from "rxjs";
import {
    selectAttributePageIndex,
    selectAttributePageSize,
    selectAttributes,
    selectDetails,
    selectError,
    selectLambdaTriggerPageIndex,
    selectLambdaTriggerPageSize,
    selectLambdaTriggers,
    selectTagPageIndex,
    selectTagPageSize,
    selectTags
} from "./state/sqs-queue-detail.selectors";
import {SqsAttributeCountersResponse} from "../model/sqs-attribute-item";
import {PageEvent} from "@angular/material/paginator";
import {Sort} from "@angular/material/sort";
import {SqsQueueDetailsState} from "./state/sqs-queue-detail.reducer";
import {SnsTagCountersResponse} from "../../sns/model/sns-tag-item";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {SqsService} from "../service/sqs-service.component";
import {SqsTagAddDialog} from "./tag-add/tag-add.component";
import {SqsTagEditDialog} from "./tag-edit/tag-edit.component";
import {SqsLambdaTriggerCountersResponse} from "../model/sqs-lambda-trigger-item";

@Component({
    selector: 'sqs-queue-detail-component',
    templateUrl: './sqs-queue-detail.component.html',
    styleUrls: ['./sqs-queue-detail.component.scss'],
    standalone: false
})
export class SqsQueueDetailComponent implements OnInit, OnDestroy {
    lastUpdate: Date = new Date();

    queueArn: string = '';
    queueUrl: string = '';
    queueName: string = '';
    queueDetails$: Observable<SqsQueueDetails> = this.store.select(selectDetails);
    queueDetailsError$: Observable<string> = this.store.select(selectError);

    // Attributes Table
    queueAttributes$: Observable<SqsAttributeCountersResponse> = this.store.select(selectAttributes);
    attributePageSize$: Observable<number> = this.store.select(selectAttributePageSize);
    attributePageIndex$: Observable<number> = this.store.select(selectAttributePageIndex);
    attributeColumns: any[] = ['name', 'value'];
    attributePageSizeOptions = [5, 10, 20, 50, 100];

    // Attributes Table
    lambdaTriggers$: Observable<SqsLambdaTriggerCountersResponse> = this.store.select(selectLambdaTriggers);
    lambdaTriggerPageSize$: Observable<number> = this.store.select(selectLambdaTriggerPageSize);
    lambdaTriggerPageIndex$: Observable<number> = this.store.select(selectLambdaTriggerPageIndex);
    lambdaTriggerColumns: any[] = ['uuid', 'arn', 'enabled'];
    lambdaTriggerPageSizeOptions = [5, 10, 20, 50, 100];

    // Tags Table
    queueTags$: Observable<SnsTagCountersResponse> = this.store.select(selectTags);
    tagPageSize$: Observable<number> = this.store.select(selectTagPageSize);
    tagPageIndex$: Observable<number> = this.store.select(selectTagPageIndex);
    tagColumns: any[] = ['name', 'value', 'actions'];
    tagPageSizeOptions = [5, 10, 20, 50, 100];

    private routerSubscription: any;

    constructor(private snackBar: MatSnackBar, private sqsService: SqsService, private route: ActivatedRoute, private dialog: MatDialog, private location: Location, private store: Store, private state: State<SqsQueueDetailsState>) {
    }

    ngOnInit() {
        this.routerSubscription = this.route.params.subscribe(params => {
            this.queueArn = params['queueArn'];
            this.loadDetails();
            this.loadAttributes();
            this.loadLambdaTrigger();
            this.loadTags();
        });
        this.queueDetailsError$.subscribe((msg: string) => {
            if (msg.length) {
                this.snackBar.open("ErrorMessage: " + msg.toString())
            }
        });
        this.queueDetails$.subscribe((data: any) => {
            this.queueUrl = data.queueUrl;
            this.queueName = data.queueName;
        });
        //this.queueAttributes$.subscribe((data: any) => console.log("Data: ", data));
        //this.queueTags$.subscribe((data: any) => console.log("Data: ", data));
        //this.lambdaTriggers$.subscribe((data: any) => console.log("Data: ", data));
    }

    ngOnDestroy() {
        this.routerSubscription.unsubscribe();
    }

    refresh() {
        this.store.dispatch(sqsQueueDetailsActions.loadDetails({queueArn: this.queueArn}));
        this.lastUpdate = new Date();
    }

    back() {
        this.location.back();
    }

    // ===================================================================================================================
    // Details
    // ===================================================================================================================
    loadDetails() {
        this.store.dispatch(sqsQueueDetailsActions.loadDetails({queueArn: this.queueArn}));
        this.lastUpdate = new Date();
    }

    // ===================================================================================================================
    // Attributes
    // ===================================================================================================================
    handleAttributePageEvent(e: PageEvent) {
        this.state.value['sqs-queue-details'].attributePageSize = e.pageSize;
        this.state.value['sqs-queue-details'].attributePageIndex = e.pageIndex;
        this.loadAttributes();
    }

    loadAttributes() {
        this.store.dispatch(sqsQueueDetailsActions.loadAttributes({
            queueArn: this.queueArn,
            pageSize: this.state.value['sqs-queue-details'].attributePageSize,
            pageIndex: this.state.value['sqs-queue-details'].attributePageIndex,
            sortColumns: this.state.value['sqs-queue-details'].attributeSortColumns
        }));
        this.lastUpdate = new Date();
    }

    attributeSortChange(sortState: Sort) {
        this.state.value['sqs-queue-details'].sortColumns = [];
        let column = sortState.active;
        let direction = sortState.direction === 'asc' ? 1 : -1;
        this.state.value['sqs-queue-details'].attributeSortColumns = [{column: column, sortDirection: direction}];
        this.loadAttributes();
    }

    refreshAttributes() {
        this.loadAttributes();
    }

    // ===================================================================================================================
    // Lambda trigger
    // ===================================================================================================================
    handleLambdaTriggerPageEvent(e: PageEvent) {
        this.state.value['sqs-queue-details'].lambdaTriggerPageSize = e.pageSize;
        this.state.value['sqs-queue-details'].lambdaTriggerPageIndex = e.pageIndex;
        this.loadLambdaTrigger();
    }

    lambdaTriggerSortChange(sortState: Sort) {
        this.state.value['sqs-queue-details'].sortColumns = [];
        let column = sortState.active;
        let direction = sortState.direction === 'asc' ? 1 : -1;
        this.state.value['sqs-queue-details'].lambdaTriggerSortColumns = [{column: column, sortDirection: direction}];
        this.loadLambdaTrigger();
    }

    loadLambdaTrigger() {
        this.store.dispatch(sqsQueueDetailsActions.loadLambdaTriggers({
            queueArn: this.queueArn,
            pageSize: this.state.value['sqs-queue-details'].lambdaTriggerPageSize,
            pageIndex: this.state.value['sqs-queue-details'].lambdaTriggerPageIndex,
            sortColumns: this.state.value['sqs-queue-details'].lambdaTriggerSortColumns
        }));
        this.lastUpdate = new Date();
    }

    refreshLambdaTriggers() {
        this.loadLambdaTrigger();
    }

    // ===================================================================================================================
    // Tags
    // ===================================================================================================================
    handleTagPageEvent(e: PageEvent) {
        this.state.value['sqs-queue-details'].tagPageSize = e.pageSize;
        this.state.value['sqs-queue-details'].tagPageIndex = e.pageIndex;
        this.loadTags();
    }

    loadTags() {
        this.store.dispatch(sqsQueueDetailsActions.loadTags({
            queueArn: this.queueArn,
            pageSize: this.state.value['sqs-queue-details'].tagPageSize,
            pageIndex: this.state.value['sqs-queue-details'].tagPageIndex,
            sortColumns: this.state.value['sqs-queue-details'].tagSortColumns
        }));
        this.lastUpdate = new Date();
    }

    tagSortChange(sortState: Sort) {
        this.state.value['sqs-queue-details'].sortColumns = [];
        let column = sortState.active;
        let direction = sortState.direction === 'asc' ? 1 : -1;
        this.state.value['sqs-queue-details'].sortColumns = [{column: column, sortDirection: direction}];
        this.loadTags();
    }

    refreshTags() {
        this.loadTags();
    }

    deleteTag(key: string) {
        this.sqsService.deleteTag(this.queueUrl, key)
            .subscribe(() => {
                this.loadTags();
                this.snackBar.open('SQS tag deleted, name: ' + key, 'Dismiss', {duration: 5000});
            })
    }

    editTag(key: string, value: string) {
        const dialogConfig = new MatDialogConfig();

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
        });
    }

    addTag() {
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
    }
}
