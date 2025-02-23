import {NgModule} from '@angular/core';
import {AsyncPipe, DatePipe, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
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
import {CognitoRoutingModule} from "./cognito-routing.module";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {CognitoUserPoolListComponent} from "./user-pool-list/user-pool-list.component";
import {CognitoService} from "./service/cognito.service";
import {cognitoUserPoolListFeatureKey, cognitoUserPoolListReducer} from "./user-pool-list/state/cognito-userpool-list.reducer";
import {CognitoUserPoolListEffects} from "./user-pool-list/state/cognito-userpool-list.effects";
import {CognitoUserListComponent} from "./user-list/user-list.component";
import {cognitoUserListFeatureKey, cognitoUserListReducer} from "./user-list/state/cognito-user-list.reducer";
import {CognitoUserListEffects} from "./user-list/state/cognito-user-list.effects";
import {CognitoUserDetailsComponent} from "./user-detail/user-detail.component";
import {FooterComponent} from "../../shared/footer/footer.component";

@NgModule({
    declarations: [CognitoUserPoolListComponent, CognitoUserListComponent, CognitoUserDetailsComponent],
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
        CognitoRoutingModule,
        StoreModule.forFeature(cognitoUserPoolListFeatureKey, cognitoUserPoolListReducer),
        StoreModule.forFeature(cognitoUserListFeatureKey, cognitoUserListReducer),
        EffectsModule.forFeature([CognitoUserPoolListEffects, CognitoUserListEffects]),
        FooterComponent,
    ],
    exports: [CognitoUserPoolListComponent, CognitoUserListComponent, CognitoUserDetailsComponent],
    providers: [CognitoService],
})
export class CognitoModule {
}
