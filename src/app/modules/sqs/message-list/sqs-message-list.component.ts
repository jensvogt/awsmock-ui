import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute} from "@angular/router";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {SqsService} from "../service/sqs-service.component";
import {MatTableDataSource} from "@angular/material/table";
import {PageEvent} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {Location} from "@angular/common";
import {interval, Subscription} from "rxjs";
import {SqsMessageItem} from "../model/sqs-message-item";
import {EditMessageComponentDialog} from "./view-message/edit-message.component";
import {SendMessageComponentDialog} from "../send-message/send-message.component";
import {SortColumn} from "../../../shared/sorting/sorting.component";

@Component({
    selector: 'sqs-message-list',
    templateUrl: './sqs-message-list.component.html',
    styleUrls: ['./sqs-message-list.component.scss'],
})
export class SqsMessageListComponent implements OnInit, OnDestroy {

    // Last update
    lastUpdate: Date = new Date();

    // Table
    messageData: Array<SqsMessageItem> = [];
    messageDataSource = new MatTableDataSource(this.messageData);
    columns: any[] = ['messageId', 'region', 'created', 'modified', 'actions'];

    // Paging
    length = 0;
    pageSize = 10;
    pageIndex = 0;
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

    // Sorting, default create descending
    sortColumns: SortColumn[] = [{column: 'created', sortDirection: 1}];
    private sub: any;

    constructor(private snackBar: MatSnackBar, private sqsService: SqsService, private route: ActivatedRoute, private dialog: MatDialog, private location: Location) {
    }

    // @ts-ignore
    @ViewChild(MatSort) set matSort(sort: MatSort) {
        this.messageDataSource.sort = sort;
    }

    ngOnInit(): void {
        this.sub = this.route.params.subscribe(params => {
            this.queueArn = decodeURI(params['queueArn']);
        });
        this.updateSubscription = interval(60000).subscribe(() => this.loadMessages());
        this.queueName = this.queueArn.substring(this.queueArn.lastIndexOf(':') + 1);
        this.sqsService.getQueueUrl(this.queueName)
            .then((data: any) => {
                this.queueUrl = data.QueueUrl;
            })
            .catch((error: any) => console.error(error))
            .finally(() => {
                this.sqsService.cleanup();
            });
        this.loadMessages();
    }

    ngOnDestroy(): void {
        this.updateSubscription?.unsubscribe();
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.loadMessages();
    }

    sortChange(sortState: Sort) {
        this.sortColumns = [];
        if (sortState.direction === 'asc') {
            this.sortColumns.push({column: sortState.active, sortDirection: 1});
        } else {
            this.sortColumns.push({column: sortState.active, sortDirection: -1});
        }
        this.loadMessages();
    }

    handlePageEvent(e: PageEvent) {
        this.pageEvent = e;
        this.length = e.length;
        this.pageSize = e.pageSize;
        this.pageIndex = e.pageIndex;
        this.loadMessages();
    }

    loadMessages() {
        this.messageData = [];
        this.sqsService.listSqsMessages(this.queueArn, this.pageSize, this.pageIndex, this.sortColumns)
            .subscribe((data: any) => {
                this.lastUpdate = new Date();
                this.length = data.Total;
                data.Messages.forEach((m: any) => {
                    this.messageData.push({
                        id: m.id,
                        messageId: m.messageId,
                        body: m.body,
                        md5Sum: m.md5Sum,
                        receiptHandle: m.receiptHandle,
                        region: m.region,
                        created: m.created,
                        modified: m.modified,
                    });
                });
                this.messageDataSource.data = this.messageData;
            });
    }

    editMessage(message: SqsMessageItem) {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {message: message};
        dialogConfig.maxWidth = '100vw';
        dialogConfig.maxHeight = '80vh';
        dialogConfig.panelClass = 'full-screen-modal';

        this.dialog.open(EditMessageComponentDialog, dialogConfig).afterClosed().subscribe(() => {
        });
    }

    sendMessage() {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {queueUrl: this.queueUrl};
        dialogConfig.maxWidth = '100vw';
        dialogConfig.maxHeight = '100vh';
        dialogConfig.panelClass = 'full-screen-modal';

        this.dialog.open(SendMessageComponentDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.sqsService.sendMessage(this.queueUrl, result).then(() => {
                    this.loadMessages();
                    this.snackBar.open('Message send, queueArn: ' + this.queueArn, 'Done', {duration: 5000});
                });
            }
        });
    }

    deleteMessage(receiptHandle: string) {
        this.sqsService.deleteMessage(this.queueUrl, receiptHandle)
            .then(() => {
                this.loadMessages();
                this.snackBar.open('Message deleted, receiptHandle:' + receiptHandle, 'Dismiss', {duration: 5000});
            })
            .catch((error: any) => console.error(error))
            .finally(() => {
                this.sqsService.cleanup();
            });

    }
}
