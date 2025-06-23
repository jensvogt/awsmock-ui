import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {Component, Inject, OnInit} from "@angular/core";
import {FileImportComponent} from "../../infrastructure/import/file-import/file-import.component";
import {MatTableDataSource} from "@angular/material/table";
import {PageEvent} from "@angular/material/paginator";
import {Sort} from "@angular/material/sort";
import {SqsMessageAttribute} from "../model/sqs-message-item";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {SqsMessageAttributeAddDialog} from "../attribute-add/attribute-add.component";
import {SqsMessageAttributeEditDialog} from "../attribute-edit/attribute-edit.component";

@Component({
    selector: 'queue-send-message-dialog',
    templateUrl: './send-message.component.html',
    styleUrls: ['./send-message.component.scss'],
    standalone: false,
    providers: []
})
export class SendMessageComponentDialog implements OnInit {

    queueUrl: string = '';
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

    constructor(private readonly dialogRef: MatDialogRef<SendMessageComponentDialog>, @Inject(MAT_DIALOG_DATA) public data: any, private readonly fileDialog: MatDialog, private readonly dialog: MatDialog) {
        this.queueUrl = data.queueUrl;
        this.queueName = this.queueUrl.substring(this.queueUrl.lastIndexOf('/') + 1);
    }

    ngOnInit() {
        //this.messageAttributes.Attributes = [];
        this.dialogRef.updateSize("1000px", "600px");
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
