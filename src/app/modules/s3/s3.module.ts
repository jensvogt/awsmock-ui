import {NgModule} from '@angular/core';
import {AsyncPipe, DatePipe, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef, MatTable} from "@angular/material/table";
import {MatIcon} from "@angular/material/icon";
import {MatSortHeader, MatSortModule} from "@angular/material/sort";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatPaginator} from "@angular/material/paginator";
import {MatTooltip} from "@angular/material/tooltip";
import {RouterLink} from "@angular/router";
import {MatList, MatListItem, MatNavList} from "@angular/material/list";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {AwsMockHttpService} from "../../services/awsmock-http.service";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {s3BucketListFeatureKey, s3BucketListReducer} from "./bucket-list/state/s3-bucket-list.reducer";
import {S3BucketListEffects} from "./bucket-list/state/s3-bucket-list.effects";
import {S3BucketListComponent} from "./bucket-list/bucket-list.component";
import {S3BucketDetailComponent} from "./bucket-detail/bucket-detail.component";
import {S3ObjectListComponent} from "./object-list/object-list.component";
import {S3RoutingModule} from "./s3-routing.module";
import {S3Service} from "./service/s3-service.component";
import {S3ObjectListEffects} from "./object-list/state/s3-object-list.effects";
import {s3ObjectListFeatureKey, s3ObjectListReducer} from "./object-list/state/s3-object-list.reducer";
import {S3ObjectDetailComponent} from "./object-detail/object-detail.component";
import {CdkCopyToClipboard} from "@angular/cdk/clipboard";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatDivider} from "@angular/material/divider";
import {FooterComponent} from "../../shared/footer/footer.component";

@NgModule({
    declarations: [S3BucketListComponent, S3BucketDetailComponent, S3ObjectListComponent, S3ObjectDetailComponent],
    imports: [
        MatCard,
        MatCardHeader,
        MatCardContent,
        MatCardActions,
        MatCardSubtitle,
        MatCardTitle,
        MatTable,
        MatHeaderCellDef,
        MatCellDef,
        MatColumnDef,
        MatIcon,
        MatHeaderCell,
        MatCell,
        MatHeaderRowDef,
        MatHeaderRow,
        MatSortHeader,
        MatRowDef,
        MatNoDataRow,
        MatIconButton,
        MatRow,
        MatPaginator,
        MatSortModule,
        MatTooltip,
        RouterLink,
        MatListItem,
        MatNavList,
        DatePipe,
        MatFormField,
        MatInput,
        MatLabel,
        MatSuffix,
        MatGridTile,
        MatGridList,
        MatList,
        MatTabGroup,
        MatTab,
        MatButton,
        NgIf,
        ReactiveFormsModule,
        FormsModule,
        AsyncPipe,
        S3RoutingModule,
        StoreModule.forFeature(s3BucketListFeatureKey, s3BucketListReducer),
        StoreModule.forFeature(s3ObjectListFeatureKey, s3ObjectListReducer),
        EffectsModule.forFeature([S3BucketListEffects, S3ObjectListEffects]),
        CdkCopyToClipboard,
        MatMenuTrigger,
        MatDivider,
        MatMenu,
        MatMenuItem,
        FooterComponent,
    ],
    exports: [S3BucketListComponent, S3BucketDetailComponent, S3ObjectListComponent, S3ObjectDetailComponent],
    providers: [S3Service, AwsMockHttpService],
})
export class S3Module {
}
