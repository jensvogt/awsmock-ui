import {Component, inject, OnDestroy, OnInit} from "@angular/core";
import {MatTableDataSource,} from "@angular/material/table";
import {ActivatedRoute} from "@angular/router";
import {Sort} from "@angular/material/sort";
import {PageEvent} from "@angular/material/paginator";
import {NavigationService} from "../../../services/navigation.service";
import {LambdaConfiguration, S3BucketItem} from "../model/s3-bucket-item";
import {byteConversion} from "../../../shared/byte-utils.component";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {S3Service} from "../service/s3-service.component";

@Component({
    selector: 'bucket-detail-component',
    templateUrl: './bucket-detail.component.html',
    styleUrls: ['./bucket-detail.component.scss'],
    providers: [S3Service]
})
export class S3BucketDetailComponent implements OnInit, OnDestroy {
    lastUpdate: string = '';

    bucketItem = {} as S3BucketItem;
    bucketName: string = '';

    // Subscription Table
    lambdaNotificationColumns: any[] = ['id', 'lambdaArn', 'actions'];
    lambdaNotificationData: LambdaConfiguration[] = [];
    lambdaNotificationDataSource = new MatTableDataSource(this.lambdaNotificationData);
    lambdaNotificationPageSize = 10;
    lambdaNotificationPageIndex = 0;
    lambdaNotificationLength = 0;
    lambdaNotificationPageSizeOptions = [5, 10, 20, 50, 100];

    //
    protected readonly byteConversion = byteConversion;
    private sub: any;

    // Sorting
    private _liveAnnouncer = inject(LiveAnnouncer);

    constructor(private navigation: NavigationService, private route: ActivatedRoute, private s3Service: S3Service) {
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.bucketName = params['bucketName']; // (+) converts string 'id' to a number
        });
        this.loadBucket();
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    back() {
        this.navigation.back();
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
                    if (this.bucketItem.lambdaConfigurations) {
                        this.lambdaNotificationData = this.bucketItem.lambdaConfigurations;
                        this.lambdaNotificationDataSource.data = this.lambdaNotificationData;
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
        this.bucketItem.lambdaConfigurations = this.bucketItem.lambdaConfigurations?.filter((ele) => ele.lambdaArn !== lambdaNotificationArn);
        if (this.bucketItem.lambdaConfigurations) {
            this.lambdaNotificationData = this.bucketItem.lambdaConfigurations;
            this.lambdaNotificationDataSource.data = this.lambdaNotificationData;
        }
    }

    // ===================================================================================================================
    // Queue Notifications
    // ===================================================================================================================

    // ===================================================================================================================
    // Topic Notifications
    // ===================================================================================================================

    save() {
        this.navigation.back();
    }
}
