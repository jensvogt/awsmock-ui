import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {Component, Inject, OnInit} from "@angular/core";
import {SqsAttribute, SqsMessageAttribute, SqsMessageItem} from "../model/sqs-message-item";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";
import {isJson} from "../../../shared/format/message-format-component";
import {MatTableDataSource} from "@angular/material/table";
import {PageEvent} from "@angular/material/paginator";
import {Sort} from "@angular/material/sort";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {Store} from "@ngrx/store";
import {SQSMessageListState} from "../message-list/state/sqs-message-list.reducer";
import {sqsMessageListActions} from "../message-list/state/sqs-message-list.actions";
import {SqsMessageAttributeEditDialog} from "../attribute-edit/attribute-edit.component";
import {S3MetadataEditDialog} from "../../s3/metadata-edit/metadata-edit.component";

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

    // Message attributes table
    messageAttributesDatasource = new MatTableDataSource<SqsMessageAttribute>();
    messageAttributeLength: number = 0;
    messageAttributes: SqsMessageAttribute[] = [];
    messageAttributePageSize: number = 10;
    messageAttributePageIndex: number = 0;
    messageAttributeColumns: any[] = ['key', 'value', 'type', 'actions'];
    messageAttributeSortColumns: SortColumn[] = [{column: "key", sortDirection: -1}]
    messageAttributePageSizeOptions = [5, 10, 20, 50, 100];

    // Message attributes table
    attributesDatasource = new MatTableDataSource<SqsAttribute>();
    attributeLength: number = 0;
    attributes: SqsAttribute[] = [];
    attributePageSize: number = 10;
    attributePageIndex: number = 0;
    attributeColumns: any[] = ['key', 'value'];
    attributeSortColumns: SortColumn[] = [{column: "key", sortDirection: -1}]
    attributePageSizeOptions = [5, 10, 20, 50, 100];

    constructor(private dialogRef: MatDialogRef<ViewMessageComponentDialog>, @Inject(MAT_DIALOG_DATA) public data: any, private store: Store<SQSMessageListState>, private dialog: MatDialog) {
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
        for (let key in data.message.messageAttributes) {
            let attribute: SqsMessageAttribute = {
                name: key,
                stringValue: data.message.messageAttributes[key].stringValue,
                dataType: data.message.messageAttributes[key].dataType,
                stringListValues: []
            };
            this.messageAttributes.push(attribute);
        }
        this.messageAttributesDatasource = new MatTableDataSource(this.messageAttributes);
        this.messageAttributeLength = this.messageAttributes.length;
        if (data.message.attributes) {
            for (let key in data.message.attributes) {
                let attribute: SqsAttribute = {key: key, value: data.message.attributes[key]};
                this.attributes.push(attribute);

            }
            this.attributesDatasource = new MatTableDataSource(this.attributes);
            this.attributeLength = this.attributes.length;
        }
        //console.log("Message attributes: ", this.messageAttributes);
        // console.log("Input data: ", data.message);
    }

    ngOnInit() {
        this.dialogRef.updateSize("1200px", "800px");
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
        this.messageAttributePageSize = e.pageSize;
        this.messageAttributePageIndex = e.pageIndex;
    }

    attributeSortChange(sortState: Sort) {
        this.messageAttributeSortColumns = [];
        let column = sortState.active;
        let direction = sortState.direction === 'asc' ? 1 : -1;
        this.messageAttributeSortColumns = [{column: column, sortDirection: direction}];
    }

    addAttribute(): void {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {};

        this.dialog.open(S3MetadataEditDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.messageAttributes.push({stringListValues: [], name: result.name, stringValue: result.stringValue, dataType: result.dataType});
                this.messageAttributesDatasource = new MatTableDataSource(this.messageAttributes);
                this.messageAttributeLength = this.messageAttributes.length;
            }
        });
    }

    editAttribute(attribute: SqsMessageAttribute) {
        if (attribute) {
            const dialogConfig = new MatDialogConfig();

            dialogConfig.disableClose = true;
            dialogConfig.autoFocus = true;
            dialogConfig.data = {attribute: attribute};

            this.dialog.open(SqsMessageAttributeEditDialog, dialogConfig).afterClosed().subscribe(result => {
                if (result && result.attribute) {
                    let index = this.messageAttributes.findIndex(x => x.name === result.attribute.name)
                    if (index > 0) {
                        this.messageAttributes[index] = result.attribute
                        this.messageAttributesDatasource = new MatTableDataSource(this.messageAttributes);
                        this.messageAttributeLength = this.messageAttributes.length;
                        this.store.dispatch(sqsMessageListActions.updateMessage({messageId: this.messageId, messageAttributes: this.messageAttributes}));
                    }
                }
            });
        }
    }

    deleteAttribute(key: string): void {
        if (key) {
            this.messageAttributes = this.messageAttributes.filter(element => {
                return element.name !== key
            });
            this.messageAttributesDatasource = new MatTableDataSource(this.messageAttributes);
            this.store.dispatch(sqsMessageListActions.updateMessage({messageId: this.messageId, messageAttributes: this.messageAttributes}));
        }
    }
}
