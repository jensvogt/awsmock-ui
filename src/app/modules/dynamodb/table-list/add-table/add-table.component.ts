import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, Inject, OnInit} from "@angular/core";
import {ItemItem} from "../../model/item-item";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {CdkDrag, CdkDragHandle} from "@angular/cdk/drag-drop";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {CreateTableRequest, ProvisionedThroughput} from "../../model/table-item";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatList, MatListItem} from "@angular/material/list";

@Component({
    selector: 'dynamodb-add-table-dialog',
    templateUrl: './add-table.component.html',
    styleUrls: ['./add-table.component.scss'],
    standalone: true,
    imports: [
        MatDialogContent,
        MatFormField,
        FormsModule,
        CdkDrag,
        CdkDragHandle,
        MatDialogTitle,
        CdkTextareaAutosize,
        MatInput,
        MatLabel,
        MatDialogActions,
        MatButton,
        MatDialogClose,
        MatGridList,
        MatGridTile,
        MatList,
        MatListItem
    ]
})
export class DynamoDbAddTableDialog implements OnInit {

    tableName: string = '';
    attributesJson: string = '';
    keySchemaJson: string = '';
    item: ItemItem = {} as ItemItem;
    readCapacity: number = 1;
    writeCapacity: number = 1;
    request: CreateTableRequest = {} as CreateTableRequest;

    constructor(private dialogRef: MatDialogRef<DynamoDbAddTableDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.tableName = data.tableName;
    }

    ngOnInit() {
        this.dialogRef.updateSize("1200px", "600px");
    }

    addItem() {
        this.request.TableName = this.tableName;
        this.request.AttributeDefinitions = JSON.parse(this.attributesJson);
        this.request.KeySchema = JSON.parse(this.keySchemaJson);
        this.request.ProvisionedThroughput = {} as ProvisionedThroughput;
        this.request.ProvisionedThroughput.ReadCapacityUnits = this.readCapacity;
        this.request.ProvisionedThroughput.WriteCapacityUnits = this.writeCapacity;
        this.dialogRef.close(this.request);
    }
}
