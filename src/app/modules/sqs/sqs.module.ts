import {NgModule} from '@angular/core';
import {AsyncPipe, DatePipe, NgIf} from '@angular/common';

import {SqsQueueListComponent} from "./queues-list/sqs-queue-list.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {sqsQueueListFeatureKey, sqsQueueListReducer} from "./queues-list/state/sqs-queue-list.reducer";
import {SqsQueueListEffects} from "./queues-list/state/sqs-queue-list.effects";
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
import {SqsService} from "./service/sqs-service.component";
import {SQSRoutingModule} from "./sqs-routing.module";
import {SqsQueueDetailComponent} from "./queue-detail/sqs-queue-detail.component";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {SqsMessageListComponent} from "./message-list/sqs-message-list.component";
import {SqsQueueDetailEffects} from "./queue-detail/state/sqs-queue-detail.effects";
import {sqsQueueDetailReducer, sqsQueueDetailsFeatureKey} from "./queue-detail/state/sqs-queue-detail.reducer";
import {sqsMessageListFeatureKey, sqsMessageListReducer} from "./message-list/state/sqs-message-list.reducer";
import {SqsMessageListEffects} from "./message-list/state/sqs-message-list.effects";
import {SendMessageComponentDialog} from "./send-message/send-message.component";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {CdkDrag, CdkDragHandle} from "@angular/cdk/drag-drop";
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {ViewMessageComponentDialog} from "./message-list/view-message/view-message.component";
import {MatSlideToggle} from "@angular/material/slide-toggle";

@NgModule({
    declarations: [SqsQueueListComponent, SqsQueueDetailComponent, SqsMessageListComponent, SendMessageComponentDialog, ViewMessageComponentDialog],
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
        SQSRoutingModule,
        StoreModule.forFeature(sqsQueueListFeatureKey, sqsQueueListReducer),
        StoreModule.forFeature(sqsQueueDetailsFeatureKey, sqsQueueDetailReducer),
        StoreModule.forFeature(sqsMessageListFeatureKey, sqsMessageListReducer),
        EffectsModule.forFeature([SqsQueueListEffects, SqsQueueDetailEffects, SqsMessageListEffects]),
        CdkTextareaAutosize,
        CdkDrag,
        CdkDragHandle,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatSlideToggle,
    ],
    exports: [SqsQueueListComponent, SqsQueueDetailComponent, SqsMessageListComponent],
    providers: [SqsService],
})
export class SQSModule {
}
