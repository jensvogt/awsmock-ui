import {Component, OnDestroy, OnInit} from '@angular/core';
import {PageEvent} from "@angular/material/paginator";
import {Sort} from "@angular/material/sort";
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {interval, Observable, Subscription} from "rxjs";
import {SnsMessageCountersResponse, SnsMessageItem} from "../model/sns-message-item";
import {PublishMessageComponentDialog} from "../message-publish/publish-message.component";
import {SnsService} from "../service/sns-service.component";
import {State, Store} from "@ngrx/store";
import {SNSMessageListState} from "./state/sns-message-list.reducer";
import {snsMessageListActions} from "./state/sns-message-list.actions";
import {selectMessageCounters, selectPageIndex, selectPageSize} from "./state/sns-message-list.selectors";
import {SnsMessageDetailsDialog} from "../message-details/sns-message-details.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {byteConversion} from "../../../shared/byte-utils.component";
import {AutoReloadComponent} from "../../../shared/autoreload/auto-reload.component";

@Component({
    selector: 'sns-message-list-component',
    templateUrl: './sns-message-list.component.html',
    styleUrls: ['./sns-message-list.component.scss'],
    standalone: false,
    providers: [SnsService]
})
export class SnsMessageListComponent implements OnInit, OnDestroy {

    // Last update
    lastUpdate: Date = new Date();

    // Table
    topicArn: string = '';
    pageSize$: Observable<number> = this.store.select(selectPageSize);
    pageIndex$: Observable<number> = this.store.select(selectPageIndex);
    listMessageCountersResponse$: Observable<SnsMessageCountersResponse> = this.store.select(selectMessageCounters);
    columns: any[] = ['messageId', 'contentType', 'size', 'status', 'created', 'modified', 'lastSend', 'actions'];

    // Paging
    pageSizeOptions = [5, 10, 20, 50, 100];
    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;

    // Router parameter
    topicName: string = '';

    // Prefix
    prefixSet: boolean = false;
    prefixValue: string = '';
    protected readonly byteConversion = byteConversion;

    // Auto-update
    private updateSubscription: Subscription | undefined;
    private routerSubscription: Subscription | undefined;

    constructor(private readonly route: ActivatedRoute, private readonly location: Location, private readonly dialog: MatDialog, private readonly store: Store, private readonly state: State<SNSMessageListState>,
                private readonly snsService: SnsService, private readonly snackBar: MatSnackBar) {
    }

    ngOnInit(): void {
        this.routerSubscription = this.route.params.subscribe(params => {
            this.topicArn = decodeURI(params['topicArn']);
            this.topicName = this.topicArn.substring(this.topicArn.lastIndexOf(':') + 1);
        });
        const period = parseInt(<string>localStorage.getItem("autoReload"));
        this.updateSubscription = interval(period).subscribe(() => this.loadMessages());
        this.loadMessages();
    }

    ngOnDestroy(): void {
        this.routerSubscription?.unsubscribe();
        this.updateSubscription?.unsubscribe();
    }

    autoReload(): void {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.maxWidth = '100vw';
        dialogConfig.maxHeight = '100vh';
        dialogConfig.panelClass = 'full-screen-modal';
        dialogConfig.width = "20%"
        dialogConfig.minWidth = '280px'
        dialogConfig.data = {title: 'Export modules', mode: 'export'};

        this.dialog.open(AutoReloadComponent, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                const period = parseInt(<string>localStorage.getItem("autoReload"));
                this.updateSubscription?.unsubscribe();
                this.updateSubscription = interval(period).subscribe(() => this.loadMessages());
            }
        });
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.loadMessages();
    }

    setPrefix() {
        this.prefixSet = true;
        this.state.value['sns-topic-list'].pageIndex = 0;
        this.state.value['sns-topic-list'].prefix = this.prefixValue;
        this.loadMessages();
    }

    unsetPrefix() {
        this.prefixValue = '';
        this.prefixSet = false;
        this.state.value['sns-topic-list'].prefix = '';
        this.loadMessages();
    }

    sortChange(sortState: Sort) {
        this.state.value['sns-message-list'].sortColumns = [];
        let direction: number;
        let column = sortState.active;
        if (sortState.active === 'availableMessages') {
            column = 'attributes.availableMessages'
        }
        if (sortState.direction === 'asc') {
            direction = 1;
        } else {
            direction = -1;
        }
        this.state.value['sns-message-list'].sortColumns = [{column: column, sortDirection: direction}];
        this.loadMessages();
    }

    handlePageEvent(e: PageEvent) {
        this.state.value['sns-message-list'].pageSize = e.pageSize;
        this.state.value['sns-message-list'].pageIndex = e.pageIndex;
        this.loadMessages();
    }

    loadMessages() {
        this.lastUpdate = new Date();
        this.store.dispatch(snsMessageListActions.loadMessages({
            topicArn: this.topicArn,
            prefix: this.state.value['sns-message-list'].prefix,
            pageSize: this.state.value['sns-message-list'].pageSize,
            pageIndex: this.state.value['sns-message-list'].pageIndex,
            sortColumns: this.state.value['sns-message-list'].sortColumns
        }));
    }

    editMessage(message: SnsMessageItem) {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {message: message};
        dialogConfig.maxWidth = '100vw';
        dialogConfig.maxHeight = '90vh';
        dialogConfig.panelClass = 'full-screen-modal';
        dialogConfig.width = "70%"

        this.dialog.open(SnsMessageDetailsDialog, dialogConfig).afterClosed().subscribe(() => {
        });
    }

    deleteMessage(messageId: string) {
        this.snsService.deleteMessage(this.topicArn, messageId).subscribe(() => {
            this.loadMessages();
            this.snackBar.open('SNS message deleted, messageId: ' + messageId, 'Done', {duration: 5000})
        });
    }

    publishMessage() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {topicArn: this.topicArn};
        dialogConfig.maxWidth = '100vw';
        dialogConfig.maxHeight = '100vh';
        dialogConfig.panelClass = 'full-screen-modal';
        dialogConfig.width = "90%"

        this.dialog.open(PublishMessageComponentDialog, dialogConfig).afterClosed().subscribe(message => {
            if (message) {
                this.snsService.publishMessage(this.topicArn, message.message, message.attributes).subscribe(() => {
                    this.loadMessages();
                    this.snackBar.open('SNS message published, topicName: ' + this.topicName, 'Done', {duration: 5000})
                });
            }
        });
    }
}
