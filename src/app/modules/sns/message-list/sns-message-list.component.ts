import {Component, OnDestroy, OnInit} from '@angular/core';
import {PageEvent} from "@angular/material/paginator";
import {Sort} from "@angular/material/sort";
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {filter, Observable, Subscription} from "rxjs";
import {SnsMessageCountersResponse, SnsMessageItem} from "../model/sns-message-item";
import {PublishMessageComponentDialog} from "./publish-message/publish-message.component";
import {EditSNSMessageComponentDialog} from "./edit-message/edit-message.component";
import {SnsService} from "../service/sns-service.component";
import {ActionsSubject, State, Store} from "@ngrx/store";
import {SNSMessageListState} from "./state/sns-message-list.reducer";
import {snsMessageListActions} from "./state/sns-message-list.actions";
import {selectMessageCounters, selectPageIndex, selectPageSize} from "./state/sns-message-list.selectors";

@Component({
    selector: 'sns-message-list',
    templateUrl: './sns-message-list.component.html',
    styleUrls: ['./sns-message-list.component.scss'],
    providers: [SnsService]
})
export class SnsMessageListComponent implements OnInit, OnDestroy {

    // Last update
    lastUpdate: Date = new Date();

    // Table
    pageSize$: Observable<number> = this.store.select(selectPageSize);
    pageIndex$: Observable<number> = this.store.select(selectPageIndex);
    listMessageCountersResponse$: Observable<SnsMessageCountersResponse> = this.store.select(selectMessageCounters);
    columns: any[] = ['messageId', 'region', 'created', 'modified', 'actions'];

    // Paging
    pageSizeOptions = [5, 10, 20, 50, 100];
    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;

    // Router parameter
    topicArn: string = '';
    topicName: string = '';

    // Auto-update
    private updateSubscription: Subscription | undefined;
    private routerSubscription: Subscription | undefined;

    constructor(private route: ActivatedRoute, private location: Location, private dialog: MatDialog, private store: Store, private state: State<SNSMessageListState>,
                private actionsSubj$: ActionsSubject) {
        this.actionsSubj$.pipe(
            filter((action) =>
                action.type === snsMessageListActions.publishMessageSuccess.type ||
                action.type === snsMessageListActions.deleteMessageSuccess.type
            )
        ).subscribe(() => {
                this.lastUpdate = new Date();
                //this.loadMessages();
            }
        );
    }

    ngOnInit(): void {
        this.routerSubscription = this.route.params.subscribe(params => {
            this.topicArn = decodeURI(params['topicArn']); // (+) converts string 'id' to a number
            this.topicName = this.topicArn.substring(this.topicArn.lastIndexOf(':'));
        });
        //this.updateSubscription = interval(60000).subscribe(() => this.loadMessages());
        this.loadMessages();
    }

    ngOnDestroy(): void {
        this.routerSubscription?.unsubscribe();
        this.updateSubscription?.unsubscribe();
    }

    back() {
        this.location.back();
    }

    refresh() {
        // this.loadMessages();
    }

    sortChange(sortState: Sort) {
        this.state.value['sns-message-list'].sortColumns = [];
        let direction: number;
        let column = 'messageId';
        if (sortState.active === 'availableMessages') {
            column = 'attributes.availableMessages'
        }
        if (sortState.direction === 'asc') {
            direction = 1;
        } else {
            direction = -1;
        }
        this.state.value['sns-message-list'].sortColumns = [{column: column, sortDirection: direction}];
//        this.loadMessages();
    }

    handlePageEvent(e: PageEvent) {
        this.state.value['sns-message-list'].pageSize = e.pageSize;
        this.state.value['sns-message-list'].pageIndex = e.pageIndex;
//        this.loadMessages();
    }

    loadMessages() {
        this.store.dispatch(snsMessageListActions.loadMessages({
            topicArn: this.topicArn,
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
        dialogConfig.maxHeight = '80vh';
        dialogConfig.panelClass = 'full-screen-modal';

        this.dialog.open(EditSNSMessageComponentDialog, dialogConfig).afterClosed().subscribe(() => {
        });
    }

    deleteMessage(messageId: string) {
        this.store.dispatch(snsMessageListActions.deleteMessage({messageId: messageId}));
    }

    publishMessage() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {topicArn: this.topicArn};
        dialogConfig.maxWidth = '100vw';
        dialogConfig.maxHeight = '100vh';
        dialogConfig.panelClass = 'full-screen-modal';

        this.dialog.open(PublishMessageComponentDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.store.dispatch(snsMessageListActions.publishMessage({topicArn: this.topicArn, message: result}));
            }
        });
    }
}
