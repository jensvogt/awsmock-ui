import {Component, OnDestroy, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {S3BucketItem} from "../model/s3-bucket-item";
import {byteConversion} from "../../../shared/byte-utils.component";
import {S3Service} from "../service/s3-service.component";
import {S3ObjectItem} from "../model/s3-object-item";

@Component({
    selector: 's3-object-detail-component',
    templateUrl: './object-detail.component.html',
    styleUrls: ['./object-detail.component.scss'],
    standalone: false,
    providers: [S3Service]
})
export class S3ObjectDetailComponent implements OnInit, OnDestroy {
    lastUpdate: Date = new Date();

    bucketItem = {} as S3BucketItem;
    id: string = '';
    objectItem: S3ObjectItem = {} as S3ObjectItem;

    //
    protected readonly byteConversion = byteConversion;
    private sub: any;

    constructor(private location: Location, private route: ActivatedRoute, private s3Service: S3Service) {
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
        });
        this.loadObject();
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.loadObject();
    }

    lastUpdateTime() {
        return new Date().toLocaleTimeString('DE-de');
    }

    // ===================================================================================================================
    // Details
    // ===================================================================================================================
    loadObject() {
        this.s3Service.getObjectCounter(this.id)
            .subscribe((data: any) => {
                this.lastUpdate = new Date();
                if (data) {
                    this.objectItem = data.objectCounter;
                }
            });
    }
}
