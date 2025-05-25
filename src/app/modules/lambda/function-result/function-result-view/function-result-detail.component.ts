import {Component, Inject, OnInit} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {FooterComponent} from "../../../../shared/footer/footer.component";
import {LambdaService} from "../../service/lambda-service.component";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatIcon} from "@angular/material/icon";

@Component({
    selector: 'function-result-detail',
    templateUrl: './function-result-detail.component.html',
    standalone: true,
    imports: [
        FormsModule,
        MatButton,
        MatDialogActions,
        MatDialogClose,
        MatDialogContent,
        MatCard,
        MatCardContent,
        FooterComponent,
        CdkTextareaAutosize,
        MatFormField,
        MatInput,
        MatLabel,
        MatCardHeader,
        MatIcon,
        MatIconButton
    ],
    styleUrls: ['./function-result-detail.component.scss']
})
export class LambdaResultDetail implements OnInit {

    // Last update
    lastUpdate: Date = new Date();

    lambdaArn: string = '';
    resultOid: string = '';
    requestBody: string = '';
    responseBody: string = '';

    constructor(private snackBar: MatSnackBar, private dialogRef: MatDialogRef<LambdaResultDetail>, @Inject(MAT_DIALOG_DATA) public data: any, private lambdaService: LambdaService) {
        this.lambdaArn = data.lambdaArn;
        this.resultOid = data.resultOid;
    }

    ngOnInit() {
        this.dialogRef.updateSize("1400px", "830px");
        this.loadLambdaResults();
    }

    refresh() {
        this.loadLambdaResults();
    }

    loadLambdaResults() {
        this.lambdaService.getLambdaResultCounter(this.resultOid).subscribe((data: any) => {
            console.log("Result details: ", data);
            this.requestBody = data.lambdaResultCounter.requestBody;
            this.responseBody = data.lambdaResultCounter.responseBody;
            this.lastUpdate = new Date();
        });
    }

}

