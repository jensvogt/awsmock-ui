import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {TopicItem} from "../model/topic-item";
import {TopicAddComponentDialog} from "../topic-add/topic-add.component";
import {Router, RouterLink} from "@angular/router";
import {BreadcrumbComponent} from "../../../../shared/breadcrump/breadcrump.component";
import {SnsService} from "../../../../services/sns-service.component";
import {NavigationService} from "../../../../services/navigation.service";

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
        RouterLink
    ],
    styleUrls: ['./topic-list.component.scss'],
    providers: [SnsService]
})
export class TopicListComponent implements OnInit, OnDestroy {

    lastUpdate: Date | undefined;

    // Table
    topicData: TopicItem[] = [];
    topicDataSource = new MatTableDataSource(this.topicData);
    columns: any[] = ['topicName', 'actions'];

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
    nextToken: string | undefined = '';
    pageEvent: PageEvent = {length: 0, pageIndex: 0, pageSize: 0};

    // Sorting
    private _liveAnnouncer = inject(LiveAnnouncer);

    constructor(private router: Router, private dialog: MatDialog, private snsService: SnsService,
                private navigation: NavigationService) {
    }

    // @ts-ignore
    @ViewChild(MatSort) set matSort(sort: MatSort) {
        this.topicDataSource.sort = sort;
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

    lastUpdateTime() {
        return new Date().toLocaleTimeString('DE-de');
    }

    refresh() {
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
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
    }

    loadTopics() {
        this.topicData = [];
        this.snsService.listTopics(this.pageIndex, this.pageSize)
            .then((data: any) => {
                this.lastUpdate = new Date();
                this.nextToken = data.NextToken;
                this.length = data.NextToken;
                data.Topics.forEach((q: any) => {
                    this.topicData.push({
                        topicArn: q.TopicArn,
                        topicName: q.TopicArn.substring(q.TopicArn.lastIndexOf(':') + 1)
                    });
                });
                this.topicDataSource.data = this.topicData;
            })
            .catch((error: any) => console.error(error))
            .finally(() => {
                this.snsService.cleanup();
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

    editTopic(topicArn: string) {
        this.router.navigate(['/sns-topic-detail', topicArn]);
    }

    publishMessage(topicArn: string) {

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
