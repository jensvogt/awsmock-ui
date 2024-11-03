import {Component, OnDestroy, OnInit} from '@angular/core';
import {PageEvent} from "@angular/material/paginator";
import {Location} from "@angular/common";
import {Sort} from "@angular/material/sort";
import {filter, interval, Observable, Subscription} from "rxjs";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ListTopicCountersResponse} from "../model/sns-topic-item";
import {TopicAddComponentDialog} from "../topic-add/topic-add.component";
import {SnsService} from "../service/sns-service.component";
import {PublishMessageComponentDialog} from "../message-list/publish-message/publish-message.component";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {ActionsSubject, State, Store} from "@ngrx/store";
import {snsTopicListActions} from "./state/sns-topic-list.actions";
import {selectPageIndex, selectPageSize, selectTopicCounters} from "./state/sns-topic-list.selectors";
import {SNSTopicListState} from "./state/sns-topic-list.reducer";
import {selectError} from "../topic-detail/state/sns-topic-detail.selectors";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'app-home',
    templateUrl: './topic-list.component.html',
    styleUrls: ['./topic-list.component.scss'],
    providers: [SnsService]
})
export class SnsTopicListComponent implements OnInit, OnDestroy {

    // Last update
    lastUpdate: Date = new Date();

    // Table
    pageSize$: Observable<number> = this.store.select(selectPageSize);
    pageIndex$: Observable<number> = this.store.select(selectPageIndex);
    error$: Observable<string> = this.store.select(selectError);
    listTopicCountersResponse$: Observable<ListTopicCountersResponse> = this.store.select(selectTopicCounters);
    columns: any[] = ['topicName', 'availableMessages', 'created', 'modified', 'actions'];

    // Auto-update
    updateSubscription: Subscription | undefined;

    // Paging
    pageSizeOptions = [5, 10, 20, 50, 100];
    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;

    // Prefix
    prefixSet: boolean = false;
    prefix: string = '';

    // Sorting, default available
    sortColumns: SortColumn[] = [{column: 'name', sortDirection: -1}];

    constructor(private snackBar: MatSnackBar, private dialog: MatDialog, private location: Location, private state: State<SNSTopicListState>, private store: Store,
                private actionsSubj$: ActionsSubject) {
        this.actionsSubj$.pipe(
            filter((action) =>
                action.type === snsTopicListActions.addTopicSuccess.type ||
                action.type === snsTopicListActions.publishMessageSuccess.type ||
                action.type === snsTopicListActions.purgeTopicSuccess.type ||
                action.type === snsTopicListActions.deleteTopicSuccess.type
            )
        ).subscribe(() => {
                this.lastUpdate = new Date();
                this.loadTopics();
            }
        );
    }

    ngOnInit(): void {
        this.loadTopics();
        this.updateSubscription = interval(60000).subscribe(() => this.loadTopics());
    }

    ngOnDestroy(): void {
        this.updateSubscription?.unsubscribe();
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.loadTopics();
    }

    setPrefix() {
        this.prefixSet = true;
        this.state.value['sns-topic-list'].pageIndex = 0;
        this.state.value['sns-topic-list'].prefix = this.prefix;
        this.loadTopics();
    }

    unsetPrefix() {
        this.prefix = '';
        this.prefixSet = false;
        this.state.value['sns-topic-list'].prefix = '';
        this.loadTopics();
    }

    handlePageEvent(e: PageEvent) {
        this.state.value['sns-topic-list'].pageSize = e.pageSize;
        this.state.value['sns-topic-list'].pageIndex = e.pageIndex;
        this.store.dispatch(snsTopicListActions.loadTopics({
            prefix: this.state.value['sns-topic-list'].prefix,
            pageSize: this.state.value['sns-topic-list'].pageSize,
            pageIndex: this.state.value['sns-topic-list'].pageIndex,
            sortColumns: this.state.value['sns-topic-list'].sortColumns
        }));
    }

    sortChange(sortState: Sort) {
        this.state.value['sns-topic-list'].sortColumns = [];
        let direction: number;
        let column = 'topicName';
        if (sortState.active === 'availableMessages') {
            column = 'attributes.availableMessages'
        }
        if (sortState.direction === 'asc') {
            direction = 1;
        } else {
            direction = -1;
        }
        this.state.value['sns-topic-list'].sortColumns = [{column: column, sortDirection: direction}];
        this.loadTopics();
    }

    loadTopics() {
        this.store.dispatch(snsTopicListActions.loadTopics({
            prefix: this.state.value['sns-topic-list'].prefix,
            pageSize: this.state.value['sns-topic-list'].pageSize,
            pageIndex: this.state.value['sns-topic-list'].pageIndex,
            sortColumns: this.state.value['sns-topic-list'].sortColumns
        }));
    }

    addTopic() {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        this.dialog.open(TopicAddComponentDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.store.dispatch(snsTopicListActions.addTopic({name: result}));
            }
        });
    }

    publishMessage(topicArn: string) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {topicArn: topicArn};
        dialogConfig.maxWidth = '100vw';
        dialogConfig.maxHeight = '100vh';
        dialogConfig.panelClass = 'full-screen-modal';
        dialogConfig.width = "90%"

        this.dialog.open(PublishMessageComponentDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.store.dispatch(snsTopicListActions.publishMessage({topicArn: topicArn, message: result}));
            }
        });
    }

    purgeTopic(topicArn: string) {
        this.store.dispatch(snsTopicListActions.purgeTopic({topicArn: topicArn}));
    }

    deleteTopic(topicArn: string) {
        this.store.dispatch(snsTopicListActions.deleteTopic({topicArn: topicArn}));
    }
}
