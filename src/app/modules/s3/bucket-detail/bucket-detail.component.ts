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

@Component({
    selector: 'bucket-detail-component',
    templateUrl: './bucket-detail.component.html',
    styleUrls: ['./bucket-detail.component.scss'],
    standalone: false,
    providers: [S3Service]
})
export class S3BucketDetailComponent implements OnInit, OnDestroy {
    lastUpdate: string = '';

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
    topicNotificationColumns: any[] = ['id', 'topicArn', 'actions'];
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
    private _liveAnnouncer = inject(LiveAnnouncer);

    constructor(private location: Location, private route: ActivatedRoute, private s3Service: S3Service) {
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

    lastUpdateTime() {
        return new Date().toLocaleTimeString('DE-de');
    }

    // ===================================================================================================================
    // Details
    // ===================================================================================================================
    loadBucket() {
        this.s3Service.getBucket(this.bucketName)
            .subscribe((data: any) => {
                this.lastUpdate = this.lastUpdateTime();
                if (data) {
                    this.bucketItem = data;
                    console.log("Data: ", data);
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
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
        this.loadBucket();
    }

    handleQueueNotificationPageEvent(e: PageEvent) {

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
