import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {async, Observable, Subscription} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {QueueItem} from "../model/queue-item";
import {Sort} from "@angular/material/sort";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {QueueAddComponentDialog} from "../queue-add/queue-add-component";
import {SqsService} from "../../../services/sqs-service.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SendMessageComponentDialog} from "../send-message/send-message.component";
import {AwsMockHttpService} from "../../../services/awsmock-http.service";
import {Router} from "@angular/router";
import {NavigationService} from "../../../services/navigation.service";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {EffectsModule} from "@ngrx/effects";
import {Store, StoreModule} from "@ngrx/store";
import {sqsQueueListActions} from './state/queue-list.actions';
import {selectIsLoading, selectPageSize} from "./state/queue-list.selectors";
import {SQSModule} from "../sqs.module";

@Component({
    selector: 'sqs-queue-list',
    templateUrl: './queue-list.component.html',
    styleUrls: ['./queue-list.component.scss'],
    providers: [SqsService, AwsMockHttpService, StoreModule, EffectsModule, SQSModule]
})
export class QueueListComponent implements OnInit, OnDestroy, AfterViewInit {


    // Last update
    lastUpdate: Date = new Date();

    // Table
    queueData: QueueItem[] = [];
    queuesCounters$: Observable<QueueItem[]> | undefined;
    isLoading$: Observable<boolean> | undefined;
    pageSize$: Observable<number> | undefined;

    queueDataDataSource = new MatTableDataSource(this.queueData);
    columns: any[] = ['queueName', 'messagesAvailable', 'messagesInFlight', 'messagesDelayed', 'actions'];

    // Auto-update
    updateSubscription: Subscription | undefined;

    // Paging
    length: number = 0;
    //pageSize: number = 10;
    pageIndex: number = 0;
    pageSizeOptions = [5, 10, 20, 50, 100];
    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;
    pageEvent: PageEvent = {length: 0, pageIndex: 0, pageSize: 0};

    // Sorting, default available
    sortColumns: SortColumn[] = [{column: 'attributes.approximateNumberOfMessages', sortDirection: -1}];

    // Prefix
    prefixSet: boolean = false;
    prefix: string = '';
    protected readonly async = async;

    constructor(private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog,
                private sqsService: SqsService, private navigation: NavigationService, private readonly store: Store) {
    }

    ngOnInit(): void {
        this.isLoading$ = this.store.select(selectIsLoading)
        this.pageSize$ = this.store.select(selectPageSize)
        this.store.dispatch(sqsQueueListActions.initialize());

        let ps = 0;
        this.pageSize$?.subscribe((data) => ps = data);
        this.store.dispatch(sqsQueueListActions.loadQueues({
            prefix: this.prefix,
            pageSize: ps,
            pageIndex: this.pageIndex,
            sortColumns: this.sortColumns
        }));

        this.queuesCounters$?.subscribe((data: any) => data.forEach((q: any) => {
            console.log("Counter:", q);
            this.queueData.push({
                messagesAvailable: q.available,
                messagesInFlight: q.invisible,
                messagesDelayed: q.delayed,
                queueUrl: q.queueUrl,
                queueArn: q.queueArn,
                queueName: q.queueName
            });
        }));
        /*        let ps = 0;
                this.pageSize$.subscribe((data) => ps = data);
                this.updateSubscription = interval(60000).subscribe(() =>
                    this.store.dispatch(sqsQueueListActions.loadQueues({
                        prefix: this.prefix,
                        pageSize: ps,
                        pageIndex: this.pageIndex,
                        sortColumns: this.sortColumns
                    })));*/
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
        let ps = 0;
        this.pageSize$?.subscribe((data) => ps = data);
        this.store.dispatch(sqsQueueListActions.loadQueues({prefix: this.prefix, pageSize: ps, pageIndex: this.pageIndex, sortColumns: this.sortColumns}));

        /*        this.store.select(appState => appState[queueListFeatureKey].queues).subscribe((data: any) => {
                    this.lastUpdate = new Date();
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
                });*/
    }

    setPrefix() {
        this.prefixSet = true;
        this.pageIndex = 0;
        // this.loadQueues();
    }

    unsetPrefix() {
        this.prefix = '';
        this.prefixSet = false;
        //this.loadQueues();
    }

    handlePageEvent(e: PageEvent) {
        this.pageEvent = e;
        this.length = e.length;
        // this.pageSize = e.pageSize;
        this.pageIndex = e.pageIndex;
        // this.loadQueues();
    }

    /*loadQueues() {
        this.queueData = [];
        this.awsmockHttpService.listQueueCounters(this.prefix, this.pageSize, this.pageIndex, this.sortColumns)
            .subscribe((data: any) => {
                this.lastUpdate = new Date();
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
    }*/

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
        //this.loadQueues();
    }

    addQueue() {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        this.dialog.open(QueueAddComponentDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.saveQueue(result)
                //this.loadQueues();
            }
        });
    }

    listMessages(queueArn: string) {
        this.router.navigate(['/sqs-message-list', encodeURI(queueArn)]);
    }

    purgeQueue(name: string) {
        this.sqsService.purgeQueue(name)
            .then(() => {
                //this.loadQueues();
            })
            .catch((error: any) => console.error(error))
            .finally(() => {
                this.sqsService.cleanup();
            });
    }

    saveQueue(name: string) {
        this.sqsService.saveQueue(name)
            .then(() => {
                //this.loadQueues();
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
                //this.loadQueues();
            }
        });
    }

    deleteQueue(queueUrl: string) {
        this.sqsService.deleteQueue(queueUrl)
            .then(() => {
                //this.loadQueues();
            })
            .catch((error: any) => console.error(error))
            .finally(() => {
                this.sqsService.cleanup();
            });
    }
}
