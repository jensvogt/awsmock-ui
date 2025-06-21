import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, OnInit} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatList, MatListItem} from "@angular/material/list";
import {ModuleService} from "../../../services/module.service";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";

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

    url: string | null = '';
    region: string | null = '';
    user: string | null = '';

    constructor(private readonly dialogRef: MatDialogRef<BackendDialog>) {
        this.url = localStorage.getItem('backendUrl');
        this.region = localStorage.getItem('region');
        this.user = localStorage.getItem('user');
    }

    ngOnInit() {
        this.dialogRef.updateSize("600px", "500px");
    }

    save() {
        if (this.url?.startsWith(`http://`)) {
            localStorage.setItem('backendUrl', this.url);
        }
        if (this.region) {
            localStorage.setItem('region', this.region);
        }
        if (this.user) {
            localStorage.setItem('user', this.user);
        }
        this.dialogRef.close();
    }
}
