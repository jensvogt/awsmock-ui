import {Component, inject, OnInit} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader} from "@angular/material/card";
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
    MatTableDataSource
} from "@angular/material/table";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort, MatSortHeader, Sort} from "@angular/material/sort";
import {MatTooltip} from "@angular/material/tooltip";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AwsMockHttpService} from "../../../../services/awsmock-http.service";
import {interval, Subscription} from "rxjs";
import {NavigationService} from "../../../../services/navigation.service";
import {SnsMessageItem} from "../model/sns-message-item";
import {PublishMessageComponentDialog} from "../publish-message/publish-message.component";
import {MatListItem, MatNavList} from "@angular/material/list";
import {EditSNSMessageComponentDialog} from "./edit-message/edit-message.component";
import {SqsMessageItem} from "../../sqs/model/sqs-message-item";
import {DatePipe} from "@angular/common";

@Component({
    selector: 'app-home',
    templateUrl: './sns-message-list.component.html',
    standalone: true,
    imports: [
        MatCard,
        MatCardActions,
        MatCardContent,
        MatCardHeader,
        MatCell,
        MatCellDef,
        MatColumnDef,
        MatHeaderCell,
        MatHeaderRow,
        MatHeaderRowDef,
        MatIcon,
        MatIconButton,
        MatPaginator,
        MatRow,
        MatRowDef,
        MatSort,
        MatSortHeader,
        MatTable,
        MatTooltip,
        MatNoDataRow,
        MatHeaderCellDef,
        MatListItem,
        MatNavList,
        RouterLink,
        DatePipe
    ],
    styleUrls: ['./sns-message-list.component.scss'],
    providers: [AwsMockHttpService]
})
export class SnsMessageListComponent implements OnInit {
    lastUpdate: string = '';

    // Table
    messageData: Array<SnsMessageItem> = [];
    messageDataSource = new MatTableDataSource(this.messageData);
    columns: any[] = ['messageId', 'region', 'created', 'modified', 'actions'];

    // Paging
    length = 0;
    pageSize = 10;
    pageIndex = 0;
    pageSizeOptions = [5, 10, 20, 50, 100];
    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;
    pageEvent: PageEvent = {length: 0, pageIndex: 0, pageSize: 0};

    // Auto-update
    updateSubscription: Subscription | undefined;

    topicArn: string = '';
    topicName: string = '';
    private sub: any;

    // Sorting
    private _liveAnnouncer = inject(LiveAnnouncer);

    constructor(private snackBar: MatSnackBar, private route: ActivatedRoute,
                private navigation: NavigationService, private dialog: MatDialog, private awsmockHttpService: AwsMockHttpService) {
    }

    ngOnInit(): void {
        this.sub = this.route.params.subscribe(params => {
            this.topicArn = decodeURI(params['topicArn']); // (+) converts string 'id' to a number
        });
        this.updateSubscription = interval(60000).subscribe(() => this.loadMessages());
        this.topicName = this.topicArn.substring(this.topicArn.lastIndexOf(':'));
        this.loadMessages();
    }

    back() {
        this.navigation.back();
    }

    refresh() {
        this.loadMessages();
    }

    sortChange(sortState: Sort) {
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
    }

    handlePageEvent(e: PageEvent) {
        this.pageEvent = e;
        this.length = e.length;
        this.pageSize = e.pageSize;
        this.pageIndex = e.pageIndex;
        this.loadMessages();
    }

    loadMessages() {
        this.messageData = [];
        this.awsmockHttpService.listSnsMessages(this.topicArn, this.pageSize, this.pageIndex)
            .subscribe((data: any) => {
                this.lastUpdate = new Date().toLocaleTimeString('DE-de');
                this.length = data.total;
                data.messages.forEach((m: any) => {
                    this.messageData.push({
                        id: m.id,
                        region: m.region,
                        topicArn: m.topicArn,
                        messageId: m.messageId,
                        message: m.message,
                        created: m.created,
                        modified: m.modified,
                    });
                });
                this.messageDataSource.data = this.messageData;
            });
    }

    editMessage(message: SqsMessageItem) {

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
        this.awsmockHttpService.deleteSnsMessages(messageId)
            .subscribe((data: any) => {
                this.loadMessages();
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

        this.dialog.open(PublishMessageComponentDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                //this.snsService.publishMessage(this.topicArn, result);
                this.loadMessages();
            }
        });
    }
}
