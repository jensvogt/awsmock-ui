import {Component, Inject} from '@angular/core';
import {S3Service} from "../../service/s3-service.component";
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {CdkDrag, CdkDragHandle} from "@angular/cdk/drag-drop";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {GetObjectCommandOutput} from "@aws-sdk/client-s3";
import {MatSlideToggle, MatSlideToggleChange} from "@angular/material/slide-toggle";
import xmlFormat from 'xml-formatter';
import {NgIf} from "@angular/common";
import {DomSanitizer} from "@angular/platform-browser";

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
        NgIf
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

    constructor(private dialogRef: MatDialogRef<S3ObjectViewDialog>, @Inject(MAT_DIALOG_DATA) public data: any, private s3Service: S3Service, private sanitizer: DomSanitizer) {
        this.bucketName = data.bucketName;
        this.key = data.key;
        this.contentType = data.contentType;
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
}
