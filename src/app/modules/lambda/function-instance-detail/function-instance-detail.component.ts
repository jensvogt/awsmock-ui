import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatList, MatListItem} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";
import {CdkCopyToClipboard} from "@angular/cdk/clipboard";
import {DatePipe} from "@angular/common";
import {LambdaInstanceItem} from "../model/lambda-instance-item";

@Component({
    selector: 'function-instance-detail-dialog',
    templateUrl: './function-instance-detail.component.html',
    styleUrls: ['./function-instance-detail.component.scss'],
    standalone: true,
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButton,
        MatIconButton,
        MatIcon,
        MatTooltip,
        CdkCopyToClipboard,
        DatePipe,
    ],
})
export class LambdaInstanceDetailDialog {

    functionName: string = '';
    instanceItem: LambdaInstanceItem;

    constructor(private readonly dialogRef: MatDialogRef<LambdaInstanceDetailDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.functionName = data.functionName;
        this.instanceItem = data.instanceItem;
    }

    close() {
        this.dialogRef.close();
    }
}
