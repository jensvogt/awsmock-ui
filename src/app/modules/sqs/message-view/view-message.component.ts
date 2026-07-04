import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose} from "@angular/material/dialog";
import {Component, Inject, OnInit} from "@angular/core";
import {ListMessageAttributeCountersResponse, SqsAttribute, SqsMessageAttribute, SqsMessageItem} from "../model/sqs-message-item";
import {MatSlideToggle, MatSlideToggleChange} from "@angular/material/slide-toggle";
import {isJson} from "../../../shared/format/message-format-component";
import {MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatCellDef, MatHeaderCell, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatNoDataRow} from "@angular/material/table";
import {PageEvent, MatPaginator} from "@angular/material/paginator";
import {Sort} from "@angular/material/sort";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {State, Store} from "@ngrx/store";
import {SQSMessageListState} from "../message-list/state/sqs-message-list.reducer";
import {sqsMessageListActions} from "../message-list/state/sqs-message-list.actions";
import {SqsMessageAttributeEditDialog} from "../attribute-edit/attribute-edit.component";
import {SqsMessageAttributeAddDialog} from "../attribute-add/attribute-add.component";
import {Observable} from "rxjs";
import {selectMessageAttributeCounters} from "../message-list/state/sqs-message-list.selectors";
import {CdkDrag, CdkDragHandle} from "@angular/cdk/drag-drop";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {MatTabGroup, MatTab, MatTabLabel} from "@angular/material/tabs";
import {MatCard, MatCardActions, MatCardContent} from "@angular/material/card";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatSortModule} from "@angular/material/sort";
import {MatIconButton, MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";
import {AsyncPipe} from "@angular/common";

@Component({
    selector: 'sqs-edit-message-dialog',
    templateUrl: './view-message.component.html',
    styleUrls: ['./view-message.component.scss'],
    standalone: true,
    providers: [],
    imports: [
        CdkDrag,
        CdkDragHandle,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatTabGroup,
        MatTab,
        MatTabLabel,
        MatCard,
        MatCardActions,
        MatCardContent,
        MatSlideToggle,
        MatFormField,
        MatInput,
        FormsModule,
        CdkTextareaAutosize,
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
        MatPaginator,
        MatIconButton,
        MatButton,
        MatIcon,
        MatTooltip,
        AsyncPipe,
    ]
})
export class ViewMessageComponentDialog implements OnInit {

    body: string = '';
    messageId: string = '';
    message: SqsMessageItem;
    prettyPrint: boolean = true;
    isJson: boolean = false;

    // Message attributes table
    messageAttributes$: Observable<ListMessageAttributeCountersResponse> = this.store.select(selectMessageAttributeCounters);
    messageAttributeList: SqsMessageAttribute[] = [];
    messageAttributesDatasource = new MatTableDataSource<SqsMessageAttribute>();
    messageAttributePageSize: number = 10;
    messageAttributePageIndex: number = 0;
    messageAttributeSortColumns: SortColumn[] = [{column: "key", sortDirection: -1}]
    messageAttributeColumns: any[] = ['key', 'value', 'type', 'actions'];
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

    constructor(private readonly dialogRef: MatDialogRef<ViewMessageComponentDialog>, @Inject(MAT_DIALOG_DATA) public data: any, private readonly store: Store<SQSMessageListState>,
                private readonly state: State<SQSMessageListState>, private readonly dialog: MatDialog) {
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

        // Message attributes
        this.messageAttributes$.subscribe((data: any) => {
            this.messageAttributeList = [];
            for (let key in data.messageAttributeCounters) {
                let attribute: SqsMessageAttribute = {
                    name: key,
                    stringValue: data.messageAttributeCounters[key].StringValue,
                    dataType: data.messageAttributeCounters[key].DataType,
                    stringListValues: []
                };
                this.messageAttributeList.push(attribute);
                this.messageAttributesDatasource = new MatTableDataSource(this.messageAttributeList);
            }
        });

        // System attributes
        if (data.message.attributes) {
            for (let key in data.message.attributes) {
                let attribute: SqsAttribute = {key: key, value: data.message.attributes[key]};
                this.attributes.push(attribute);

            }
            this.attributesDatasource = new MatTableDataSource(this.attributes);
            this.attributeLength = this.attributes.length;
        }
        //console.log("Message attributes: ", this.messageAttributes);
        //console.log("Input data: ", data.message);
    }

    ngOnInit() {
        this.dialogRef.keydownEvents().subscribe(event => {
            if (event.key === "Escape") {
                this.close();
            }
        });
        this.loadMessageAttributes();
    }

    loadMessageAttributes() {
        this.store.dispatch(sqsMessageListActions.loadMessageAttributes({
            messageId: this.messageId,
            prefix: this.state.value['sqs-message-list'].messageAttributePrefix,
            pageSize: this.state.value['sqs-message-list'].messageAttributePageSize,
            pageIndex: this.state.value['sqs-message-list'].messageAttributePageIndex,
            sortColumns: this.state.value['sqs-message-list'].messageAttributeSortColumns
        }));
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

    refreshAttribute(): void {
        this.loadMessageAttributes();
    }

    addAttribute(): void {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {};

        this.dialog.open(SqsMessageAttributeAddDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.messageAttributeList.push({name: result.Key, stringValue: result.Value, dataType: result.DataType, stringListValues: []});
                this.messageAttributesDatasource = new MatTableDataSource(this.messageAttributeList);
                this.store.dispatch(sqsMessageListActions.addMessageAttribute({messageId: this.messageId, name: result.Key, dataType: result.DataType, value: result.Value}));
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
                if (result?.attribute) {
                    let index = this.messageAttributeList.findIndex(x => x.name === result.attribute.name)
                    if (index > 0) {
                        this.messageAttributeList[index] = result.attribute
                        this.messageAttributesDatasource = new MatTableDataSource(this.messageAttributeList);
                        this.store.dispatch(sqsMessageListActions.updateMessage({messageId: this.messageId, messageAttributes: this.messageAttributeList}));
                    }
                }
            });
        }
    }

    deleteAttribute(key: string): void {
        if (key) {
            this.store.dispatch(sqsMessageListActions.deleteMessageAttribute({
                messageId: this.messageId, attributeName: key
            }));
            this.messageAttributeList = this.messageAttributeList.filter(element => {
                return element.name !== key
            });
            this.messageAttributesDatasource = new MatTableDataSource(this.messageAttributeList);
        }
    }

    close() {
        this.dialogRef.close(false);
    }
}
