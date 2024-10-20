import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
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
import {MatIconButton} from "@angular/material/button";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort, MatSortHeader, Sort} from "@angular/material/sort";
import {MatTooltip} from "@angular/material/tooltip";
import {interval, Subscription} from "rxjs";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {TopicItem} from "../model/topic-item";
import {TopicAddComponentDialog} from "../topic-add/topic-add.component";
import {Router, RouterLink} from "@angular/router";
import {BreadcrumbComponent} from "../../../../shared/breadcrump/breadcrump.component";
import {SnsService} from "../../../../services/sns-service.component";
import {NavigationService} from "../../../../services/navigation.service";
import {PublishMessageComponentDialog} from "../publish-message/publish-message.component";
import {MatListItem, MatNavList} from "@angular/material/list";
import {DatePipe, NgIf} from "@angular/common";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {AwsMockHttpService} from "../../../../services/awsmock-http.service";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
    selector: 'app-home',
    templateUrl: './topic-list.component.html',
    standalone: true,
    imports: [
        MatCard,
        MatCardActions,
        MatCardContent,
        MatCardHeader,
        MatCardSubtitle,
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
        BreadcrumbComponent,
        RouterLink,
        MatNavList,
        MatListItem,
        DatePipe,
        MatFormField,
        MatInput,
        MatLabel,
        MatSuffix,
        NgIf,
        ReactiveFormsModule,
        FormsModule
    ],
    styleUrls: ['./topic-list.component.scss'],
    providers: [SnsService, AwsMockHttpService]
})
export class TopicListComponent implements OnInit, OnDestroy {

    lastUpdate: Date | undefined;

    // Table
    topicData: TopicItem[] = [];
    topicDataSource = new MatTableDataSource(this.topicData);
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

    constructor(private router: Router, private dialog: MatDialog, private snsService: SnsService,
                private navigation: NavigationService, private awsmockService: AwsMockHttpService) {
    }

    ngOnInit(): void {
        this.loadTopics();
        this.updateSubscription = interval(60000).subscribe(() => this.loadTopics());
    }

    ngOnDestroy(): void {
        this.updateSubscription?.unsubscribe();
    }

    back() {
        this.navigation.back();
    }

    refresh() {
        this.loadTopics();
    }

    setPrefix() {
        this.prefixSet = true;
        this.pageIndex = 0;
        this.loadTopics();
    }

    unsetPrefix() {
        this.prefix = '';
        this.prefixSet = false;
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
        this.sortColumns = [];
        let column = 'topicName';
        if (sortState.active === 'topicName') {
            column = 'attributes.approximateNumberOfMessagesNotVisible'
        }
        if (sortState.direction === 'asc') {
            this.sortColumns.push({column: column, sortDirection: 1});
        } else {
            this.sortColumns.push({column: column, sortDirection: -1});
        }
        this.loadTopics();
    }

    loadTopics() {
        this.topicData = [];
        this.awsmockService.listTopicCounters(this.prefix, this.pageIndex, this.pageSize, this.sortColumns)
            .subscribe((data: any) => {
                this.lastUpdate = new Date();
                this.length = data.Total;
                data.TopicCounters.forEach((t: any) => {
                    this.topicData.push({
                        topicUrl: t.topicUrl,
                        topicArn: t.topicArn,
                        topicName: t.topicName,
                        availableMessages: t.availableMessages,
                        created: t.created,
                        modified: t.modified
                    });
                    this.topicDataSource.data = this.topicData;
                });
            });
    }

    addTopic() {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        this.dialog.open(TopicAddComponentDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.saveTopic(result)
                this.loadTopics();
            }
        });
    }

    saveTopic(name: string) {
        this.snsService.saveTopic(name)
            .then(() => {
                this.loadTopics();
            })
            .catch((error: any) => console.error(error))
            .finally(() => {
                this.snsService.cleanup();
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
        this.snsService.saveTopic(topicArn)
            .then(() => {
                this.loadTopics();
            })
            .catch((error: any) => console.error(error))
            .finally(() => {
                this.snsService.cleanup();
            });
    }

    listMessages(topicArn: string) {
        this.router.navigate(['/sns-message-list', encodeURI(topicArn)]);
    }

}
