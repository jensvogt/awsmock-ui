import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, Inject} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {S3ObjectMetadata} from "../model/s3-object-item";

@Component({
    selector: 's3-metadata-edit-dialog',
    templateUrl: './metadata-edit.component.html',
    standalone: true,
    imports: [
        MatDialogContent,
        MatDialogTitle,
        MatDialogActions,
        MatButton,
        MatDialogClose,
        MatFormField,
        MatLabel,
        FormsModule,
        MatInput,
        ReactiveFormsModule
    ],
    styleUrls: ['./metadata-edit.component.scss']
})
export class S3MetadataEditDialog {

    title: string = 'Add Metadata';
    keyEditable: boolean = false;
    metadata: S3ObjectMetadata = {} as S3ObjectMetadata;

    constructor(private readonly dialogRef: MatDialogRef<S3MetadataEditDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
        if (data?.metadata) {
            this.metadata = data.metadata;
            this.title = 'Edit Metadata';
        } else {
            this.keyEditable = true;
            this.title = 'Add Metadata';
        }
    }

    save() {
        this.dialogRef.close({metadata: this.metadata});
    }
}
