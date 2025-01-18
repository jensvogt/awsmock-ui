import {MAT_DIALOG_DATA, MatDialogConfig} from "@angular/material/dialog";
import {Component, Inject, OnInit} from "@angular/core";
import {SqsMessageAttribute, SqsMessageItem} from "../../model/sqs-message-item";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";
import {isJson} from "../../../../shared/format/message-format-component";
import {MatTableDataSource} from "@angular/material/table";
import {PageEvent} from "@angular/material/paginator";
import {Sort} from "@angular/material/sort";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {Store} from "@ngrx/store";
import {SQSMessageListState} from "../state/sqs-message-list.reducer";
import {sqsMessageListActions} from "../state/sqs-message-list.actions";

@Component({
    selector: 'sqs-edit-message-dialog',
    templateUrl: './view-message.component.html',
    styleUrls: ['./view-message.component.scss'],
    standalone: false,
    providers: []
})
export class ViewMessageComponentDialog implements OnInit {

    body: string = '';
    messageId: string = '';
    message: SqsMessageItem;
    prettyPrint: boolean = true;
    isJson: boolean = false;

    // Attributes Table
    messageAttributes = new MatTableDataSource<SqsMessageAttribute>();
    messageAttributeLength: number = 0;
    attributes: SqsMessageAttribute[] = [];
    attributePageSize: number = 10;
    attributePageIndex: number = 0;
    attributeColumns: any[] = ['key', 'value', 'type', 'actions'];
    attributeSortColumns: SortColumn[] = [{column: "key", sortDirection: -1}]
    attributePageSizeOptions = [5, 10, 20, 50, 100];

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private store: Store<SQSMessageListState>) {
        this.message = data.message;
        if (this.message.body?.length) {
            this.isJson = isJson(this.message.body);
            if (isJson(this.message.body) && this.prettyPrint) {
                this.body = JSON.stringify(JSON.parse(data.message.body), null, 2);
            } else {
                this.body = data.message.body;
            }
        }
        this.messageId = this.message?.messageId!;
        if (data.message.messageAttributes) {
            data.message.messageAttributes.forEach((a: any) => {
                for (const key in a) {
                    let attribute: SqsMessageAttribute = {Key: a[key].Name, Value: a[key].StringValue, DataType: a[key].DataType};
                    this.attributes.push(attribute);
                    this.messageAttributes = new MatTableDataSource(this.attributes);
                    this.messageAttributeLength = this.attributes.length;
                }
            });
        }
    }

    ngOnInit() {
    }

    changePrettyPrint(event: MatSlideToggleChange) {
        if (this.message.body !== undefined) {
            if (event.checked) {
                this.body = JSON.stringify(JSON.parse(this.message?.body), null, 2);
            } else {
                this.body = this.message?.body;
            }
        }
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
            this.store.dispatch(sqsMessageListActions.deleteAttribute({messageId: this.messageId, name: key}));
        }
    }

    addAttribute() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {};

        /*this.attributeAdd.open(SqsMessageAttributeAddDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.attributes.push({Key: result.Key, Value: result.Value, DataType: result.DataType});
                this.messageAttributes = new MatTableDataSource(this.attributes);
                this.messageAttributeLength = this.attributes.length;
            }
        });*/
    }
}
