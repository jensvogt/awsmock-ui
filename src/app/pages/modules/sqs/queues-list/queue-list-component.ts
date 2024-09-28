import {AfterViewInit, Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle} from "@angular/material/card";
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
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {interval, Subscription} from "rxjs";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {QueueItem} from "../model/queue-item";
import {MatSort, MatSortHeader, Sort} from "@angular/material/sort";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {QueueAddComponentDialog} from "../queue-add/queue-add-component";
import {MatTooltip} from "@angular/material/tooltip";
import {BreadcrumbComponent} from "../../../../shared/breadcrump/breadcrump.component";
import {SqsService} from "../../../../services/sqs-service.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SendMessageComponentDialog} from "./send-message/send-message.component";

@Component({
    selector: 'sqs-queue-list',
    templateUrl: './queue-list-component.html',
    standalone: true,
    imports: [
        MatCard,
        MatCardHeader,
        MatCardContent,
        MatCardActions,
        MatCardSubtitle,
        MatTable,
        MatHeaderCellDef,
        MatCellDef,
        MatColumnDef,
        MatIcon,
        MatHeaderCell,
        MatCell,
        MatHeaderRowDef,
        MatHeaderRow,
        MatSortHeader,
        MatRowDef,
        MatNoDataRow,
        MatIconButton,
        MatRow,
        MatPaginator,
        MatSort,
        MatTooltip,
        BreadcrumbComponent
    ],
    styleUrls: ['./queue-list-component.scss'],
    providers: [SqsService]
})
export class QueueListComponent implements OnInit, OnDestroy, AfterViewInit {
    lastUpdate: string = '';

    // Table
    queueData: Array<QueueItem> = [];
    queueDataDataSource = new MatTableDataSource(this.queueData);
    columns: any[] = ['queueName', 'messagesAvailable', 'messagesInFlight', 'actions'];

    // Auto-update
    updateSubscription: Subscription | undefined;

    // Paging
    length = 0;
    pageSize = 10;
    pageIndex = 0;
    pageSizeOptions = [5, 10, 20, 50, 100];
    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;
    nextToken: string = '';
    pageEvent: PageEvent = {length: 0, pageIndex: 0, pageSize: 0};

    // Sorting
    private _liveAnnouncer = inject(LiveAnnouncer);

    constructor(private snackBar: MatSnackBar, private dialog: MatDialog, private sqsService: SqsService) {
    }

    // @ts-ignore
    @ViewChild(MatSort) set matSort(sort: MatSort) {
        this.queueDataDataSource.sort = sort;
    }

    ngOnInit(): void {
        this.loadQueues();
        this.updateSubscription = interval(60000).subscribe(() => this.loadQueues());
    }

    ngOnDestroy(): void {
        this.updateSubscription?.unsubscribe();
    }

    ngAfterViewInit() {
        // @ts-ignore
        this.queueData.sort = this.sort;
    }

    refresh() {
        this.loadQueues();
    }

    handlePageEvent(e: PageEvent) {
        this.pageEvent = e;
        this.length = e.length;
        this.pageSize = e.pageSize;
        this.pageIndex = e.pageIndex;
        this.loadQueues();
    }

    sortChange(sortState: Sort) {
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
    }

    lastUpdateTime() {
        return new Date().toLocaleTimeString('DE-de');
    }

    loadQueues() {
        this.queueData = [];
        this.sqsService.listQueues(this.pageIndex, this.pageSize, "")
            .then((data: any) => {
                this.lastUpdate = this.lastUpdateTime();
                this.nextToken = data.NextToken;
                this.length = data.Total;
                data.QueueUrls.forEach((q: string) => {
                    this.queueData.push({
                        messagesAvailable: undefined,
                        messagesInFlight: undefined,
                        queueUrl: q,
                        queueName: q.substring(q.lastIndexOf('/') + 1)
                    });
                    this.getQueueAttributes(q);
                });
                this.queueDataDataSource.data = this.queueData;
            })
            .catch((error: any) => console.error(error))
            .finally(() => {
                this.sqsService.cleanup();
            });
    }

    addQueue() {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        this.dialog.open(QueueAddComponentDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.saveQueue(result)
                this.loadQueues();
            }
        });
    }

    purgeQueue(name: string) {
        this.sqsService.purgeQueue(name)
            .then(() => {
                this.loadQueues();
            })
            .catch((error: any) => console.error(error))
            .finally(() => {
                this.sqsService.cleanup();
            });
    }

    getQueueAttributes(queueUrl: string) {
        this.sqsService.getQueueAttributes(queueUrl)
            .then((data: any) => {
                let item = this.queueData.find((q) => q.queueUrl == queueUrl);
                if (item) {
                    item.messagesAvailable = +data.Attributes.ApproximateNumberOfMessages;
                    item.messagesInFlight = +data.Attributes.ApproximateNumberOfMessagesNotVisible;
                }
            })
            .catch((error: any) => console.error(error))
            .finally(() => {
                this.sqsService.cleanup();
            });
    }

    saveQueue(name: string) {
        this.sqsService.saveQueue(name)
            .then(() => {
                this.loadQueues();
            })
            .catch((error: any) => console.error(error))
            .finally(() => {
                this.sqsService.cleanup();
            });
    }

    sendMessage(queueUrl: string) {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {queueUrl: queueUrl};
        dialogConfig.height = '400px';
        dialogConfig.width = '600px';

        this.dialog.open(SendMessageComponentDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.sqsService.sendMessage(queueUrl, result);
                this.loadQueues();
            }
        });
    }

    deleteQueue(queueUrl: string) {
        this.sqsService.deleteQueue(queueUrl)
            .then(() => {
                this.loadQueues();
            })
            .catch((error: any) => console.error(error))
            .finally(() => {
                this.sqsService.cleanup();
            });
    }
}
