import {Component, Inject} from '@angular/core';
import {S3Service} from "../../service/s3-service.component";
import {MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogConfig, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {CdkDrag, CdkDragHandle} from "@angular/cdk/drag-drop";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSlideToggle, MatSlideToggleChange} from "@angular/material/slide-toggle";
import xmlFormat from 'xml-formatter';
import {NgIf} from "@angular/common";
import {MatTab, MatTabGroup, MatTabLabel} from "@angular/material/tabs";
import {MatTooltip} from "@angular/material/tooltip";
import {MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef, MatTable, MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort, MatSortHeader, Sort} from "@angular/material/sort";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {S3ObjectMetadata} from "../../model/s3-object-item";
import {MatIcon} from "@angular/material/icon";
import {S3MetadataEditDialog} from "../../metadata-edit/metadata-edit.component";
import {s3ObjectListActions} from "../state/s3-object-list.actions";
import {Store} from "@ngrx/store";
import {S3ObjectListState} from "../state/s3-object-list.reducer";
import {GetObjectCommandOutput} from "@aws-sdk/client-s3";

@Component({
    selector: 's3-object-view',
    templateUrl: './object-view.component.html',
    styleUrls: ['./object-view.component.scss'],
    standalone: true,
    providers: [S3Service],
    imports: [
        CdkDrag,
        CdkDragHandle,
        CdkTextareaAutosize,
        MatButton,
        MatDialogActions,
        MatDialogClose,
        MatDialogContent,
        MatDialogTitle,
        MatFormField,
        MatInput,
        MatLabel,
        ReactiveFormsModule,
        FormsModule,
        MatSlideToggle,
        NgIf,
        MatTab,
        MatTabGroup,
        MatTabLabel,
        MatTooltip,
        MatCell,
        MatCellDef,
        MatColumnDef,
        MatHeaderCell,
        MatHeaderRow,
        MatHeaderRowDef,
        MatPaginator,
        MatRow,
        MatRowDef,
        MatSort,
        MatSortHeader,
        MatTable,
        MatHeaderCellDef,
        MatNoDataRow,
        MatIcon,
        MatIconButton
    ]
})
export class S3ObjectViewDialog {

    bucketName: string = '';
    key: string = '';
    body: string = '';
    contentType: string = '';
    prettyPrint: boolean = true;
    transformedBody: string = '';
    isImage: boolean = false;
    image: any = '';

    // Message attributes table
    metadataDatasource = new MatTableDataSource<S3ObjectMetadata>();
    metadataLength: number = 0;
    metadata: S3ObjectMetadata[] = [];
    metadataPageSize: number = 10;
    metadataPageIndex: number = 0;
    metadataColumns: any[] = ['key', 'value', 'actions'];
    metadataSortColumns: SortColumn[] = [{column: "key", sortDirection: -1}]
    metadataPageSizeOptions = [5, 10, 20, 50, 100];

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private s3Service: S3Service, private dialog: MatDialog, private store: Store<S3ObjectListState>) {
        this.bucketName = data.bucketName;
        this.key = data.key;
        this.contentType = data.contentType;
        if (data.metadata !== undefined) {
            this.metadata = data.metadata;
            this.metadataLength = this.metadata.length;
            this.metadataDatasource.data = data.metadata;
        }
        //this.body = this.s3Service.download();
        if (data.downloadFlag) {
            this.s3Service.getObject(this.bucketName, this.key).then((data: GetObjectCommandOutput) => {
                if (!data.ContentType?.startsWith("image")) {
                    data.Body?.transformToString().then((data: string) => {
                        this.body = data;
                        if (this.prettyPrint) {
                            this.transformedBody = this.transform(this.body);
                        }
                    });
                } else {
                    this.isImage = true;
                    data.Body?.transformToByteArray().then((data) => {
                        const reader = new FileReader();
                        reader.onload = (e) => this.image = e.target?.result;
                        reader.readAsDataURL(new Blob([data]));
                    })
                }
            });
        } else {
            this.transformedBody = "File too big or invalid content. Not downloaded"
        }
    }

    changePrettyPrint(event: MatSlideToggleChange) {
        if (this.body !== undefined) {
            if (event.checked) {
                this.transformedBody = this.transform(this.body);
            } else {
                this.transformedBody = this.body;
            }
        }
    }

    transform(body: string): string {
        if (this.isJson()) {
            return JSON.stringify(JSON.parse(body), null, 2);
        } else if (this.isXml()) {
            return xmlFormat(body);
        }
        return body;
    }

    isJson() {
        return this.contentType === "application/json" || this.contentType.startsWith("text/plain");
    }

    isXml() {
        return this.contentType === "application/xml";
    }

    handleMetadataPageEvent(e: PageEvent) {
        this.metadataPageSize = e.pageSize;
        this.metadataPageIndex = e.pageIndex;
    }

    metadataSortChange(sortState: Sort) {
        this.metadataSortColumns = [];
        let column = sortState.active;
        let direction = sortState.direction === 'asc' ? 1 : -1;
        this.metadataSortColumns = [{column: column, sortDirection: direction}];
    }

    editMetadata(metadata: S3ObjectMetadata) {
        if (metadata) {
            const dialogConfig = new MatDialogConfig();

            dialogConfig.disableClose = true;
            dialogConfig.autoFocus = true;
            dialogConfig.data = {metadata: metadata};

            this.dialog.open(S3MetadataEditDialog, dialogConfig).afterClosed().subscribe(result => {
                if (result && result.metadata) {
                    let index = this.metadata.findIndex(x => x.key === result.metadata.key)
                    if (index > 0) {
                        this.metadata[index] = result.metadata
                        this.metadataDatasource = new MatTableDataSource(this.metadata);
                        this.metadataLength = this.metadata.length;
                        this.store.dispatch(s3ObjectListActions.updateObject({bucketName: this.bucketName, key: this.key, metadata: this.metadata}));
                    }
                }
            });
        }
    }

    deleteMetadata(metadata: S3ObjectMetadata) {
        if (metadata.key) {
            this.metadata = this.metadata.filter(element => {
                return element.key !== metadata.key
            });
            this.metadataDatasource = new MatTableDataSource(this.metadata);
            this.store.dispatch(s3ObjectListActions.updateObject({bucketName: this.bucketName, key: this.key, metadata: this.metadata}));
        }
    }
}
