import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, Inject, OnInit} from "@angular/core";
import {ItemItem, PutItemRequest} from "../../model/item-item";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {CdkDrag, CdkDragHandle} from "@angular/cdk/drag-drop";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";

@Component({
    selector: 'dynamodb-add-item-dialog',
    templateUrl: './add-item.component.html',
    styleUrls: ['./add-item.component.scss'],
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
        MatDialogClose
    ]
})
export class DynamoDbAddItemDialog implements OnInit {

    tableName: string = '';
    itemJson: string = '';
    item: ItemItem = {} as ItemItem;
    request: PutItemRequest = {} as PutItemRequest;

    constructor(private dialogRef: MatDialogRef<DynamoDbAddItemDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.tableName = data.tableName;
    }

    ngOnInit() {
        this.dialogRef.updateSize("1000px", "600px");
    }

    addItem() {
        this.request.TableName = this.tableName;
        this.item = JSON.parse(this.itemJson);
        this.request.Item = this.item;
        this.dialogRef.close(this.request);
    }
}
