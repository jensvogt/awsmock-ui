import {NgModule} from '@angular/core';
import {AsyncPipe, DatePipe, NgIf} from '@angular/common';

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
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
import {TransferRoutingModule} from "./transfer-routing.module";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {TransferService} from "./service/transfer.service";
import {TransferServerListComponent} from "./server-list/transfer-server-list.component";
import {StoreModule} from "@ngrx/store";
import {transferServerListFeatureKey, transferServerListReducer} from "./server-list/state/transfer-server-list.reducer";
import {EffectsModule} from "@ngrx/effects";
import {TransferServerListEffects} from "./server-list/state/transfer-server-list.effects";
import {TransferServerDetailComponent} from "./transfer-details/transfer-server-detail.component";
import {TransferServerDetailEffects} from "./transfer-details/state/transfer-server-detail.effects";
import {transferServerDetailReducer, transferServerDetailsFeatureKey} from "./transfer-details/state/transfer-server-detail.reducer";
import {FooterComponent} from "../../shared/footer/footer.component";
import {CdkCopyToClipboard} from "@angular/cdk/clipboard";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";

@NgModule({
    declarations: [TransferServerListComponent, TransferServerDetailComponent],
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
        TransferRoutingModule,
        StoreModule.forFeature(transferServerListFeatureKey, transferServerListReducer),
        StoreModule.forFeature(transferServerDetailsFeatureKey, transferServerDetailReducer),
        EffectsModule.forFeature([TransferServerListEffects, TransferServerDetailEffects]),
        FooterComponent,
        CdkCopyToClipboard,
        MatMenu,
        MatMenuItem,
        MatMenuTrigger,
    ],
    exports: [TransferServerListComponent],
    providers: [TransferService],
})
export class TransferModule {
}
