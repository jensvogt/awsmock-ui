import {Component, OnDestroy, OnInit} from '@angular/core';
import {interval, Observable, Subscription} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {ListQueueCountersResponse, SqsQueueItem} from "../model/sqs-queue-item";
import {Sort} from "@angular/material/sort";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {QueueAddComponentDialog} from "../queue-add/queue-add-component";
import {SqsService} from "../service/sqs-service.component";
import {SendMessageComponentDialog} from "../send-message/send-message.component";
import {State, Store} from "@ngrx/store";
import {Location} from "@angular/common";
import {selectPageIndex, selectPageSize, selectPrefix, selectQueueCounters} from "./state/sqs-queue-list.selectors";
import {sqsQueueListActions} from "./state/sqs-queue-list.actions";
import {SQSQueueListState} from "./state/sqs-queue-list.reducer";
import {byteConversion} from "../../../shared/byte-utils.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SqsMessageDialogResult} from "../model/sqs-message-item";

@Component({
    selector: 'sqs-queue-list',
    templateUrl: './sqs-queue-list.component.html',
    styleUrls: ['./sqs-queue-list.component.scss'],
    standalone: false
})
export class SqsQueueListComponent implements OnInit, OnDestroy {

    // Last update
    lastUpdate: Date = new Date();

    // Observables
    pageSize$: Observable<number> = this.store.select(selectPageSize);
    pageIndex$: Observable<number> = this.store.select(selectPageIndex);
    prefix$: Observable<string> = this.store.select(selectPrefix);
    listQueueCountersResponse$: Observable<ListQueueCountersResponse> = this.store.select(selectQueueCounters);
    columns: any[] = ['queueName', 'messagesAvailable', 'messagesInFlight', 'messagesDelayed', 'size', 'created', 'modified', 'actions'];

    // Auto-update
    updateSubscription: Subscription | undefined;

    // Paging
    pageSizeOptions = [5, 10, 20, 50, 100];
    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;

    // Prefix
    prefixValue: string = this.state.value['sqs-queue-list'].prefix;
    prefixSet: boolean = false;

    // Misc
    protected readonly byteConversion = byteConversion;

    constructor(private snackBar: MatSnackBar, private dialog: MatDialog, private state: State<SQSQueueListState>, private sqsService: SqsService,
                private location: Location, private store: Store) {
        this.prefix$.subscribe((data: string) => {
            this.prefixSet = false;
            if (data && data.length) {
                this.prefixValue = data;
                this.prefixSet = true;
            }
        });
        //this.listQueueCountersResponse$.subscribe((data) => console.log("Data: ", data));
    }

    ngOnInit(): void {
        this.loadQueues();
        this.updateSubscription = interval(60000).subscribe(() => this.loadQueues());
    }

    ngOnDestroy(): void {
        this.updateSubscription?.unsubscribe();
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.loadQueues();
    }

    setPrefix() {
        this.prefixSet = true;
        this.state.value['sqs-queue-list'].pageIndex = 0;
        this.state.value['sqs-queue-list'].prefix = this.prefixValue;
        this.loadQueues();
    }

    unsetPrefix() {
        this.prefixValue = '';
        this.prefixSet = false;
        this.state.value['sqs-queue-list'].prefix = '';
        this.loadQueues();
    }

    handlePageEvent(e: PageEvent) {
        this.state.value['sqs-queue-list'].pageSize = e.pageSize;
        this.state.value['sqs-queue-list'].pageIndex = e.pageIndex;
        this.loadQueues();
    }

    setDlq() {

    }

    sortChange(sortState: Sort) {
        let column = sortState.active;
        if (sortState.active === 'queueName') {
            column = 'name'
        } else if (sortState.active === 'messagesAvailable') {
            column = 'attributes.approximateNumberOfMessages'
        } else if (sortState.active === 'messagesInFlight') {
            column = 'attributes.approximateNumberOfMessagesNotVisible'
        } else if (sortState.active === 'messagesDelayed') {
            column = 'attributes.approximateNumberOfMessagesDelayed';
        }
        let direction = sortState.direction === 'asc' ? 1 : -1
        this.state.value['sqs-queue-list'].sortColumns = [{column: column, sortDirection: direction}];
        this.loadQueues();
    }

    loadQueues() {
        this.lastUpdate = new Date();
        this.store.dispatch(sqsQueueListActions.loadQueues({
            prefix: this.state.value['sqs-queue-list'].prefix,
            pageSize: this.state.value['sqs-queue-list'].pageSize,
            pageIndex: this.state.value['sqs-queue-list'].pageIndex,
            sortColumns: this.state.value['sqs-queue-list'].sortColumns
        }));
    }

    createQueue() {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        this.dialog.open(QueueAddComponentDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.sqsService.createQueue(result).subscribe(() => {
                    this.loadQueues();
                    this.snackBar.open('SQS queue created, url: ' + result, 'Done', {duration: 5000})
                });
            }
        });
    }

    sendMessage(queueUrl: string) {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {queueUrl: queueUrl};
        dialogConfig.maxWidth = '100vw';
        dialogConfig.maxHeight = '100vh';
        dialogConfig.panelClass = 'full-screen-modal';
        dialogConfig.width = "90%"

        this.dialog.open(SendMessageComponentDialog, dialogConfig).afterClosed().subscribe((result: SqsMessageDialogResult) => {
            if (result) {
                this.sqsService.sendMessage(queueUrl, result.message, 0, result.attributes).subscribe(() => {
                    this.loadQueues();
                    this.snackBar.open('SQS message send created, url: ' + queueUrl, 'Done', {duration: 5000})
                });
            }
        });
    }

    purgeQueue(queueUrl: string) {
        this.sqsService.purgeQueue(queueUrl).subscribe(() => {
            this.loadQueues();
            this.snackBar.open('SQS queue purged, url: ' + queueUrl, 'Done', {duration: 5000})
        });
    }

    redriveMessages(queue: SqsQueueItem) {
        if (queue && queue.queueArn) {
            this.sqsService.redriveMessages(queue.queueArn).subscribe(() => {
                this.loadQueues()
                this.snackBar.open('SQS queue redrive executed, queueArn: ' + queue.queueArn, 'Done', {duration: 5000})
            });
        }
    }

    deleteQueue(queueUrl: string) {
        this.sqsService.deleteQueue(queueUrl).subscribe(() => {
            this.loadQueues()
            this.snackBar.open('SQS queue deleted, url: ' + queueUrl, 'Done', {duration: 5000})
        });
    }

    isDlq(queueUrl: string): boolean {
        return queueUrl.endsWith('dlqueue');
    }
}
