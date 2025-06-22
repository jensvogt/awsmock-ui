import {NgModule} from '@angular/core';
import {AsyncPipe, DatePipe, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef, MatTable} from "@angular/material/table";
import {MatIcon} from "@angular/material/icon";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatPaginator} from "@angular/material/paginator";
import {MatTooltip} from "@angular/material/tooltip";
import {RouterLink} from "@angular/router";
import {MatList, MatListItem, MatNavList} from "@angular/material/list";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {KmsRoutingModule} from "./kms-routing.module";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {CdkDrag, CdkDragHandle} from "@angular/cdk/drag-drop";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {CdkCopyToClipboard} from "@angular/cdk/clipboard";
import {FooterComponent} from "../../shared/footer/footer.component";
import {MatDivider} from "@angular/material/divider";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {KmsKeyListComponent} from "./key-list/key-list.component";
import {KmsService} from "./service/kms-service.component";
import {kmsKeyListFeatureKey, kmsKeyListReducer} from "./key-list/state/key-list.reducer";
import {KMSKeyListEffects} from "./key-list/state/key-list.effects";
import {KmsKeyDetailComponent} from "./key-detail/key-detail.component";
import {kmsKeyDetailReducer, kmsKeyDetailsFeatureKey} from "./key-detail/state/kms-key-detail.reducer";
import {KmsKeyDetailEffects} from "./key-detail/state/kms-key-detail.effects";

@NgModule({
    declarations: [KmsKeyListComponent, KmsKeyDetailComponent],
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
        MatSort,
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
        KmsRoutingModule,
        StoreModule.forFeature(kmsKeyListFeatureKey, kmsKeyListReducer),
        StoreModule.forFeature(kmsKeyDetailsFeatureKey, kmsKeyDetailReducer),
        EffectsModule.forFeature([KMSKeyListEffects, KmsKeyDetailEffects]),
        MatDialogContent,
        CdkTextareaAutosize,
        CdkDrag,
        CdkDragHandle,
        MatDialogTitle,
        MatDialogActions,
        MatDialogClose,
        MatSlideToggle,
        CdkCopyToClipboard,
        FooterComponent,
        MatDivider,
        MatMenu,
        MatMenuItem,
        MatMenuTrigger,
    ],
    exports: [KmsKeyListComponent, KmsKeyDetailComponent],
    providers: [KmsService],
})
export class KmsModule {
}
