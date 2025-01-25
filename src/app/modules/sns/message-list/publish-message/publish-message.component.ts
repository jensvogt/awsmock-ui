import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {Component, Inject, OnInit} from "@angular/core";
import {MatTableDataSource} from "@angular/material/table";
import {PageEvent} from "@angular/material/paginator";
import {Sort} from "@angular/material/sort";
import {SnsMessageAttribute} from "../../model/sns-message-item";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {SqsMessageAttributeAddDialog} from "../../../sqs/attribute-add/attribute-add.component";

@Component({
    selector: 'sns-publish-message-dialog',
    templateUrl: './publish-message.component.html',
    styleUrls: ['./publish-message.component.scss'],
    standalone: false
})
export class PublishMessageComponentDialog implements OnInit {

    topicArn: string = '';
    topicName: string = '';
    message: string = '';

    // Attributes Table
    messageAttributes = new MatTableDataSource<SnsMessageAttribute>();
    messageAttributeLength: number = 0;
    attributes: SnsMessageAttribute[] = [];
    attributePageSize: number = 10;
    attributePageIndex: number = 0;
    attributeColumns: any[] = ['key', 'value', 'type', 'actions'];
    attributeSortColumns: SortColumn[] = [{column: "key", sortDirection: -1}]
    attributePageSizeOptions = [5, 10, 20, 50, 100];

    constructor(private dialogRef: MatDialogRef<PublishMessageComponentDialog>, @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog) {
        this.topicArn = data.topicArn;
        this.topicName = data.topicArn.substring(this.topicArn.lastIndexOf(':') + 1);
    }

    ngOnInit() {
        this.dialogRef.updateSize("1200px", "800px");
    }

    publishMessage() {
        this.dialogRef.close({message: this.message, attributes: this.attributes});
    }

    handleAttributePageEvent(e: PageEvent) {
        this.attributePageSize = e.pageSize;
        this.attributePageIndex = e.pageIndex;
    }

    attributeSortChange(sortState: Sort) {
        this.attributeSortColumns = [];
        let column = sortState.active;
        let direction = sortState.direction === 'asc' ? 1 : -1;
        this.attributeSortColumns = [{column: column, sortDirection: direction}];
    }

    deleteAttribute(key: string) {
        if (key) {
            this.attributes = this.attributes.filter(element => {
                return element.Key !== key
            });
            this.messageAttributes = new MatTableDataSource(this.attributes);
        }
    }

    addAttribute(): void {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {};

        this.dialog.open(SqsMessageAttributeAddDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.attributes.push({Key: result.Key, Value: result.Value, DataType: result.DataType});
                this.messageAttributes = new MatTableDataSource(this.attributes);
                this.messageAttributeLength = this.attributes.length;
            }
        });
    }
}
