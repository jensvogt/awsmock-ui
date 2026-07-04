import {MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogConfig, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, Inject, OnInit} from "@angular/core";
import {MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatCellDef, MatHeaderCell, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatNoDataRow} from "@angular/material/table";
import {PageEvent, MatPaginator} from "@angular/material/paginator";
import {Sort, MatSortModule} from "@angular/material/sort";
import {SnsMessageAttribute} from "../model/sns-message-item";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {SqsMessageAttributeAddDialog} from "../../sqs/attribute-add/attribute-add.component";
import {MatCardActions} from "@angular/material/card";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton, MatButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {CdkDrag, CdkDragHandle} from "@angular/cdk/drag-drop";

@Component({
    selector: 'sns-publish-message-dialog',
    templateUrl: './publish-message.component.html',
    styleUrls: ['./publish-message.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        MatCardActions,
        MatTab,
        MatTabGroup,
        MatTable,
        MatColumnDef,
        MatHeaderCellDef,
        MatCellDef,
        MatHeaderCell,
        MatCell,
        MatHeaderRowDef,
        MatHeaderRow,
        MatRowDef,
        MatRow,
        MatNoDataRow,
        MatSortModule,
        MatIcon,
        MatIconButton,
        MatButton,
        MatPaginator,
        MatTooltip,
        MatFormField,
        MatLabel,
        MatInput,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        CdkTextareaAutosize,
        CdkDrag,
        CdkDragHandle,
    ]
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

    constructor(private readonly dialogRef: MatDialogRef<PublishMessageComponentDialog>, @Inject(MAT_DIALOG_DATA) public data: any, private readonly dialog: MatDialog) {
        this.topicArn = data.topicArn;
        this.topicName = data.topicArn.substring(this.topicArn.lastIndexOf(':') + 1);
    }

    ngOnInit() {
        //   this.dialogRef.updateSize("1200px", "800px");
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
