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
import {SsmRoutingModule} from "./ssm-routing.module";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatTab, MatTabGroup, MatTabLabel} from "@angular/material/tabs";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {CdkDrag, CdkDragHandle} from "@angular/cdk/drag-drop";
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatCheckbox} from "@angular/material/checkbox";
import {CdkCopyToClipboard} from "@angular/cdk/clipboard";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatDivider} from "@angular/material/divider";
import {FooterComponent} from "../../shared/footer/footer.component";
import {CdkVirtualScrollViewport} from "@angular/cdk/scrolling";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {SsmParameterListComponent} from "./parameter-list/ssm-parameter-list.component";
import {ssmParameterListFeatureKey, ssmParameterListReducer} from "./parameter-list/state/ssm-parameter-list.reducer";
import {SsmParameterListEffects} from "./parameter-list/state/ssm-parameter-list.effects";
import {SsmService} from "./service/ssm-service.component";
import {SsmParameterDetailComponent} from "./parameter-detail/ssm-parameter-detail.component";
import {SsmParameterDetailEffects} from "./parameter-detail/state/ssm-parameter-detail.effects";
import {ssmParameterDetailReducer, ssmParameterDetailsFeatureKey} from "./parameter-detail/state/ssm-parameter-detail.reducer";

@NgModule({
    declarations: [SsmParameterListComponent, SsmParameterDetailComponent],
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
        SsmRoutingModule,
        StoreModule.forFeature(ssmParameterListFeatureKey, ssmParameterListReducer),
        StoreModule.forFeature(ssmParameterDetailsFeatureKey, ssmParameterDetailReducer),
        EffectsModule.forFeature([SsmParameterListEffects, SsmParameterDetailEffects]),
        CdkTextareaAutosize,
        CdkDrag,
        CdkDragHandle,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatSlideToggle,
        MatCheckbox,
        CdkCopyToClipboard,
        MatTabLabel,
        MatMenuItem,
        MatMenuTrigger,
        MatMenu,
        MatDivider,
        FooterComponent,
        CdkVirtualScrollViewport,
        MatProgressSpinner,
    ],
    exports: [SsmParameterListComponent, SsmParameterDetailComponent],
    providers: [SsmService],
})
export class SsmModule {
}
