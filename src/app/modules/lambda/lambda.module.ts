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
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {LambdaFunctionListComponent} from "./function-list/function-list.component";
import {LambdaRoutingModule} from "./lambda-routing.module";
import {lambdaFunctionListFeatureKey, lambdaFunctionListReducer} from "./function-list/state/lambda-function-list.reducer";
import {LambdaFunctionListEffects} from "./function-list/state/lambda-function-list.effects";
import {LambdaService} from "./service/lambda-service.component";
import {lambdaFunctionDetailsFeatureKey, lambdaFunctionDetailsReducer} from "./function-details/state/lambda-function-details.reducer";
import {LambdaFunctionDetailsComponent} from "./function-details/function-detail.component";
import {LambdaFunctionDetailsEffects} from "./function-details/state/lambda-function-details.effects";
import {MatDivider} from "@angular/material/divider";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {CdkCopyToClipboard} from "@angular/cdk/clipboard";
import {FooterComponent} from "../../shared/footer/footer.component";
import {SqsService} from "../sqs/service/sqs-service.component";
import {SnsService} from "../sns/service/sns-service.component";
import {S3Service} from "../s3/service/s3-service.component";
import {DynamodbService} from "../dynamodb/service/dynamodb.service";

@NgModule({
    declarations: [LambdaFunctionListComponent, LambdaFunctionDetailsComponent],
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
        LambdaRoutingModule,
        StoreModule.forFeature(lambdaFunctionListFeatureKey, lambdaFunctionListReducer),
        StoreModule.forFeature(lambdaFunctionDetailsFeatureKey, lambdaFunctionDetailsReducer),
        EffectsModule.forFeature([LambdaFunctionListEffects, LambdaFunctionDetailsEffects]),
        MatDivider,
        MatMenu,
        MatMenuItem,
        MatMenuTrigger,
        CdkCopyToClipboard,
        FooterComponent,
    ],
    exports: [LambdaFunctionListComponent, LambdaFunctionDetailsComponent],
    providers: [LambdaService, SqsService, SnsService, S3Service, DynamodbService],
})
export class LambdaModule {
}
