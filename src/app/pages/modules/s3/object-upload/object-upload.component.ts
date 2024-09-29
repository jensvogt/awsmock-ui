import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle} from "@angular/material/card";
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatNoDataRow,
    MatRow,
    MatRowDef,
    MatTable
} from "@angular/material/table";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from "@angular/material/dialog";
import {MatTooltip} from "@angular/material/tooltip";
import {BreadcrumbComponent} from "../../../../shared/breadcrump/breadcrump.component";
import {AwsMockHttpService} from "../../../../services/awsmock-http.service";
import {S3Service} from "../../../../services/s3-service.component";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 's3-object-upload',
    templateUrl: './object-upload.component.html',
    standalone: true,
    imports: [
        MatCard,
        MatCardHeader,
        MatCardContent,
        MatCardActions,
        MatCardSubtitle,
        MatTable,
        MatHeaderCellDef,
        MatCellDef,
        MatColumnDef,
        MatIcon,
        MatHeaderCell,
        MatCell,
        MatHeaderRowDef,
        MatHeaderRow,
        MatSortHeader,
        MatRowDef,
        MatNoDataRow,
        MatIconButton,
        MatRow,
        MatPaginator,
        MatSort,
        MatTooltip,
        BreadcrumbComponent,
        FormsModule,
        MatButton,
        MatDialogActions,
        MatDialogClose,
        MatDialogContent,
        MatDialogTitle,
        MatFormField,
        MatInput,
        MatLabel
    ],
    styleUrls: ['./object-upload.component.scss'],
    providers: [S3Service, AwsMockHttpService]
})
export class ObjectUploadComponent implements OnInit {

    @ViewChild('fileInput') fileInput: ElementRef | undefined;
    bucketName: string = '';
    key: string = '';
    file: File | undefined;
    fileName: string | undefined = '';

    constructor(private snackBar: MatSnackBar, private s3Service: S3Service, private dialogRef: MatDialogRef<ObjectUploadComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.bucketName = data.bucketName;
    }

    ngOnInit(): void {
    }

    upload(event: any) {
        if (this.key.length === 0) {
            this.snackBar.open("Key cannot be empty");
        } else {
            this.file = event.target.files[0] as File | undefined;
            this.fileName = this.file?.name;
        }
    }

    // Method to handle file upload
    doUpload(): void {
        if (this.file) {
            this.s3Service.putObjects(this.bucketName, this.key, this.file.name);
            this.dialogRef.close(true);
        }
    }
}
