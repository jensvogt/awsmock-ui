import {Component, OnDestroy, OnInit} from '@angular/core';
import {PageEvent} from "@angular/material/paginator";
import {Location} from "@angular/common";
import {Sort} from "@angular/material/sort";
import {filter, interval, Observable, Subscription} from "rxjs";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ListTopicCountersResponse} from "../model/sns-topic-item";
import {TopicAddComponentDialog} from "../topic-add/topic-add.component";
import {Router} from "@angular/router";
import {SnsService} from "../service/sns-service.component";
import {PublishMessageComponentDialog} from "../publish-message/publish-message.component";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {ActionsSubject, State, Store} from "@ngrx/store";
import {snsTopicListActions} from "./state/sns-topic-list.actions";
import {selectPageIndex, selectPageSize, selectTopicCounters} from "./state/sns-topic-list.selectors";
import {SNSTopicListState} from "./state/sns-topic-list.reducer";

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
    listTopicCountersResponse$: Observable<ListTopicCountersResponse> = this.store.select(selectTopicCounters);
    columns: any[] = ['topicName', 'availableMessages', 'created', 'modified', 'actions'];

    // Auto-update
    updateSubscription: Subscription | undefined;

    // Paging
    length: number | undefined = 0;
    pageSize = 10;
    pageIndex = 0;
    pageSizeOptions = [5, 10, 20, 50, 100];
    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;
    pageEvent: PageEvent = {length: 0, pageIndex: 0, pageSize: 0};

    // Prefix
    prefixSet: boolean = false;
    prefix: string = '';

    // Sorting, default available
    sortColumns: SortColumn[] = [{column: 'name', sortDirection: -1}];

    constructor(private router: Router, private dialog: MatDialog, private snsService: SnsService, private location: Location, private state: State<SNSTopicListState>,
                private store: Store, private actionsSubj$: ActionsSubject) {
        this.actionsSubj$.pipe(
            filter((action) =>
                action.type === snsTopicListActions.addTopicSuccess.type ||
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
        this.pageEvent = e;
        this.length = e.length;
        this.pageSize = e.pageSize;
        this.pageIndex = e.pageIndex;
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
                this.snsService.publishMessage(topicArn, result);
                this.loadTopics();
            }
        });
    }

    deleteTopic(topicArn: string) {
        this.snsService.deleteTopic(topicArn)
            .then(() => {
                this.loadTopics();
            })
            .catch((error: any) => console.error(error))
            .finally(() => {
                this.snsService.cleanup();
            });
    }

    listMessages(topicArn: string) {
        this.router.navigate(['./messages', encodeURI(topicArn)]);
    }

}
