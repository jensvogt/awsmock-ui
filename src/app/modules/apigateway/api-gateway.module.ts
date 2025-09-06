import {NgModule} from '@angular/core';
import {AsyncPipe, DatePipe} from '@angular/common';
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
import {ApiGatewayRoutingModule} from "./api-gateway-routing.module";
import {ApiGatewayService} from "./service/api-gateway-service.component";
import {ApiKeyListComponent} from "./api-key-list/api-key-list.component";
import {ApiKeyListEffects} from "./api-key-list/state/api-key-list.effects";
import {apiKeyListReducer, apiKeysListFeatureKey} from "./api-key-list/state/api-key-list.reducer";
import {MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {ApiKeyDetailComponent} from "./api-key-detail/api-key-detail.component";
import {apiApiKeyDetailReducer, apiKeyDetailsFeatureKey} from "./api-key-detail/state/api-key-detail.reducer";
import {ApiKeyDetailEffects} from "./api-key-detail/state/api-key-detail.effects";

@NgModule({
    declarations: [ApiKeyListComponent, ApiKeyDetailComponent],
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
        ReactiveFormsModule,
        FormsModule,
        AsyncPipe,
        ApiGatewayRoutingModule,
        StoreModule.forFeature(apiKeysListFeatureKey, apiKeyListReducer),
        StoreModule.forFeature(apiKeyDetailsFeatureKey, apiApiKeyDetailReducer),
        EffectsModule.forFeature([ApiKeyListEffects, ApiKeyDetailEffects]),
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
        MatSidenavContainer,
        MatSidenavContent
    ],
    exports: [ApiKeyListComponent, ApiKeyDetailComponent],
    providers: [ApiGatewayService],
})
export class ApiGatewayModule {
}
