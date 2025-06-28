import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SqsQueueAttributeCountersResponse, SqsQueueDetails} from "../model/sqs-queue-details";
import {Location} from "@angular/common";
import {State, Store} from "@ngrx/store";
import {sqsQueueDetailsActions} from "./state/sqs-queue-detail.actions";
import {Observable} from "rxjs";
import {
    selectAttributePageIndex,
    selectAttributePageSize,
    selectAttributes,
    selectDefaultMessageAttributePageIndex,
    selectDefaultMessageAttributePageSize,
    selectDefaultMessageAttributes,
    selectDetails,
    selectError,
    selectLambdaTriggerPageIndex,
    selectLambdaTriggerPageSize,
    selectLambdaTriggers,
    selectTagPageIndex,
    selectTagPageSize,
    selectTags
} from "./state/sqs-queue-detail.selectors";
import {PageEvent} from "@angular/material/paginator";
import {Sort} from "@angular/material/sort";
import {SqsQueueDetailsState} from "./state/sqs-queue-detail.reducer";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {SqsService} from "../service/sqs-service.component";
import {SqsTagAddDialog} from "./tag-add/tag-add.component";
import {SqsTagEditDialog} from "./tag-edit/tag-edit.component";
import {SqsLambdaTriggerCountersResponse} from "../model/sqs-lambda-trigger-item";
import {SqsDqlEditDialog} from "./dlq-edit/dlq-edit.component";
import {SqsTagCountersResponse} from "../model/sqs-tag-item";
import {SqsDefaultMessageAttributeItem, SqsDefaultMessageAttributeResponse} from "../model/sqs-default-message-attribute";
import {SqsMessageAttributeAddDialog} from "../attribute-add/attribute-add.component";
import {MatTableDataSource} from "@angular/material/table";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {SqsMessageAttributeEditDialog} from "../attribute-edit/attribute-edit.component";

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
    targetArn: string = '';
    retries: string = '';
    queueDetails$: Observable<SqsQueueDetails> = this.store.select(selectDetails);
    queueDetailsError$: Observable<string> = this.store.select(selectError);

    // Attributes Table
    queueAttributes$: Observable<SqsQueueAttributeCountersResponse> = this.store.select(selectAttributes);
    attributePageSize$: Observable<number> = this.store.select(selectAttributePageSize);
    attributePageIndex$: Observable<number> = this.store.select(selectAttributePageIndex);
    attributeColumns: any[] = ['name', 'value'];
    attributePageSizeOptions = [5, 10, 20, 50, 100];

    // Lambda notification table
    lambdaTriggers$: Observable<SqsLambdaTriggerCountersResponse> = this.store.select(selectLambdaTriggers);
    lambdaTriggerPageSize$: Observable<number> = this.store.select(selectLambdaTriggerPageSize);
    lambdaTriggerPageIndex$: Observable<number> = this.store.select(selectLambdaTriggerPageIndex);
    lambdaTriggerColumns: any[] = ['uuid', 'arn', 'enabled'];
    lambdaTriggerPageSizeOptions = [5, 10, 20, 50, 100];

    // Tags table
    queueTags$: Observable<SqsTagCountersResponse> = this.store.select(selectTags);
    tagPageSize$: Observable<number> = this.store.select(selectTagPageSize);
    tagPageIndex$: Observable<number> = this.store.select(selectTagPageIndex);
    tagColumns: any[] = ['name', 'value', 'actions'];
    tagPageSizeOptions = [5, 10, 20, 50, 100];

    // Default message attribute table
    defaultMessageAttributes$: Observable<SqsDefaultMessageAttributeResponse> = this.store.select(selectDefaultMessageAttributes);
    defaultMessageAttributePageSize$: Observable<number> = this.store.select(selectDefaultMessageAttributePageSize);
    defaultMessageAttributePageIndex$: Observable<number> = this.store.select(selectDefaultMessageAttributePageIndex);
    defaultMessageAttributeColumns: any[] = ['name', 'value', 'type', 'actions'];
    defaultMessageAttributePageSizeOptions = [5, 10, 20, 50, 100];
    defaultMessageAttributesList: SqsDefaultMessageAttributeItem[] = [];
    defaultMessageAttributesDatasource: MatTableDataSource<SqsDefaultMessageAttributeItem> = new MatTableDataSource();

    private routerSubscription: any;

    constructor(private readonly snackBar: MatSnackBar, private readonly sqsService: SqsService, private readonly route: ActivatedRoute, private readonly dialog: MatDialog, private readonly location: Location, private readonly store: Store, private readonly state: State<SqsQueueDetailsState>) {
    }

    ngOnInit() {
        this.routerSubscription = this.route.params.subscribe(params => {
            this.queueArn = params['queueArn'];
            this.loadDetails();
            this.loadAttributes();
        });
        this.queueDetailsError$.subscribe((msg: string) => {
            if (msg.length) {
                this.snackBar.open("ErrorMessage: " + msg.toString())
            }
        });
        this.queueDetails$.subscribe((data: any) => {
            this.queueUrl = data.queueUrl;
            this.queueName = data.queueName;
            this.targetArn = data.dlqArn;
            this.retries = data.dlqMaxReceive;
        });

        this.defaultMessageAttributes$.subscribe((data: any) => {
            this.defaultMessageAttributesList = [];
            for (let key in data.attributeCounters) {
                let attribute: SqsDefaultMessageAttributeItem = {name: key, value: data.attributeCounters[key]};
                this.defaultMessageAttributesList.push(attribute);

            }
            this.defaultMessageAttributesDatasource = new MatTableDataSource(this.defaultMessageAttributesList);
        });
        //this.queueDetails$.subscribe((data: any) => console.log("QeueuDetails: ", data));
        //this.queueAttributes$.subscribe((data: any) => console.log("Attributes: ", data));
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

    tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
        switch (tabChangeEvent.index) {
            case 0:
                this.loadAttributes();
                break;
            case 1:
                this.loadLambdaTrigger();
                break;
            case 3:
                this.loadTags();
                break;
            case 4:
                this.loadDefaultMessageAttributes();
                break;
        }
    }

    editDql() {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {queueArn: this.queueArn, targetArn: this.targetArn, retries: this.retries};

        this.dialog.open(SqsDqlEditDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                if (result.dlqTargetArn !== this.targetArn || result.dlqRetries !== this.retries) {
                    this.sqsService.updateDql(result.queueArn, result.targetArn, result.retries)
                        .subscribe(() => {
                            this.loadDetails();
                            this.snackBar.open('SQS DQL changed, name: ' + result.key, 'Dismiss', {duration: 5000});
                        })
                } else {
                    this.snackBar.open('SQS DQL unchanged, name: ' + result.key, 'Dismiss', {duration: 5000});
                }
            }
        });
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

    editTag(tagKey: string, tagValue: string) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {queueUrl: this.queueUrl, queueName: this.queueName, tagKey: tagKey, tagValue: tagValue};

        this.dialog.open(SqsTagEditDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                if (result.tagKey !== tagKey || result.tagValue !== tagValue) {
                    this.sqsService.addTag(result.queueUrl, result.tagKey, result.tagValue)
                        .subscribe(() => {
                            this.loadTags();
                            this.snackBar.open('SQS tag changed, name: ' + result.tagKey, 'Dismiss', {duration: 5000});
                        })
                } else {
                    this.snackBar.open('SQS tag unchanged, name: ' + result.tagKey, 'Dismiss', {duration: 5000});
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

    // ===================================================================================================================
    // DefaultMessageAttributes
    // ===================================================================================================================
    handleDefaultMessageAttributePageEvent(e: PageEvent) {
        this.state.value['sqs-queue-details'].defaultMessageAttributePageSize = e.pageSize;
        this.state.value['sqs-queue-details'].defaultMessageAttributePageIndex = e.pageIndex;
        this.loadDefaultMessageAttributes();
    }

    loadDefaultMessageAttributes() {
        this.store.dispatch(sqsQueueDetailsActions.loadDefaultMessageAttributes({
            queueArn: this.queueArn,
            pageSize: this.state.value['sqs-queue-details'].defaultMessageAttributePageSize,
            pageIndex: this.state.value['sqs-queue-details'].defaultMessageAttributePageIndex,
            sortColumns: this.state.value['sqs-queue-details'].defaultMessageAttributeSortColumns
        }));
        this.lastUpdate = new Date();
    }

    defaultMessageAttributeSortChange(sortState: Sort) {
        this.state.value['sqs-queue-details'].sortColumns = [];
        let column = sortState.active;
        let direction = sortState.direction === 'asc' ? 1 : -1;
        this.state.value['sqs-queue-details'].sortColumns = [{column: column, sortDirection: direction}];
        this.loadDefaultMessageAttributes();
    }

    refreshDefaultMessageAttributes() {
        this.loadDefaultMessageAttributes();
    }

    addDefaultMessageAttribute() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {queueArn: this.queueArn, queueName: this.queueName, queueUrl: this.queueUrl};

        this.dialog.open(SqsMessageAttributeAddDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.store.dispatch(sqsQueueDetailsActions.addDefaultMessageAttributes({
                    queueArn: this.queueArn,
                    name: result.Key,
                    value: result.Value,
                    dataType: result.DataType
                }));
            }
        });
    }

    editDefaultMessageAttribute(name: string, value: string, dataType: string) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {attribute: {name: name, stringValue: value, dataType: dataType}};

        this.dialog.open(SqsMessageAttributeEditDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                console.log("resultfromdialog", result);
                this.store.dispatch(sqsQueueDetailsActions.updateDefaultMessageAttributes({
                    queueArn: this.queueArn,
                    name: result.attribute.name,
                    value: result.attribute.stringValue,
                    dataType: result.attribute.dataType
                }));
            }
        });
    }

    deleteDefaultMessageAttribute(key: string) {
        this.store.dispatch(sqsQueueDetailsActions.deleteDefaultMessageAttributes({
            queueArn: this.queueArn,
            name: key,
        }));
    }
}
