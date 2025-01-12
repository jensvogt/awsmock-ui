import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {Sort} from "@angular/material/sort";
import {SnsSubscriptionCountersResponse} from "../model/sns-subscription-item";
import {PageEvent} from "@angular/material/paginator";
import {SubscriptionAddComponentDialog} from "./subscription-add/subscription-add.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnsTopicDetails} from "../model/sns-topic-details";
import {SnsService} from "../service/sns-service.component";
import {State, Store} from "@ngrx/store";
import {snsTopicDetailsActions} from "./state/sns-topic-detail.actions";
import {Observable} from "rxjs";
import {selectDetails, selectError, selectSubscriptionPageIndex, selectSubscriptionPageSize, selectSubscriptions} from "./state/sns-topic-detail.selectors";
import {SnsTopicDetailsState} from "./state/sns-topic-detail.reducer";

@Component({
    selector: 'sns-topic-detail-component',
    templateUrl: './topic-detail.component.html',
    styleUrls: ['./topic-detail.component.scss'],
    standalone: false,
    providers: [SnsService]
})
export class SnsTopicDetailComponent implements OnInit, OnDestroy {

    // Last update
    lastUpdate: Date = new Date();

    topicArn: string = '';
    topicName: string = '';
    topicDetails$: Observable<SnsTopicDetails> = this.store.select(selectDetails);
    topicDetailsError$: Observable<string> = this.store.select(selectError);

    // Subscription Table
    topicSubscriptions$: Observable<SnsSubscriptionCountersResponse> = this.store.select(selectSubscriptions);
    subscriptionPageSize$: Observable<number> = this.store.select(selectSubscriptionPageSize);
    subscriptionPageIndex$: Observable<number> = this.store.select(selectSubscriptionPageIndex);
    subscriptionColumns: any[] = ['id', 'endpoint', 'protocol', 'owner', 'actions'];
    subscriptionPageSizeOptions = [5, 10, 20, 50, 100];

    private sub: any;

    constructor(private snackBar: MatSnackBar, private snsService: SnsService, private route: ActivatedRoute, private dialog: MatDialog,
                private location: Location, private store: Store, private state: State<SnsTopicDetailsState>) {
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.topicArn = params['topicArn'];
            this.topicName = this.topicArn.substring(this.topicArn.lastIndexOf(":"));
            this.loadTopicDetails();
            this.loadSubscriptions();
        });
        this.topicDetailsError$.subscribe((msg: string) => {
            if (msg && msg.length) {
                this.snackBar.open("ErrorMessage: " + msg.toString())
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.loadTopicDetails();
        this.loadSubscriptions();
    }

    // ===================================================================================================================
    // Details
    // ===================================================================================================================
    loadTopicDetails() {
        this.store.dispatch(snsTopicDetailsActions.loadDetails({topicArn: this.topicArn}));
    }

    save() {
    }

    close() {
        this.location.back();
    }

    // ===================================================================================================================
    // Subscriptions
    // ===================================================================================================================
    handleSubscriptionPageEvent(e: PageEvent) {
        this.state.value['sns-topic-details'].subscriptionPageSize = e.pageSize;
        this.state.value['sns-topic-details'].subscriptionPageIndex = e.pageIndex;
        this.loadSubscriptions();
    }

    loadSubscriptions() {
        this.store.dispatch(snsTopicDetailsActions.loadSubscriptions({
            topicArn: this.topicArn,
            pageSize: this.state.value['sns-topic-details'].subscriptionPageSize,
            pageIndex: this.state.value['sns-topic-details'].subscriptionPageIndex,
            sortColumns: this.state.value['sns-topic-details'].sortColumns
        }));
    }

    subscriptionSortChange(sortState: Sort) {
        this.state.value['sns-topic-details'].sortColumns = [];
        let column = sortState.active;
        let direction = sortState.direction === 'asc' ? 1 : -1;
        this.state.value['sns-topic-details'].sortColumns = [{column: column, sortDirection: direction}];
        this.loadSubscriptions();
    }

    refreshSubscriptions() {
        this.loadSubscriptions();
    }

    unsubscribe(subscriptionArn: string) {
        /*this.subscriptionData = [];
        const input = {
            SubscriptionArn: subscriptionArn,
        };*/
        /* this.client.send(new UnsubscribeCommand(input))
             .then(() => this.loadSubscriptions())
             .catch((error: any) => console.error(error))
             .finally(() => {
                 this.client.destroy();
             });*/
    }

    editSubscription(topicArn: string) {
    }

    addSubscription() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {topicArn: this.topicArn, topicName: this.topicName};

        this.dialog.open(SubscriptionAddComponentDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.subscribe(result)
            }
        });
    }

    subscribe(subscription: any) {
        this.snsService.subscribe(subscription.topicArn, subscription.endpoint, subscription.protocol)
            .subscribe((data: any) => {
                this.loadSubscriptions();
                this.snackBar.open('SNA subscription added, subscription ARN:' + data.SubscriptionArn, 'Dismiss', {duration: 5000});
            })
    }
}
