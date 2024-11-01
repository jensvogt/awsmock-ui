import {NgModule} from '@angular/core';
import {AsyncPipe, DatePipe, NgIf} from '@angular/common';

import {SqsQueueListComponent} from "./queues-list/sqs-queue-list.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {sqsQueueListFeatureKey, sqsQueueListReducer} from "./queues-list/state/sqs-queue-list.reducer";
import {SqsQueueListEffects} from "./queues-list/state/sqs-queue-list.effects";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
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
    MatTable
} from "@angular/material/table";
import {MatIcon} from "@angular/material/icon";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatPaginator} from "@angular/material/paginator";
import {MatTooltip} from "@angular/material/tooltip";
import {RouterLink} from "@angular/router";
import {MatList, MatListItem, MatNavList} from "@angular/material/list";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {SqsService} from "../../services/sqs-service.component";
import {SQSRoutingModule} from "./sqs-routing.module";
import {AwsMockHttpService} from "../../services/awsmock-http.service";
import {SqsQueueDetailComponent} from "./queue-detail/sqs-queue-detail.component";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {SqsMessageListComponent} from "./message-list/sqs-message-list.component";
import {SqsQueueDetailEffects} from "./queue-detail/state/sqs-queue-detail.effects";
import {sqsQueueDetailReducer, sqsQueueDetailsFeatureKey} from "./queue-detail/state/sqs-queue-detail.reducer";

@NgModule({
    declarations: [SqsQueueListComponent, SqsQueueDetailComponent, SqsMessageListComponent],
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
        EffectsModule.forFeature([SqsQueueListEffects, SqsQueueDetailEffects]),
    ],
    exports: [SqsQueueListComponent, SqsQueueDetailComponent, SqsMessageListComponent],
    providers: [SqsService, AwsMockHttpService],
})
export class SQSModule {
}