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
import {SnsRoutingModule} from "./sns-routing.module";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {snsTopicListFeatureKey, snsTopicListReducer} from "./topic-list/state/sns-topic-list.reducer";
import {SnsTopicListEffects} from "./topic-list/state/sns-topic-list.effects";
import {SnsMessageListComponent} from "./message-list/sns-message-list.component";
import {SnsTopicListComponent} from "./topic-list/topic-list.component";
import {SnsTopicDetailComponent} from "./topic-detail/topic-detail.component";
import {SnsService} from "./service/sns-service.component";
import {snsTopicDetailReducer, snsTopicDetailsFeatureKey} from "./topic-detail/state/sns-topic-detail.reducer";
import {SnsTopicDetailEffects} from "./topic-detail/state/sns-topic-detail.effects";
import {snsMessageListFeatureKey, snsMessageListReducer} from "./message-list/state/sns-message-list.reducer";
import {SnsMessageListEffects} from "./message-list/state/sns-message-list.effects";
import {PublishMessageComponentDialog} from "./message-publish/publish-message.component";
import {SnsMessageDetailsDialog} from "./message-details/sns-message-details.component";
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {CdkDrag, CdkDragHandle} from "@angular/cdk/drag-drop";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {CdkCopyToClipboard} from "@angular/cdk/clipboard";
import {FooterComponent} from "../../shared/footer/footer.component";
import {MatDivider} from "@angular/material/divider";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {CdkScrollable, CdkVirtualScrollableElement} from "@angular/cdk/scrolling";

@NgModule({
    declarations: [SnsTopicListComponent, SnsTopicDetailComponent, SnsMessageListComponent, SnsMessageDetailsDialog, PublishMessageComponentDialog],
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
        SnsRoutingModule,
        StoreModule.forFeature(snsTopicListFeatureKey, snsTopicListReducer),
        StoreModule.forFeature(snsTopicDetailsFeatureKey, snsTopicDetailReducer),
        StoreModule.forFeature(snsMessageListFeatureKey, snsMessageListReducer),
        EffectsModule.forFeature([SnsTopicListEffects, SnsTopicDetailEffects, SnsMessageListEffects]),
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
        CdkScrollable,
        CdkVirtualScrollableElement,
    ],
    exports: [SnsTopicListComponent, SnsTopicDetailComponent, SnsMessageListComponent, PublishMessageComponentDialog, SnsMessageDetailsDialog],
    providers: [SnsService],
})
export class SnsModule {
}
