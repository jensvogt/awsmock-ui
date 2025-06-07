import {Component, inject, OnDestroy, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {MatTableDataSource,} from "@angular/material/table";
import {ActivatedRoute} from "@angular/router";
import {Sort} from "@angular/material/sort";
import {PageEvent} from "@angular/material/paginator";
import {LambdaConfiguration, QueueConfiguration, S3BucketItem, TopicConfiguration} from "../model/s3-bucket-item";
import {byteConversion} from "../../../shared/byte-utils.component";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {S3Service} from "../service/s3-service.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {BucketNotificationEditDialog} from "../bucket-notification-edit/bucket-notification-edit.component";

@Component({
    selector: 'bucket-detail-component',
    templateUrl: './bucket-detail.component.html',
    styleUrls: ['./bucket-detail.component.scss'],
    standalone: false,
    providers: [S3Service]
})
export class S3BucketDetailComponent implements OnInit, OnDestroy {
    lastUpdate: Date = new Date();

    bucketItem = {} as S3BucketItem;
    bucketName: string = '';

    // Lambda notification Table
    lambdaNotificationColumns: any[] = ['id', 'lambdaArn', 'actions'];
    lambdaNotificationData: LambdaConfiguration[] = [];
    lambdaNotificationDataSource = new MatTableDataSource(this.lambdaNotificationData);
    lambdaNotificationPageSize = 10;
    lambdaNotificationPageIndex = 0;
    lambdaNotificationLength = 0;
    lambdaNotificationPageSizeOptions = [5, 10, 20, 50, 100];

    // Queue notification Table
    queueNotificationColumns: any[] = ['id', 'queue', 'actions'];
    queueNotificationData: QueueConfiguration[] = [];
    queueNotificationDataSource = new MatTableDataSource(this.queueNotificationData);
    queueNotificationPageSize = 10;
    queueNotificationPageIndex = 0;
    queueNotificationLength = 0;
    queueNotificationPageSizeOptions = [5, 10, 20, 50, 100];

    // Topic notification Table
    topicNotificationColumns: any[] = ['id', 'topic', 'actions'];
    topicNotificationData: TopicConfiguration[] = [];
    topicNotificationDataSource = new MatTableDataSource(this.topicNotificationData);
    topicNotificationPageSize = 10;
    topicNotificationPageIndex = 0;
    topicNotificationLength = 0;
    topicNotificationPageSizeOptions = [5, 10, 20, 50, 100];

    //
    protected readonly byteConversion = byteConversion;
    private sub: any;
    // Sorting
    private readonly _liveAnnouncer = inject(LiveAnnouncer);

    constructor(private readonly location: Location, private readonly route: ActivatedRoute, private readonly s3Service: S3Service, private readonly dialog: MatDialog) {
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.bucketName = params['bucketName'];
        });
        this.loadBucket();
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.loadBucket();
    }

    // ===================================================================================================================
    // Details
    // ===================================================================================================================
    loadBucket() {
        this.s3Service.getBucket(this.bucketName)
            .subscribe((data: any) => {
                this.lastUpdate = new Date();
                if (data) {
                    this.bucketItem = data;
                    if (this.bucketItem.lambdaConfigurations) {
                        this.lambdaNotificationData = this.bucketItem.lambdaConfigurations;
                        this.lambdaNotificationDataSource.data = this.lambdaNotificationData;
                    }
                    if (this.bucketItem.queueConfigurations) {
                        this.queueNotificationData = this.bucketItem.queueConfigurations;
                        this.queueNotificationDataSource.data = this.queueNotificationData;
                    }
                    if (this.bucketItem.topicConfigurations) {
                        this.topicNotificationData = this.bucketItem.topicConfigurations;
                        this.topicNotificationDataSource.data = this.topicNotificationData;
                    }
                }
            });
    }

    // ===================================================================================================================
    // Lambda Notifications
    // ===================================================================================================================
    lambdaNotificationSortChange(sortState: Sort) {
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
        this.loadBucket();
    }

    handleLambdaNotificationPageEvent(e: PageEvent) {
        // Intentionally left empty
    }

    editLambdaNotification(lambdaNotificationArn: string) {
        let notification = this.bucketItem.lambdaConfigurations?.filter((ele) => ele.CloudFunction === lambdaNotificationArn);
        if (notification) {
            const dialogConfig = new MatDialogConfig();

            dialogConfig.disableClose = true;
            dialogConfig.autoFocus = true;
            dialogConfig.data = {bucketName: this.bucketItem.bucket, notification: notification};
            dialogConfig.maxWidth = '100vw';
            dialogConfig.maxHeight = '100vh';
            dialogConfig.panelClass = 'full-screen-modal';
            dialogConfig.width = "40%"

            this.dialog.open(BucketNotificationEditDialog, dialogConfig).afterClosed().subscribe(result => {
                if (result) {
                    //console.log("Result Bucket notification: " + result);
                }
            });
        }
    }

    deleteLambdaNotification(lambdaNotificationArn: string) {
        this.bucketItem.lambdaConfigurations = this.bucketItem.lambdaConfigurations?.filter((ele) => ele.CloudFunction !== lambdaNotificationArn);
        if (this.bucketItem.lambdaConfigurations) {
            this.lambdaNotificationData = this.bucketItem.lambdaConfigurations;
            this.lambdaNotificationDataSource.data = this.lambdaNotificationData;
        }
    }

    // ===================================================================================================================
    // Queue Notifications
    // ===================================================================================================================
    queueNotificationSortChange(sortState: Sort) {
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`).then(r => {
            });
        } else {
            this._liveAnnouncer.announce('Sorting cleared').then(r => {
            });
        }
        this.loadBucket();
    }

    handleQueueNotificationPageEvent(e: PageEvent) {
        // Intentionally left empty
    }

    deleteQueueNotification(queueNotificationArn: string) {
        this.bucketItem.queueConfigurations = this.bucketItem.queueConfigurations?.filter((ele) => ele.Queue !== queueNotificationArn);
        if (this.bucketItem.queueConfigurations) {
            this.queueNotificationData = this.bucketItem.queueConfigurations;
            this.queueNotificationDataSource.data = this.queueNotificationData;
        }
    }

    // ===================================================================================================================
    // Topic Notifications
    // ===================================================================================================================
    topicNotificationSortChange(sortState: Sort) {
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
        this.loadBucket();
    }

    handleTopicNotificationPageEvent(e: PageEvent) {
        // Intentionally left empty
    }

    deleteTopicNotification(topicNotificationArn: string) {
        this.bucketItem.topicConfigurations = this.bucketItem.topicConfigurations?.filter((ele) => ele.Topic !== topicNotificationArn);
        if (this.bucketItem.topicConfigurations) {
            this.topicNotificationData = this.bucketItem.topicConfigurations;
            this.topicNotificationDataSource.data = this.topicNotificationData;
        }
    }

    save() {
        this.location.back();
    }
}
