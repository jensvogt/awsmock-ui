import {Component, OnDestroy, OnInit} from '@angular/core';
import {PageEvent} from "@angular/material/paginator";
import {Location} from "@angular/common";
import {Sort} from "@angular/material/sort";
import {interval, Observable, Subscription} from "rxjs";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ListTopicCountersResponse} from "../model/sns-topic-item";
import {TopicAddComponentDialog} from "../topic-add/topic-add.component";
import {SnsService} from "../service/sns-service.component";
import {PublishMessageComponentDialog} from "../message-publish/publish-message.component";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {State, Store} from "@ngrx/store";
import {snsTopicListActions} from "./state/sns-topic-list.actions";
import {selectPageIndex, selectPageSize, selectTopicCounters} from "./state/sns-topic-list.selectors";
import {SNSTopicListState} from "./state/sns-topic-list.reducer";
import {MatSnackBar} from "@angular/material/snack-bar";
import {byteConversion} from "../../../shared/byte-utils.component";
import {AutoReloadComponent} from "../../../shared/autoreload/auto-reload.component";

@Component({
    selector: 'sns-topic-list-component',
    templateUrl: './topic-list.component.html',
    styleUrls: ['./topic-list.component.scss'],
    standalone: false,
    providers: [SnsService]
})
export class SnsTopicListComponent implements OnInit, OnDestroy {

    // Last update
    lastUpdate: Date = new Date();

    // Table
    pageSize$: Observable<number> = this.store.select(selectPageSize);
    pageIndex$: Observable<number> = this.store.select(selectPageIndex);
    listTopicCountersResponse$: Observable<ListTopicCountersResponse> = this.store.select(selectTopicCounters);
    sortColumns: SortColumn[] = [{column: 'name', sortDirection: -1}];
    columns: any[] = ['topicName', 'availableMessages', 'size', 'created', 'modified', 'actions'];

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
    prefixValue: string = '';

    protected readonly byteConversion = byteConversion;

    constructor(private readonly snackBar: MatSnackBar, private readonly dialog: MatDialog, private readonly location: Location, private readonly state: State<SNSTopicListState>, private readonly store: Store,
                private readonly snsService: SnsService) {
    }

    ngOnInit(): void {
        this.loadTopics();
        const period = parseInt(<string>localStorage.getItem("autoReload"));
        this.updateSubscription = interval(period).subscribe(() => this.loadTopics());
        this.listTopicCountersResponse$.subscribe((data) => console.log("Topic list data: ", data));
    }

    ngOnDestroy(): void {
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
                this.updateSubscription?.unsubscribe();
                const period = parseInt(<string>localStorage.getItem("autoReload"));
                this.updateSubscription = interval(period).subscribe(() => this.loadTopics());
            }
        });
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
        this.state.value['sns-topic-list'].prefix = this.prefixValue;
        this.loadTopics();
    }

    unsetPrefix() {
        this.prefixValue = '';
        this.prefixSet = false;
        this.state.value['sns-topic-list'].prefix = '';
        this.loadTopics();
    }

    handlePageEvent(e: PageEvent) {
        this.state.value['sns-topic-list'].pageSize = e.pageSize;
        this.state.value['sns-topic-list'].pageIndex = e.pageIndex;
        this.loadTopics();
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
                this.snsService.createTopic(result).subscribe(() => {
                    this.loadTopics();
                    this.snackBar.open('SNS topic created, name: ' + result, 'Done', {duration: 5000})
                });
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
        dialogConfig.width = "70%"
        dialogConfig.height = "70%"

        this.dialog.open(PublishMessageComponentDialog, dialogConfig).afterClosed().subscribe(message => {
            if (message) {
                this.snsService.publishMessage(topicArn, message.message, message.attributes).subscribe(() => {
                    this.loadTopics();
                    this.snackBar.open('SNS message published, topicArn: ' + topicArn, 'Done', {duration: 5000})
                });
            }
        });
    }

    purgeTopic(topicArn: string) {
        this.snsService.purgeTopic(topicArn).subscribe(() => {
            this.loadTopics();
            this.snackBar.open('SNS topic purged, topicArn: ' + topicArn, 'Done', {duration: 5000});
        });
    }

    deleteTopic(topicArn: string) {
        this.snsService.deleteTopic(topicArn).subscribe(() => {
            this.loadTopics();
            this.snackBar.open('SNS topic deleted, topicArn: ' + topicArn, 'Done', {duration: 5000})
        });
    }
}
