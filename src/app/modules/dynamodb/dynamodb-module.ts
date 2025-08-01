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
import {DynamodbRoutingModule} from "./dynamodb-routing.module";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {DynamodbTableListComponent} from "./table-list/table-list.component";
import {dynamodbTableListFeatureKey, dynamodbTableListReducer} from "./table-list/state/dynamodb-table-list.reducer";
import {DynamodbTableListEffects} from "./table-list/state/dynamodb-table-list.effects";
import {DynamodbService} from "./service/dynamodb.service";
import {DynamodbItemListComponent} from "./item-list/item-list.component";
import {dynamodbItemListFeatureKey, dynamodbItemListReducer} from "./item-list/state/dynamodb-item-list.reducer";
import {DynamodbItemListEffects} from "./item-list/state/dynamodb-item-list.effects";
import {FooterComponent} from "../../shared/footer/footer.component";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";

@NgModule({
    declarations: [DynamodbTableListComponent, DynamodbItemListComponent],
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
        DynamodbRoutingModule,
        StoreModule.forFeature(dynamodbTableListFeatureKey, dynamodbTableListReducer),
        StoreModule.forFeature(dynamodbItemListFeatureKey, dynamodbItemListReducer),
        EffectsModule.forFeature([DynamodbTableListEffects, DynamodbItemListEffects]),
        FooterComponent,
        MatMenu,
        MatMenuItem,
        MatMenuTrigger,
    ],
    exports: [DynamodbTableListComponent],
    providers: [DynamodbService],
})
export class DynamodbModule {
}
