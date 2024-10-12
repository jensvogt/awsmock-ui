import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {QueueAddComponentDialog} from "../queue-add/queue-add-component";
import {MatTooltip} from "@angular/material/tooltip";
import {BreadcrumbComponent} from "../../../../shared/breadcrump/breadcrump.component";
import {SqsService} from "../../../../services/sqs-service.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SendMessageComponentDialog} from "../send-message/send-message.component";
import {AwsMockHttpService} from "../../../../services/awsmock-http.service";
import {Router, RouterLink} from "@angular/router";
import {NavigationService} from "../../../../services/navigation.service";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {MatListItem, MatNavList} from "@angular/material/list";

@Component({
    selector: 'sqs-queue-list',
    templateUrl: './queue-list.component.html',
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
        BreadcrumbComponent,
        RouterLink,
        MatListItem,
        MatNavList
    ],
    styleUrls: ['./queue-list.component.scss'],
    providers: [SqsService, AwsMockHttpService]
})
export class QueueListComponent implements OnInit, OnDestroy, AfterViewInit {
    lastUpdate: string = '';

    // Table
    queueData: Array<QueueItem> = [];
    queueDataDataSource = new MatTableDataSource(this.queueData);
    columns: any[] = ['queueName', 'messagesAvailable', 'messagesInFlight', 'messagesDelayed', 'actions'];

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
    sortColumns: SortColumn[] = [];

    constructor(private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog,
                private sqsService: SqsService, private awsmockHttpService: AwsMockHttpService,
                private navigation: NavigationService) {
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

    back() {
        this.navigation.back();
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
        this.sortColumns = [];
        let column = 'attributes.approximateNumberOfMessages';
        if (sortState.active === 'messagesInFlight') {
            column = 'attributes.approximateNumberOfMessagesNotVisible'
        } else if (sortState.active === 'messagesDelayed') {
            column = 'attributes.approximateNumberOfMessagesDelayed';
        }
        if (sortState.direction === 'asc') {
            this.sortColumns.push({column: column, sortDirection: 1});
        } else {
            this.sortColumns.push({column: column, sortDirection: -1});
        }
        this.loadQueues();
    }

    lastUpdateTime() {
        return new Date().toLocaleTimeString('DE-de');
    }

    loadQueues() {
        this.queueData = [];
        this.awsmockHttpService.listQueueCounters(this.pageSize, this.pageIndex, this.sortColumns)
            .subscribe((data: any) => {
                this.lastUpdate = this.lastUpdateTime();
                this.nextToken = data.NextToken;
                this.length = data.Total;
                data.QueueCounters.forEach((q: any) => {
                    this.queueData.push({
                        messagesAvailable: q.available,
                        messagesInFlight: q.invisible,
                        messagesDelayed: q.delayed,
                        queueUrl: q.queueUrl,
                        queueArn: q.queueArn,
                        queueName: q.queueName
                    });
                });
                this.queueDataDataSource.data = this.queueData;
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

    listMessages(queueArn: string) {
        this.router.navigate(['/sqs-message-list', encodeURI(queueArn)]);
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
        dialogConfig.maxWidth = '100vw';
        dialogConfig.maxHeight = '100vh';
        dialogConfig.panelClass = 'full-screen-modal';
        dialogConfig.width = "90%"

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
