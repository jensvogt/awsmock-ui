import {MatDialog, MatDialogClose, MatDialogConfig} from "@angular/material/dialog";
import {Component, OnDestroy, OnInit} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
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
    MatTableDataSource,
    MatTextColumn
} from "@angular/material/table";
import {MatInput} from "@angular/material/input";
import {ActivatedRoute, Router} from "@angular/router";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatList, MatListItem, MatListItemLine, MatListItemTitle} from "@angular/material/list";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {MatSort, MatSortHeader, Sort} from "@angular/material/sort";
import {MatTooltip} from "@angular/material/tooltip";
import {ListSubscriptionsByTopicCommand, SNSClient, UnsubscribeCommand} from "@aws-sdk/client-sns";
import {SubscriptionItem} from "../model/subscription-item";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {BreadcrumbComponent} from "../../../../shared/breadcrump/breadcrump.component";
import {environment} from "../../../../../environments/environment";
import {SubscriptionAddComponentDialog} from "./subscription-add/subscription-add.component";
import {SnsService} from "../../../../services/sns-service.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NavigationService} from "../../../../services/navigation.service";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {DatePipe} from "@angular/common";
import {AwsMockHttpService} from "../../../../services/awsmock-http.service";
import {TopicDetails} from "../model/topic-details";

@Component({
    selector: 'add-connection-dialog',
    templateUrl: './topic-detail.component.html',
    standalone: true,
    imports: [
        MatButton,
        MatDialogClose,
        MatFormField,
        MatSelect,
        MatOption,
        MatLabel,
        FormsModule,
        MatTextColumn,
        MatInput,
        ReactiveFormsModule,
        MatCard,
        MatCardActions,
        MatCardContent,
        MatCardHeader,
        MatCardTitle,
        MatIcon,
        MatList,
        MatListItem,
        MatTab,
        MatTabGroup,
        MatCell,
        MatCellDef,
        MatColumnDef,
        MatHeaderCell,
        MatHeaderRow,
        MatHeaderRowDef,
        MatIconButton,
        MatRow,
        MatRowDef,
        MatSort,
        MatSortHeader,
        MatTable,
        MatTooltip,
        MatNoDataRow,
        MatHeaderCellDef,
        MatPaginator,
        BreadcrumbComponent,
        MatGridList,
        MatGridTile,
        MatListItemLine,
        MatListItemTitle,
        DatePipe
    ],
    styleUrls: ['./topic-detail.component.scss'],
    providers: [SnsService, AwsMockHttpService]
})
export class TopicDetailComponent implements OnInit, OnDestroy {
    lastUpdate: Date = new Date();

    topicArn: string = '';
    topicDetails = {} as TopicDetails;

    // Subscription Table
    subscriptionData: Array<SubscriptionItem> = [];
    subscriptionDataSource = new MatTableDataSource(this.subscriptionData);
    columns: any[] = ['id', 'endpoint', 'protocol', 'owner', 'actions'];
    subscriptionPageSize = 10;
    subscriptionPageIndex = 0;
    subscriptionLength = 0;
    subscriptionPageSizeOptions = [5, 10, 20, 50, 100];

    // Aws client
    client = new SNSClient({
        region: environment.awsmockRegion,
        endpoint: environment.gatewayEndpoint,
        credentials: {
            accessKeyId: 'test',
            secretAccessKey: 'test',
        },
        requestHandler: {
            requestTimeout: 3_000,
            httpsAgent: {maxSockets: 25},
        },
    });
    private sub: any;

    constructor(private snackBar: MatSnackBar, private snsService: SnsService, private router: Router, private route: ActivatedRoute, private dialog: MatDialog,
                private navigation: NavigationService, private awsmockService: AwsMockHttpService) {
    }

    ngOnInit() {

        this.sub = this.route.params.subscribe(params => {
            this.topicArn = params['topicArn']; // (+) converts string 'id' to a number
            this.loadTopicDetails();
            this.loadSubscriptions();
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    back() {
        this.navigation.back();
    }

    refresh() {
        this.loadTopicDetails();
        this.loadSubscriptions();
    }

    // ===================================================================================================================
    // Details
    // ===================================================================================================================
    loadTopicDetails() {
        this.awsmockService.getTopicDetails(this.topicArn).subscribe((data) => {
            if (data) {
                // @ts-ignore
                this.topicDetails = data;
                console.log(this.topicDetails);
            }
        });
    }

    save() {
    }

    close() {
        this.router.navigate(['/sns-topic-list']);
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
        this.client.send(new ListSubscriptionsByTopicCommand(input))
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
            });
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
        this.client.send(new UnsubscribeCommand(input))
            .then(() => this.loadSubscriptions())
            .catch((error: any) => console.error(error))
            .finally(() => {
                this.client.destroy();
            });
    }

    editSubscription(topicArn: string) {
    }

    addSubscription() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {topicArn: this.topicArn, topicName: this.topicDetails.topicName};

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
                this.client.destroy();
            });
    }
}
