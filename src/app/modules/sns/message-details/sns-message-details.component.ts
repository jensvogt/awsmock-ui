import {MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {Component, Inject, OnInit} from "@angular/core";
import {SnsMessageAttribute, SnsMessageItem} from "../model/sns-message-item";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";
import {isJson} from "../../../shared/format/message-format-component";
import {MatTableDataSource} from "@angular/material/table";
import {PageEvent} from "@angular/material/paginator";
import {Sort} from "@angular/material/sort";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {Store} from "@ngrx/store";
import {SNSMessageListState} from "../message-list/state/sns-message-list.reducer";
import {snsMessageListActions} from "../message-list/state/sns-message-list.actions";

@Component({
    selector: 'sns-message-details-dialog',
    templateUrl: './sns-message-details.component.html',
    styleUrls: ['./sns-message-details.component.scss'],
    standalone: false
})
export class SnsMessageDetailsDialog implements OnInit {

    body: string | undefined = '';
    rawMessage: any | undefined = '';
    messageId: string | undefined = '';
    message: SnsMessageItem | undefined;
    prettyPrint: boolean = true;
    isJson: boolean = false;

    // Attributes Table
    messageAttributes = new MatTableDataSource<SnsMessageAttribute>();
    messageAttributeLength: number = 0;
    attributes: SnsMessageAttribute[] = [];
    attributePageSize: number = 10;
    attributePageIndex: number = 0;
    attributeColumns: any[] = ['key', 'value', 'type', 'actions'];
    attributeSortColumns: SortColumn[] = [{column: "key", sortDirection: -1}]
    attributePageSizeOptions = [5, 10, 20, 50, 100];

    constructor(private dialogRef: MatDialogRef<SnsMessageDetailsDialog>, @Inject(MAT_DIALOG_DATA) public data: any, private store: Store<SNSMessageListState>) {
        this.message = data.message;
        this.rawMessage = this.message?.message;
        this.messageId = this.message?.messageId;
        if (this.message?.message?.length) {
            this.isJson = isJson(this.rawMessage);
            if (this.isJson && this.prettyPrint) {
                this.body = JSON.stringify(JSON.parse(this.data.message.message), null, 2);
            } else {
                this.body = data.message.Message;
            }
        }
        if (data.message.messageAttributes) {
            data.message.messageAttributes.forEach((a: any) => {
                for (const key in a) {
                    let attribute: SnsMessageAttribute = {Key: a[key].Name, Value: a[key].StringValue, DataType: a[key].DataType};
                    this.attributes.push(attribute);
                    this.messageAttributes = new MatTableDataSource(this.attributes);
                    this.messageAttributeLength = this.attributes.length;
                }
            });
        }
    }

    ngOnInit() {
        this.dialogRef.updateSize("1200px", "800px");
    }

    changePrettyPrint(event: MatSlideToggleChange) {
        if (this.message?.message !== undefined) {
            if (event.checked) {
                this.body = JSON.stringify(JSON.parse(this.message?.message), null, 2);
            } else {
                this.body = this.message?.message;
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
        if (key && this.messageId) {
            this.attributes = this.attributes.filter(element => {
                return element.Key !== key
            });
            this.messageAttributes = new MatTableDataSource(this.attributes);
            this.store.dispatch(snsMessageListActions.deleteAttribute({messageId: this.messageId, name: key}));
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
