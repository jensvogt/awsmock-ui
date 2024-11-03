import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {Component, OnDestroy, OnInit} from "@angular/core";
import {MatTableDataSource,} from "@angular/material/table";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {Sort} from "@angular/material/sort";
import {SnsSubscriptionItem} from "../model/sns-subscription-item";
import {PageEvent} from "@angular/material/paginator";
import {SubscriptionAddComponentDialog} from "./subscription-add/subscription-add.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnsTopicDetails} from "../model/sns-topic-details";
import {SnsService} from "../service/sns-service.component";
import {Store} from "@ngrx/store";
import {snsTopicListActions} from "../topic-list/state/sns-topic-list.actions";
import {snsTopicDetailsActions} from "./state/sns-topic-detail.actions";
import {Observable} from "rxjs";
import {selectDetails, selectError} from "./state/sns-topic-detail.selectors";

@Component({
    selector: 'add-connection-dialog',
    templateUrl: './topic-detail.component.html',
    styleUrls: ['./topic-detail.component.scss'],
    providers: [SnsService]
})
export class SnsTopicDetailComponent implements OnInit, OnDestroy {

    // Last update
    lastUpdate: Date = new Date();

    topicArn: string = '';
    topicDetails$: Observable<SnsTopicDetails> = this.store.select(selectDetails);
    topicDetailsError$: Observable<string> = this.store.select(selectError);

    // Subscription Table
    subscriptionData: Array<SnsSubscriptionItem> = [];
    subscriptionDataSource = new MatTableDataSource(this.subscriptionData);
    columns: any[] = ['id', 'endpoint', 'protocol', 'owner', 'actions'];
    subscriptionPageSize = 10;
    subscriptionPageIndex = 0;
    subscriptionLength = 0;
    subscriptionPageSizeOptions = [5, 10, 20, 50, 100];

    private sub: any;

    constructor(private snackBar: MatSnackBar, private snsService: SnsService, private router: Router, private route: ActivatedRoute, private dialog: MatDialog,
                private location: Location, private store: Store) {
        this.store.dispatch(snsTopicListActions.initialize());
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.topicArn = params['topicArn'];
            this.store.dispatch(snsTopicDetailsActions.loadDetails({topicArn: this.topicArn}));
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

    }

    loadSubscriptions() {
        this.subscriptionData = [];
        const input = {
            TopicArn: this.topicArn,
            NextToken: (this.subscriptionPageIndex * this.subscriptionPageSize).toString(),
        };
        /*this.client.send(new ListSubscriptionsByTopicCommand(input))
            .then((data: any) => {
                this.subscriptionLength = data.NextToken;
                this.lastUpdate = new Date();
                data.Subscriptions.forEach((q: any) => {
                    this.subscriptionData.push({
                        id: q.SubscriptionArn.substring(q.SubscriptionArn.lastIndexOf(':') + 1),
                        endpoint: q.Endpoint,
                        owner: q.Owner,
                        protocol: q.Protocol,
                        subscriptionArn: q.SubscriptionArn
                    });
                });
                this.subscriptionDataSource.data = this.subscriptionData;
            })
            .catch((error: any) => console.error(error))
            .finally(() => {
                this.client.destroy();
            });*/
    }

    subscriptionSortChange(sortState: Sort) {
    }

    refreshSubscriptions() {
        this.loadSubscriptions();
    }

    unsubscribe(subscriptionArn: string) {
        this.subscriptionData = [];
        const input = {
            SubscriptionArn: subscriptionArn,
        };
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
        //dialogConfig.data = {topicArn: this.topicArn, topicName: this.topicDetails$?.topicName};

        this.dialog.open(SubscriptionAddComponentDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.subscribe(result)
            }
        });
    }

    subscribe(subscription: any) {
        this.snsService.subscribe(subscription.topicArn, subscription.endpoint, subscription.protocol)
            .then((data: any) => {
                this.loadSubscriptions();
                this.snackBar.open('Subscription saved, subscription ARN:' + data.SubscriptionArn, 'Dismiss', {duration: 5000});
            })
            .catch((error: any) => console.error(error))
            .finally(() => {
                //this.client.destroy();
            });
    }
}
