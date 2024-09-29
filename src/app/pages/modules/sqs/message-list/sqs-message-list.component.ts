import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
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
import {MessageItem} from "../model/sqs-message-item";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {AwsMockHttpService} from "../../../../services/awsmock-http.service";
import {Location} from '@angular/common'

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
        MatHeaderCellDef
    ],
    styleUrls: ['./sqs-message-list.component.scss'],
    providers: [AwsMockHttpService]
})
export class SqsMessageListComponent implements OnInit, OnDestroy {
    lastUpdate: string = '';

    // Table
    messageData: Array<MessageItem> = [];
    messageDataSource = new MatTableDataSource(this.messageData);
    columns: any[] = ['messageId', 'region', 'actions'];

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
    private sub: any;

    // Sorting
    private _liveAnnouncer = inject(LiveAnnouncer);

    constructor(private snackBar: MatSnackBar, private sqsService: SqsService, private route: ActivatedRoute,
                private location: Location, private dialog: MatDialog, private awsmockHttpService: AwsMockHttpService) {
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
        this.queueName = this.queueArn.substring(this.queueArn.lastIndexOf(':'));
        this.sqsService.getQueueUrl(this.queueName)
            .then((data: any) => {
                this.queueUrl = data;
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

    sortChange(sortState: Sort) {
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
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
        this.awsmockHttpService.listMessages(this.queueArn, this.pageSize, this.pageIndex)
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
                        region: m.region
                    });
                });
                this.messageDataSource.data = this.messageData;
            });
    }

    editMessage(messageId: string) {

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
