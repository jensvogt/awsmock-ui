import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {Component, Inject, OnInit} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {CdkDrag, CdkDragHandle} from "@angular/cdk/drag-drop";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {ItemItem} from "../../model/item-item";

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
export class DynamodbViewItemDialog implements OnInit {

    body: string | undefined = '';
    item: ItemItem | undefined;
    oid: string | undefined = '';
    prettyPrint: boolean = true;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
        this.item = data;
        this.oid = this.item?.oid;
        this.body = JSON.stringify(this.item?.attributes, null, 2);
    }

    ngOnInit() {
    }
}
