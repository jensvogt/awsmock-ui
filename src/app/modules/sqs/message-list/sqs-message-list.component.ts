import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute} from "@angular/router";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {SqsService} from "../service/sqs-service.component";
import {PageEvent} from "@angular/material/paginator";
import {Sort} from "@angular/material/sort";
import {Location} from "@angular/common";
import {filter, interval, Observable, Subscription} from "rxjs";
import {ListMessageCountersResponse, SqsMessageDialogResult, SqsMessageItem} from "../model/sqs-message-item";
import {ViewMessageComponentDialog} from "../message-view/view-message.component";
import {SendMessageComponentDialog} from "../message-send/send-message.component";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {ActionsSubject, State, Store} from "@ngrx/store";
import {selectPageIndex, selectPageSize, selectPrefix} from "../queues-list/state/sqs-queue-list.selectors";
import {selectMessageCounters} from "./state/sqs-message-list.selectors";
import {sqsMessageListActions} from "./state/sqs-message-list.actions";
import {SQSMessageListState} from "./state/sqs-message-list.reducer";
import {byteConversion} from '../../../shared/byte-utils.component';

@Component({
    selector: 'sqs-message-list',
    templateUrl: './sqs-message-list.component.html',
    styleUrls: ['./sqs-message-list.component.scss'],
    standalone: false
})
export class SqsMessageListComponent implements OnInit, OnDestroy {

    // Last update
    lastUpdate: Date = new Date();

    // Table
    pageSize$: Observable<number> = this.store.select(selectPageSize);
    pageIndex$: Observable<number> = this.store.select(selectPageIndex);
    prefix$: Observable<string> = this.store.select(selectPrefix);
    listMessageCountersResponse$: Observable<ListMessageCountersResponse> = this.store.select(selectMessageCounters);
    columns: any[] = ['messageId', 'size', 'retries', 'created', 'modified', 'actions'];

    // Paging
    pageSizeOptions = [5, 10, 20, 50, 100];
    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;
    pageEvent: PageEvent = {length: 0, pageIndex: 0, pageSize: 0};

    // Auto-update
    updateSubscription: Subscription | undefined;

    queueArn: string = '';
    queueUrl: string = '';
    queueName: string = '';

    // Prefix
    prefixValue: string = '';
    prefixSet: boolean = false;

    // Sorting, default create descending
    sortColumns: SortColumn[] = [{column: 'created', sortDirection: 1}];
    protected readonly byteConversion = byteConversion;
    private routerSubscription: any;

    constructor(private snackBar: MatSnackBar, private sqsService: SqsService, private route: ActivatedRoute, private dialog: MatDialog, private state: State<SQSMessageListState>,
                private location: Location, private store: Store<SQSMessageListState>, private actionsSubj$: ActionsSubject) {
        this.actionsSubj$.pipe(
            filter((action) =>
                action.type === sqsMessageListActions.addMessageSuccess.type
            )
        ).subscribe(() => {
            this.loadMessages();
        });
        this.prefix$.subscribe((data: string) => {
            this.prefixSet = false;
            if (data && data.length) {
                this.prefixValue = data;
                this.prefixSet = true;
            }
        });
        //this.listMessageCountersResponse$.subscribe((data) => console.log("Message Data: ", data));
    }

    ngOnInit(): void {
        this.routerSubscription = this.route.params.subscribe(params => {
            this.queueArn = decodeURI(params['queueArn']);
        });
        this.queueName = this.queueArn.substring(this.queueArn.lastIndexOf(':') + 1);
        this.sqsService.getQueueUrl(this.queueName).subscribe((data: any) => {
            this.queueUrl = data.QueueUrl;
        });
        this.loadMessages();
        this.updateSubscription = interval(60000).subscribe(() => this.loadMessages());
    }

    ngOnDestroy(): void {
        this.routerSubscription?.unsubscribe();
        this.updateSubscription?.unsubscribe();
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.loadMessages();
    }

    setPrefix() {
        this.prefixSet = true;
        this.state.value['sqs-message-list'].pageIndex = 0;
        this.state.value['sqs-message-list'].prefix = this.prefixValue;
        this.loadMessages();
    }

    unsetPrefix() {
        this.prefixValue = '';
        this.prefixSet = false;
        this.state.value['sqs-message-list'].prefix = '';
        this.loadMessages();
    }

    sortChange(sortState: Sort) {
        this.sortColumns = [];
        sortState.direction === 'asc' ? this.sortColumns.push({column: sortState.active, sortDirection: 1}) : this.sortColumns.push({column: sortState.active, sortDirection: -1});
        this.state.value['sqs-message-list'].sortColumns = this.sortColumns;
        this.loadMessages();
    }

    handlePageEvent(e: PageEvent) {
        this.pageEvent = e;
        this.loadMessages();
    }

    loadMessages() {
        this.lastUpdate = new Date();
        this.store.dispatch(sqsMessageListActions.loadMessages({
            queueArn: this.queueArn,
            prefix: this.state.value['sqs-message-list'].prefix,
            pageSize: this.state.value['sqs-message-list'].pageSize,
            pageIndex: this.state.value['sqs-message-list'].pageIndex,
            sortColumns: this.state.value['sqs-message-list'].sortColumns
        }));
    }

    editMessage(message: SqsMessageItem) {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {message: message};
        dialogConfig.maxWidth = '100vw';
        dialogConfig.maxHeight = '90vh';
        dialogConfig.panelClass = 'full-screen-modal';
        dialogConfig.width = "70%"

        this.dialog.open(ViewMessageComponentDialog, dialogConfig).afterClosed().subscribe(() => {
            this.loadMessages();
        });
    }

    sendMessage() {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {queueUrl: this.queueUrl};
        dialogConfig.maxWidth = '100vw';
        dialogConfig.maxHeight = '100vh';
        dialogConfig.width = "90%"
        dialogConfig.panelClass = 'full-screen-modal';

        this.dialog.open(SendMessageComponentDialog, dialogConfig).afterClosed().subscribe((result: SqsMessageDialogResult) => {
            if (result) {
                this.sqsService.sendMessage(this.queueUrl, result.message, 0, result.attributes).subscribe(() => {
                    this.loadMessages();
                    this.snackBar.open('Message send, queueArn: ' + this.queueArn, 'Done', {duration: 5000});
                });
            }
        });
    }

    resendMessage(messageId: string) {
        this.lastUpdate = new Date();
        this.sqsService.resendMessage(this.queueArn, messageId).subscribe(() => {
            this.loadMessages();
            this.snackBar.open('Message resend, queueUrl: ' + this.queueUrl, 'Done', {duration: 5000});
        });
    }

    purgeMessages() {
        this.sqsService.purgeQueue(this.queueUrl).subscribe(() => {
            this.loadMessages();
            this.snackBar.open('SQS messages purged, url: ' + this.queueUrl, 'Done', {duration: 5000})
        });
    }

    deleteMessage(receiptHandle: string) {
        this.lastUpdate = new Date();
        this.sqsService.deleteMessage(this.queueUrl, receiptHandle).subscribe(() => {
            this.loadMessages();
            this.snackBar.open('Message deleted, queueUrl: ' + this.queueUrl, 'Done', {duration: 5000});
        });
    }
}
