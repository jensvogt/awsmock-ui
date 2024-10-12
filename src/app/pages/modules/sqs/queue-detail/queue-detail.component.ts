import {MatDialogActions, MatDialogClose} from "@angular/material/dialog";
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
    MatTextColumn
} from "@angular/material/table";
import {MatInput} from "@angular/material/input";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatList, MatListItem, MatListItemLine, MatListItemTitle} from "@angular/material/list";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {MatTooltip} from "@angular/material/tooltip";
import {MatPaginator} from "@angular/material/paginator";
import {BreadcrumbComponent} from "../../../../shared/breadcrump/breadcrump.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SqsService} from "../../../../services/sqs-service.component";
import {NavigationService} from "../../../../services/navigation.service";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";

@Component({
    selector: 'queue-detail-connection',
    templateUrl: './queue-detail.component.html',
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
        RouterLink,
        MatDialogActions,
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
        MatListItemTitle
    ],
    styleUrls: ['./queue-detail.component.scss'],
    providers: [SqsService]
})
export class QueueDetailComponent implements OnInit, OnDestroy {
    lastUpdate: string = new Date().toLocaleTimeString('DE-de');

    queueName: string = '';
    queueUrl: string = '';
    queueArn: string = '';
    messagedAvailable: number = 0;
    messagedInFlight: number = 0;
    messagedDelayed: number = 0;
    queueDelay: number = 0;
    visibilityTimeout: number = 0;
    private sub: any;

    constructor(private snackBar: MatSnackBar, private sqsService: SqsService, private router: Router, private route: ActivatedRoute,
                private navigation: NavigationService) {
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.queueArn = params['queueArn']; // (+) converts string 'id' to a number
            this.queueName = this.queueArn.substring(this.queueArn.lastIndexOf(':') + 1);
            this.sqsService.getQueueUrl(this.queueName).then((data: any) => {
                this.queueUrl = data.QueueUrl;
                this.getQueueAttributes(this.queueUrl);
            });
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    refresh() {
        this.getQueueAttributes(this.queueUrl);
    }

    back() {
        this.navigation.back();
    }

    // ===================================================================================================================
    // Details
    // ===================================================================================================================
    save() {
    }

    close() {
        this.router.navigate(['/sqs-queue-list']);
    }

    // ===================================================================================================================
    // Attributes
    // ===================================================================================================================
    getQueueAttributes(queueUrl: string) {
        this.sqsService.getQueueAttributes(queueUrl)
            .then((data: any) => {
                this.lastUpdate = new Date().toLocaleTimeString('DE-de');
                this.messagedAvailable = data.Attributes.ApproximateNumberOfMessages;
                this.messagedInFlight = data.Attributes.ApproximateNumberOfMessagesNotVisible;
                this.messagedDelayed = data.Attributes.ApproximateNumberOfMessagesDelayed;
                this.queueDelay = data.Attributes.DelaySeconds;
                this.visibilityTimeout = data.Attributes.VisibilityTimeout;
            })
            .catch((error: any) => console.error(error))
            .finally(() => {
                this.sqsService.cleanup();
            });
    }
}
