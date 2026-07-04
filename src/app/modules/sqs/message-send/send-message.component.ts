import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose} from "@angular/material/dialog";
import {Component, Inject, OnInit} from "@angular/core";
import {FileImportComponent} from "../../infrastructure/import/file-import/file-import.component";
import {MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatCellDef, MatHeaderCell, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatNoDataRow} from "@angular/material/table";
import {PageEvent, MatPaginator} from "@angular/material/paginator";
import {Sort} from "@angular/material/sort";
import {SqsMessageAttribute} from "../model/sqs-message-item";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {SqsMessageAttributeAddDialog} from "../attribute-add/attribute-add.component";
import {SqsMessageAttributeEditDialog} from "../attribute-edit/attribute-edit.component";
import {SqsService} from "../service/sqs-service.component";
import {CdkDrag, CdkDragHandle} from "@angular/cdk/drag-drop";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {MatTabGroup, MatTab} from "@angular/material/tabs";
import {MatCardActions} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatSortModule} from "@angular/material/sort";
import {MatIconButton, MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
    selector: 'queue-send-message-dialog',
    templateUrl: './send-message.component.html',
    styleUrls: ['./send-message.component.scss'],
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
        MatCardActions,
        MatFormField,
        MatLabel,
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
    ]
})
export class SendMessageComponentDialog implements OnInit {

    queueUrl: string = '';
    queueArn: string = '';
    queueName: string = '';
    message: string = '';

    // Attributes Table
    messageAttributes = new MatTableDataSource<SqsMessageAttribute>();
    messageAttributeLength: number = 0;
    attributes: SqsMessageAttribute[] = [];
    attributePageSize: number = 10;
    attributePageIndex: number = 0;
    attributeColumns: any[] = ['key', 'value', 'actions'];
    attributeSortColumns: SortColumn[] = [{column: "key", sortDirection: -1}]
    attributePageSizeOptions = [5, 10, 20, 50, 100];

    constructor(private readonly dialogRef: MatDialogRef<SendMessageComponentDialog>, @Inject(MAT_DIALOG_DATA) public data: any, private readonly fileDialog: MatDialog, private readonly dialog: MatDialog, private readonly sqsService: SqsService) {
        this.queueUrl = data.queueUrl;
        this.queueArn = data.queueArn;
        this.queueName = this.queueUrl.substring(this.queueUrl.lastIndexOf('/') + 1);
    }

    ngOnInit() {

        // Load queue default message attributes
        this.sqsService.listDefaultMessageAttributeCounters(this.queueArn, -1, -1, []).subscribe((data: any) => {
            if (data) {
                for (let a in data.attributeCounters) {
                    this.attributes.push({name: a, stringValue: data.attributeCounters[a].StringValue, dataType: data.attributeCounters[a].dataType, stringListValues: data.attributeCounters[a].stringListValues});
                }
                this.messageAttributes = new MatTableDataSource<SqsMessageAttribute>(this.attributes);
            }
        });
    }

    sendMessage() {
        let messageAttributes = this.convertMessageAttributes(this.attributes);
        this.dialogRef.close({message: this.message, attributes: messageAttributes});
    }

    loadFromFile() {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        this.fileDialog.open(FileImportComponent, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.message = result;
            }
        });
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
                return element.name !== key
            });
            this.messageAttributes = new MatTableDataSource(this.attributes);
        }
    }

    editAttribute(key: string) {

        let localAttributes: SqsMessageAttribute[] = this.attributes.filter(element => {
            return element.name === key
        });

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {attribute: localAttributes[0]};

        this.dialog.open(SqsMessageAttributeEditDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.attributes.push({name: result.Key, stringValue: result.Value, dataType: result.DataType, stringListValues: []});
                this.messageAttributes = new MatTableDataSource(this.attributes);
                this.messageAttributeLength = this.attributes.length;
            }
        });
    }

    addAttribute() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {};

        this.dialog.open(SqsMessageAttributeAddDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.attributes.push({name: result.Key, stringValue: result.Value, dataType: result.DataType, stringListValues: []});
                this.messageAttributes = new MatTableDataSource(this.attributes);
                this.messageAttributeLength = this.attributes.length;
            }
        });
    }

    convertMessageAttributes(attributes: SqsMessageAttribute[]): any {
        let messageAttr: any = {}
        attributes.forEach((element) => {
            if (element.dataType === 'String' || element.dataType === 'Number') {
                messageAttr[element.name] = {DataType: element.dataType, StringValue: element.stringValue}
            } else if (element.dataType === 'Binary') {
                messageAttr[element.name] = {DataType: element.dataType, BinaryValue: element.stringValue}
            }
        });
        return messageAttr;
    }
}
