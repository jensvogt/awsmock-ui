import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, Inject} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {CdkDrag, CdkDragHandle} from "@angular/cdk/drag-drop";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {ItemItem, PutItemRequest} from "../../model/item-item";

@Component({
    selector: 'sns-edit-message-dialog',
    templateUrl: './view-item.component.html',
    standalone: true,
    imports: [
        MatDialogContent,
        MatDialogTitle,
        MatDialogActions,
        MatButton,
        MatDialogClose,
        MatFormField,
        MatLabel,
        FormsModule,
        MatInput,
        ReactiveFormsModule,
        CdkDrag,
        CdkDragHandle,
        CdkTextareaAutosize
    ],
    styleUrls: ['./view-item.component.scss']
})
export class DynamodbViewItemDialog {

    itemJson: string = '';
    oid: string | undefined = '';
    tableName: string = '';
    item: ItemItem = {} as ItemItem;
    request: PutItemRequest = {} as PutItemRequest;

    constructor(private dialogRef: MatDialogRef<DynamodbViewItemDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.item = data.item;
        this.tableName = data.tableName;
        this.oid = this.item?.oid;
        this.itemJson = JSON.stringify(this.item?.attributes, null, 2);
    }

    updateItem() {
        this.request.TableName = this.tableName;
        this.item = JSON.parse(this.itemJson);
        this.request.Item = this.item;
        this.dialogRef.close(this.request);
    }
}
