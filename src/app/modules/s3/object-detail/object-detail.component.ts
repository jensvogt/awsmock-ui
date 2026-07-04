import {Component, OnDestroy, OnInit} from "@angular/core";
import {DatePipe, Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {byteConversion} from "../../../shared/byte-utils.component";
import {S3Service} from "../service/s3-service.component";
import {S3ObjectItem} from "../model/s3-object-item";
import {MatDialogRef} from "@angular/material/dialog";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatList, MatListItem} from "@angular/material/list";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";

@Component({
    selector: 's3-object-detail-component',
    templateUrl: './object-detail.component.html',
    styleUrls: ['./object-detail.component.scss'],
    standalone: true,
    imports: [
        DatePipe,
        MatCard,
        MatCardHeader,
        MatCardContent,
        MatCardTitle,
        MatIcon,
        MatIconButton,
        MatList,
        MatListItem,
        MatGridList,
        MatGridTile,
    ],
    providers: [S3Service]
})
export class S3ObjectDetailComponent implements OnInit, OnDestroy {
    lastUpdate: Date = new Date();

    id: string = '';
    objectItem: S3ObjectItem = {} as S3ObjectItem;

    //
    protected readonly byteConversion = byteConversion;
    private sub: any;

    constructor(private readonly dialogRef: MatDialogRef<S3ObjectDetailComponent>, private readonly location: Location, private readonly route: ActivatedRoute, private readonly s3Service: S3Service) {
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
        });
        this.dialogRef.keydownEvents().subscribe(event => {
            if (event.key === "Escape") {
                this.dialogRef.close(false);
            }
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
