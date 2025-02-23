import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, OnInit} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatList, MatListItem} from "@angular/material/list";
import {ModuleService} from "../../../services/module.service";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {environment} from "../../../../environments/environment";
import {BackendService} from "../../../services/backend-service";

@Component({
    selector: 'backend-dialog',
    templateUrl: './backend.component.html',
    standalone: true,
    imports: [
        MatDialogContent,
        MatDialogTitle,
        MatDialogActions,
        MatButton,
        MatDialogClose,
        FormsModule,
        ReactiveFormsModule,
        MatList,
        MatListItem,
        MatFormField,
        MatInput,
        MatLabel
    ],
    providers: [ModuleService],
    styleUrls: ['./backend.component.scss']
})
export class BackendDialog implements OnInit {

    backendServer: string = environment.gatewayEndpoint;

    constructor(private dialogRef: MatDialogRef<BackendDialog>, private backendService: BackendService) {
    }

    ngOnInit() {
        this.dialogRef.updateSize("600px", "500px");
    }

    save() {
        backendService.setBackendServer = this.backendServer;
        this.dialogRef.close();
    }
}
