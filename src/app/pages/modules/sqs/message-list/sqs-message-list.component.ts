import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {SqsService} from "../../../../services/sqs-service.component";
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatNoDataRow,
    MatRow,
    MatRowDef,
    MatTable,
    MatTableDataSource
} from "@angular/material/table";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort, MatSortHeader, Sort} from "@angular/material/sort";
import {MatTooltip} from "@angular/material/tooltip";
import {interval, Subscription} from "rxjs";
import {SqsMessageItem} from "../model/sqs-message-item";
import {AwsMockHttpService} from "../../../../services/awsmock-http.service";
import {EditMessageComponentDialog} from "./edit-message/edit-message.component";
import {NavigationService} from "../../../../services/navigation.service";
import {DatePipe} from "@angular/common";
import {SendMessageComponentDialog} from "../send-message/send-message.component";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {MatListItem, MatNavList} from "@angular/material/list";

@Component({
    selector: 'sqs-message-list',
    templateUrl: './sqs-message-list.component.html',
    standalone: true,
    imports: [
        MatCard,
        MatCardActions,
        MatCardContent,
        MatCardHeader,
        MatCell,
        MatCellDef,
        MatColumnDef,
        MatHeaderCell,
        MatHeaderRow,
        MatHeaderRowDef,
        MatIcon,
        MatIconButton,
        MatPaginator,
        MatRow,
        MatRowDef,
        MatSort,
        MatSortHeader,
        MatTable,
        MatTooltip,
        RouterLink,
        MatNoDataRow,
        MatHeaderCellDef,
        DatePipe,
        MatNavList,
        MatListItem
    ],
    styleUrls: ['./sqs-message-list.component.scss'],
    providers: [AwsMockHttpService]
})
export class SqsMessageListComponent implements OnInit, OnDestroy {
    lastUpdate: string = '';

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

    constructor(private snackBar: MatSnackBar, private sqsService: SqsService, private route: ActivatedRoute, private dialog: MatDialog,
                private navigation: NavigationService, private awsmockHttpService: AwsMockHttpService) {
    }

    // @ts-ignore
    @ViewChild(MatSort) set matSort(sort: MatSort) {
        this.messageDataSource.sort = sort;
    }

    ngOnInit(): void {
        this.sub = this.route.params.subscribe(params => {
            this.queueArn = decodeURI(params['queueArn']); // (+) converts string 'id' to a number
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
        this.navigation.back();
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
        this.awsmockHttpService.listSqsMessages(this.queueArn, this.pageSize, this.pageIndex, this.sortColumns)
            .subscribe((data: any) => {
                this.lastUpdate = new Date().toLocaleTimeString('DE-de');
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
