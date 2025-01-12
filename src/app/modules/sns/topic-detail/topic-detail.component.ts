import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {Sort} from "@angular/material/sort";
import {SnsSubscriptionCountersResponse} from "../model/sns-subscription-item";
import {SnsTagCountersResponse} from "../model/sns-tag-item";
import {PageEvent} from "@angular/material/paginator";
import {SubscriptionAddComponentDialog} from "./subscription-add/subscription-add.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnsTopicDetails} from "../model/sns-topic-details";
import {SnsService} from "../service/sns-service.component";
import {State, Store} from "@ngrx/store";
import {snsTopicDetailsActions} from "./state/sns-topic-detail.actions";
import {Observable} from "rxjs";
import {
    selectAttributePageIndex,
    selectAttributePageSize,
    selectAttributes,
    selectDetails,
    selectError,
    selectSubscriptionPageIndex,
    selectSubscriptionPageSize,
    selectSubscriptions,
    selectTagPageIndex,
    selectTagPageSize,
    selectTags
} from "./state/sns-topic-detail.selectors";
import {SnsTopicDetailsState} from "./state/sns-topic-detail.reducer";
import {TagAddComponentDialog} from "./tag-add/tag-add.component";
import {SnsAttributeCountersResponse} from "../model/sns-attribute-item";
import {TagEditComponentDialog} from "./tag-edit/tag-edit.component";
import {SubscriptionEditComponentDialog} from "./subscription-edit/subscription-edit.component";

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

    // Tags Table
    topicTags$: Observable<SnsTagCountersResponse> = this.store.select(selectTags);
    tagPageSize$: Observable<number> = this.store.select(selectTagPageSize);
    tagPageIndex$: Observable<number> = this.store.select(selectTagPageIndex);
    tagColumns: any[] = ['name', 'value', 'actions'];
    tagPageSizeOptions = [5, 10, 20, 50, 100];

    // Attributes Table
    topicAttributes$: Observable<SnsAttributeCountersResponse> = this.store.select(selectAttributes);
    attributePageSize$: Observable<number> = this.store.select(selectAttributePageSize);
    attributePageIndex$: Observable<number> = this.store.select(selectAttributePageIndex);
    attributeColumns: any[] = ['name', 'value'];
    attributePageSizeOptions = [5, 10, 20, 50, 100];

    private routerSubscription: any;

    constructor(private snackBar: MatSnackBar, private snsService: SnsService, private route: ActivatedRoute, private dialog: MatDialog,
                private location: Location, private store: Store, private state: State<SnsTopicDetailsState>) {
    }

    ngOnInit() {
        this.routerSubscription = this.route.params.subscribe(params => {
            this.topicArn = params['topicArn'];
            this.topicName = this.topicArn.substring(this.topicArn.lastIndexOf(":"));
            this.loadTopicDetails();
            this.loadSubscriptions();
            this.loadTags();
            this.loadAttributes();
        });
        this.topicDetailsError$.subscribe((msg: string) => {
            if (msg && msg.length) {
                this.snackBar.open("ErrorMessage: " + msg.toString())
            }
        });
    }

    ngOnDestroy() {
        this.routerSubscription.unsubscribe();
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
        this.lastUpdate = new Date();
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
        this.lastUpdate = new Date();
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
        this.snsService.unsubscribe(subscriptionArn)
            .subscribe(() => {
                this.loadSubscriptions();
                this.snackBar.open('SNS subscription deleted, subscription ARN:' + subscriptionArn, 'Dismiss', {duration: 5000});
            })
    }

    editSubscription(subscriptionArn: string, protocol: string, endpoint: string) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {topicArn: this.topicArn, subscriptionArn: subscriptionArn, protocol: protocol, endpoint: endpoint};

        this.dialog.open(SubscriptionEditComponentDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.snsService.updateSubscription(result.topicArn, result.subscriptionArn, result.endpoint, result.protocol)
                    .subscribe((data: any) => {
                        this.loadSubscriptions();
                        this.snackBar.open('SNS subscription updated, subscription ARN:' + data.SubscriptionArn, 'Dismiss', {duration: 5000});
                    })
            }
        });
    }

    addSubscription() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {topicArn: this.topicArn, topicName: this.topicName};

        this.dialog.open(SubscriptionAddComponentDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.snsService.subscribe(result.topicArn, result.endpoint, result.protocol)
                    .subscribe((data: any) => {
                        this.loadSubscriptions();
                        this.snackBar.open('SNS subscription added, subscription ARN:' + data.SubscriptionArn, 'Dismiss', {duration: 5000});
                    })
            }
        });
    }

    // ===================================================================================================================
    // Tags
    // ===================================================================================================================
    handleTagPageEvent(e: PageEvent) {
        this.state.value['sns-topic-details'].tagPageSize = e.pageSize;
        this.state.value['sns-topic-details'].tagPageIndex = e.pageIndex;
        this.loadTags();
    }

    loadTags() {
        this.store.dispatch(snsTopicDetailsActions.loadTags({
            topicArn: this.topicArn,
            pageSize: this.state.value['sns-topic-details'].tagPageSize,
            pageIndex: this.state.value['sns-topic-details'].tagPageIndex,
            sortColumns: this.state.value['sns-topic-details'].sortColumns
        }));
        this.lastUpdate = new Date();
    }

    tagSortChange(sortState: Sort) {
        this.state.value['sns-topic-details'].sortColumns = [];
        let column = sortState.active;
        let direction = sortState.direction === 'asc' ? 1 : -1;
        this.state.value['sns-topic-details'].sortColumns = [{column: column, sortDirection: direction}];
        this.loadTags();
    }

    refreshTags() {
        this.loadTags();
    }

    deleteTag(name: string) {
        this.snsService.deleteTag(this.topicArn, name)
            .subscribe(() => {
                this.loadTags();
                this.snackBar.open('SNS tag deleted, name: ' + name, 'Dismiss', {duration: 5000});
            })
    }

    editTag(key: string, value: string) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {topicArn: this.topicArn, topicName: this.topicName, key: key, value: value};

        this.dialog.open(TagEditComponentDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                if (result.key !== key || result.value !== value) {
                    this.snsService.addTag(result.topicArn, result.key, result.value)
                        .subscribe(() => {
                            this.loadTags();
                            this.snackBar.open('SNS tag changed, name: ' + result.key, 'Dismiss', {duration: 5000});
                        })
                } else {
                    this.snackBar.open('SNS tag unchanged, name: ' + result.key, 'Dismiss', {duration: 5000});
                }
            }
        });
    }

    addTag() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {topicArn: this.topicArn, topicName: this.topicName};

        this.dialog.open(TagAddComponentDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.snsService.addTag(result.topicArn, result.key, result.value)
                    .subscribe(() => {
                        this.loadTags();
                        this.snackBar.open('SNS tag added, name: ' + result.key, 'Dismiss', {duration: 5000});
                    })
            }
        });
    }

    // ===================================================================================================================
    // Attributes
    // ===================================================================================================================
    handleAttributePageEvent(e: PageEvent) {
        this.state.value['sns-topic-details'].attributePageSize = e.pageSize;
        this.state.value['sns-topic-details'].attributePageIndex = e.pageIndex;
        this.loadAttributes();
    }

    loadAttributes() {
        this.store.dispatch(snsTopicDetailsActions.loadAttributes({
            topicArn: this.topicArn,
            pageSize: this.state.value['sns-topic-details'].attributePageSize,
            pageIndex: this.state.value['sns-topic-details'].attributePageIndex,
            sortColumns: this.state.value['sns-topic-details'].sortColumns
        }));
        this.lastUpdate = new Date();
    }

    attributeSortChange(sortState: Sort) {
        this.state.value['sns-topic-details'].sortColumns = [];
        let column = sortState.active;
        let direction = sortState.direction === 'asc' ? 1 : -1;
        this.state.value['sns-topic-details'].sortColumns = [{column: column, sortDirection: direction}];
        this.loadAttributes();
    }

    refreshAttributes() {
        this.loadAttributes();
    }
}
