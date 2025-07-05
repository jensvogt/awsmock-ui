import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";

@Component({
    selector: 'auto-reload-component',
    templateUrl: './auto-reload.component.html',
    standalone: true,
    imports: [
        FormsModule,
        MatDialogContent,
        MatFormField,
        MatLabel,
        MatInput,
        MatButton,
        MatDialogActions,
        MatDialogClose,

    ],
    styleUrls: ['./auto-reload.component.scss'],
})
export class AutoReloadComponent {

    autoReload: number = 10;

    constructor(private readonly dialogRef: MatDialogRef<AutoReloadComponent>, private readonly snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any) {
        if (localStorage.getItem("autoReload") !== null) {
            this.autoReload = parseInt(<string>localStorage.getItem("autoReload")) / 1000;
        }
    }

    save() {
        localStorage.setItem("autoReload", String(this.autoReload * 1000));
        this.dialogRef.close(String(this.autoReload));
    }
}
