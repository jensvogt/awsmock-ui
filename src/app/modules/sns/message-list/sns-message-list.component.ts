import {Component, inject, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {PageEvent} from "@angular/material/paginator";
import {Sort} from "@angular/material/sort";
import {Location} from "@angular/common";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {ActivatedRoute} from "@angular/router";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {interval, Subscription} from "rxjs";
import {SnsMessageItem} from "../model/sns-message-item";
import {PublishMessageComponentDialog} from "../publish-message/publish-message.component";
import {EditSNSMessageComponentDialog} from "./edit-message/edit-message.component";
import {SqsMessageItem} from "../../sqs/model/sqs-message-item";
import {SnsService} from "../service/sns-service.component";

@Component({
    selector: 'app-home',
    templateUrl: './sns-message-list.component.html',
    styleUrls: ['./sns-message-list.component.scss'],
    providers: [SnsService]
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

    constructor(private route: ActivatedRoute, private location: Location, private dialog: MatDialog, private snsService: SnsService) {
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
        this.location.back();
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
        this.snsService.listSnsMessages(this.topicArn, this.pageSize, this.pageIndex)
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
        this.snsService.deleteSnsMessages(messageId)
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
                this.snsService.publishMessage(this.topicArn, result);
                this.loadMessages();
            }
        });
    }
}
