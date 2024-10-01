import {MatDialogActions, MatDialogClose} from "@angular/material/dialog";
import {Component, inject, OnDestroy, OnInit} from "@angular/core";
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
    MatTableDataSource,
    MatTextColumn
} from "@angular/material/table";
import {MatInput} from "@angular/material/input";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatList, MatListItem} from "@angular/material/list";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {MatSort, MatSortHeader, Sort} from "@angular/material/sort";
import {MatTooltip} from "@angular/material/tooltip";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {BreadcrumbComponent} from "../../../../shared/breadcrump/breadcrump.component";
import {SnsService} from "../../../../services/sns-service.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NavigationService} from "../../../../services/navigation.service";
import {BucketItem, LambdaConfiguration} from "../model/bucket-item";
import {AwsMockHttpService} from "../../../../services/awsmock-http.service";
import {MatLine} from "@angular/material/core";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {byteConversion} from "../../../../shared/byte-utils.component";
import {LiveAnnouncer} from "@angular/cdk/a11y";

@Component({
    selector: 'add-connection-dialog',
    templateUrl: './bucket-detail.component.html',
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
        MatLine,
        MatGridList,
        MatGridTile
    ],
    styleUrls: ['./bucket-detail.component.scss'],
    providers: [SnsService, AwsMockHttpService]
})
export class BucketDetailComponent implements OnInit, OnDestroy {
    lastUpdate: string = '';

    bucketItem = {} as BucketItem;
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

    constructor(private snackBar: MatSnackBar, private navigation: NavigationService, private route: ActivatedRoute,
                private awsmockService: AwsMockHttpService) {
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

    lastUpdateTime() {
        return new Date().toLocaleTimeString('DE-de');
    }

    // ===================================================================================================================
    // Details
    // ===================================================================================================================
    loadBucket() {
        this.awsmockService.getBucket(this.bucketName)
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
